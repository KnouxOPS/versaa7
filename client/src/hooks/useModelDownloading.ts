import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useState, useCallback, useEffect } from "react";
import {
  DownloadModelRequest,
  DownloadModelResponse,
  AIModelIdentifier,
} from "@/shared/types";

// Simulated model download API (will be replaced with actual Electron IPC)
const triggerDownloadApi = async (
  modelIdentifier: string,
): Promise<DownloadModelResponse> => {
  // Simulate API call to local service
  const response = await fetch("http://localhost:5000/api/models/download", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model_backend_identifier: modelIdentifier }),
  });

  if (!response.ok) {
    const errorBody = await response
      .json()
      .catch(() => ({ message: "Download trigger failed" }));
    throw new Error(
      `Download trigger error: ${errorBody.message || response.statusText}`,
    );
  }

  return response.json();
};

// Check model status API
const checkModelStatusApi = async (
  modelIdentifier: string,
): Promise<DownloadModelResponse> => {
  const response = await fetch(
    `http://localhost:5000/api/models/status/${modelIdentifier}`,
  );

  if (!response.ok) {
    throw new Error("Failed to check model status");
  }

  return response.json();
};

interface ModelDownloadState {
  [modelIdentifier: string]: {
    status:
      | "idle"
      | "downloading"
      | "downloaded"
      | "failed"
      | "already_present";
    progress: number;
    message?: string;
    downloadSpeed?: string;
    eta?: string;
  };
}

export function useModelDownloading() {
  const queryClient = useQueryClient();

  // State to track download statuses for all models
  const [modelStates, setModelStates] = useState<ModelDownloadState>({});

  // Polling intervals for active downloads
  const [pollingIntervals, setPollingIntervals] = useState<{
    [key: string]: NodeJS.Timeout;
  }>({});

  // Download mutation
  const downloadMutation = useMutation<DownloadModelResponse, Error, string>({
    mutationFn: triggerDownloadApi,
    onMutate: (modelIdentifier) => {
      // Update state when download starts
      setModelStates((prev) => ({
        ...prev,
        [modelIdentifier]: {
          status: "downloading",
          progress: 0,
          message: "Initializing download...",
        },
      }));
    },
    onSuccess: (data, modelIdentifier) => {
      setModelStates((prev) => ({
        ...prev,
        [modelIdentifier]: {
          status: data.status,
          progress: data.progress ?? 0,
          message: data.message,
        },
      }));

      // Start polling if download is in progress
      if (data.status === "downloading") {
        startPolling(modelIdentifier);
      }
    },
    onError: (error, modelIdentifier) => {
      setModelStates((prev) => ({
        ...prev,
        [modelIdentifier]: {
          status: "failed",
          progress: 0,
          message: error.message,
        },
      }));
    },
  });

  // Start polling for download progress
  const startPolling = useCallback(
    (modelIdentifier: string) => {
      // Clear existing interval if any
      if (pollingIntervals[modelIdentifier]) {
        clearInterval(pollingIntervals[modelIdentifier]);
      }

      const interval = setInterval(async () => {
        try {
          const status = await checkModelStatusApi(modelIdentifier);

          setModelStates((prev) => ({
            ...prev,
            [modelIdentifier]: {
              status: status.status,
              progress: status.progress ?? 0,
              message: status.message,
            },
          }));

          // Stop polling if download is complete or failed
          if (
            status.status === "downloaded" ||
            status.status === "failed" ||
            status.status === "already_present"
          ) {
            clearInterval(pollingIntervals[modelIdentifier]);
            setPollingIntervals((prev) => {
              const newIntervals = { ...prev };
              delete newIntervals[modelIdentifier];
              return newIntervals;
            });
          }
        } catch (error) {
          console.error(`Error polling status for ${modelIdentifier}:`, error);
          // Continue polling on error, don't stop
        }
      }, 2000); // Poll every 2 seconds

      setPollingIntervals((prev) => ({
        ...prev,
        [modelIdentifier]: interval,
      }));
    },
    [pollingIntervals],
  );

  // Clean up intervals on unmount
  useEffect(() => {
    return () => {
      Object.values(pollingIntervals).forEach(clearInterval);
    };
  }, [pollingIntervals]);

  // Get all model statuses
  const getModelStatus = useCallback(
    (modelIdentifier: string) => {
      return (
        modelStates[modelIdentifier] || {
          status: "idle" as const,
          progress: 0,
          message: "Not downloaded",
        }
      );
    },
    [modelStates],
  );

  // Check if model is ready for use
  const isModelReady = useCallback(
    (modelIdentifier: string) => {
      const state = modelStates[modelIdentifier];
      return (
        state?.status === "downloaded" || state?.status === "already_present"
      );
    },
    [modelStates],
  );

  // Get download statistics
  const getDownloadStats = useCallback(() => {
    const stats = {
      total: Object.keys(modelStates).length,
      downloading: 0,
      downloaded: 0,
      failed: 0,
      totalProgress: 0,
    };

    Object.values(modelStates).forEach((state) => {
      if (state.status === "downloading") stats.downloading++;
      if (state.status === "downloaded" || state.status === "already_present")
        stats.downloaded++;
      if (state.status === "failed") stats.failed++;
      stats.totalProgress += state.progress;
    });

    if (stats.total > 0) {
      stats.totalProgress = stats.totalProgress / stats.total;
    }

    return stats;
  }, [modelStates]);

  // Download model function
  const downloadModel = useCallback(
    (modelIdentifier: string) => {
      downloadMutation.mutate(modelIdentifier);
    },
    [downloadMutation],
  );

  // Download multiple models
  const downloadMultipleModels = useCallback(
    (modelIdentifiers: string[]) => {
      modelIdentifiers.forEach((id) => {
        setTimeout(() => downloadModel(id), Math.random() * 1000); // Stagger downloads
      });
    },
    [downloadModel],
  );

  // Cancel download (if supported by backend)
  const cancelDownload = useCallback(
    (modelIdentifier: string) => {
      if (pollingIntervals[modelIdentifier]) {
        clearInterval(pollingIntervals[modelIdentifier]);
        setPollingIntervals((prev) => {
          const newIntervals = { ...prev };
          delete newIntervals[modelIdentifier];
          return newIntervals;
        });
      }

      setModelStates((prev) => ({
        ...prev,
        [modelIdentifier]: {
          status: "idle",
          progress: 0,
          message: "Download cancelled",
        },
      }));
    },
    [pollingIntervals],
  );

  return {
    downloadModel,
    downloadMultipleModels,
    cancelDownload,
    getModelStatus,
    isModelReady,
    getDownloadStats,
    modelStates,
    isDownloading: downloadMutation.isLoading,
    downloadError: downloadMutation.error,
  };
}

// Hook to get required models for a tool
export function useToolModelRequirements(toolId: string | null) {
  return useQuery({
    queryKey: ["tool", "models", toolId],
    queryFn: async () => {
      if (!toolId) return [];

      // This would typically fetch from your tools database
      // For now, return mock data based on tool patterns
      const modelMap: { [key: string]: string[] } = {
        face_swap: [AIModelIdentifier.DEEPFACELAB_SAEHD],
        beauty_filter: [AIModelIdentifier.GFPGAN, AIModelIdentifier.CODEFORMER],
        hd_boost: [AIModelIdentifier.REAL_ESRGAN],
        bg_remover: [AIModelIdentifier.MODNET, AIModelIdentifier.REMBG],
        bg_replacer: [
          AIModelIdentifier.STABLE_DIFFUSION_V21,
          AIModelIdentifier.CONTROLNET,
        ],
        style_transfer: [AIModelIdentifier.STABLE_DIFFUSION_XL],
        cartoonizer: [
          AIModelIdentifier.ANYTHING_V6,
          AIModelIdentifier.CARTOONGAN,
        ],
        object_remover: [
          AIModelIdentifier.CLIP_SAM,
          AIModelIdentifier.STABLE_DIFFUSION_XL,
        ],
        lighting_master: [
          AIModelIdentifier.CONTROLNET,
          AIModelIdentifier.LIGHTINGNET,
        ],
      };

      return modelMap[toolId] || [];
    },
    enabled: !!toolId,
    staleTime: Infinity,
  });
}
