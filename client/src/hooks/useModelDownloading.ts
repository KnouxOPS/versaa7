import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DownloadModelRequest, DownloadModelResponse } from "@/shared/types";
import { useState, useCallback } from "react";

// API call to trigger download
const triggerDownloadApi = async (
  modelIdentifier: string,
): Promise<DownloadModelResponse> => {
  const response = await fetch("/api/ai/download_model", {
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

// Simulate progress tracking for development
const simulateDownloadProgress = (
  modelIdentifier: string,
  onProgress: (progress: number) => void,
  onComplete: () => void,
) => {
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 0.15; // Random progress increments

    if (progress >= 1) {
      progress = 1;
      onProgress(progress);
      onComplete();
      clearInterval(interval);
    } else {
      onProgress(progress);
    }
  }, 1000); // Update every second

  return () => clearInterval(interval);
};

export function useModelDownloading() {
  const queryClient = useQueryClient();

  // Track download statuses for different models
  const [modelDownloadStatuses, setModelDownloadStatuses] = useState<
    Record<
      string,
      "idle" | "downloading" | "downloaded" | "failed" | "already_present"
    >
  >({});

  // Track progress for downloading models
  const [modelDownloadProgress, setModelDownloadProgress] = useState<
    Record<string, number>
  >({});

  // Active download cancellation functions
  const [activeCancelers, setActiveCancelers] = useState<
    Record<string, () => void>
  >({});

  const downloadMutation = useMutation<DownloadModelResponse, Error, string>({
    mutationFn: triggerDownloadApi,
    onMutate: (modelIdentifier) => {
      // When download starts, update status
      setModelDownloadStatuses((prev) => ({
        ...prev,
        [modelIdentifier]: "downloading",
      }));
      setModelDownloadProgress((prev) => ({ ...prev, [modelIdentifier]: 0 }));

      // Start progress simulation
      const cancelProgress = simulateDownloadProgress(
        modelIdentifier,
        (progress) => {
          setModelDownloadProgress((prev) => ({
            ...prev,
            [modelIdentifier]: progress,
          }));
        },
        () => {
          setModelDownloadStatuses((prev) => ({
            ...prev,
            [modelIdentifier]: "downloaded",
          }));
          setActiveCancelers((prev) => {
            const { [modelIdentifier]: removed, ...rest } = prev;
            return rest;
          });
        },
      );

      setActiveCancelers((prev) => ({
        ...prev,
        [modelIdentifier]: cancelProgress,
      }));
    },
    onSuccess: (data, modelIdentifier) => {
      const finalStatus =
        data.status === "downloading" ? "downloaded" : data.status;
      setModelDownloadStatuses((prev) => ({
        ...prev,
        [modelIdentifier]: finalStatus,
      }));

      if (data.progress !== undefined) {
        setModelDownloadProgress((prev) => ({
          ...prev,
          [modelIdentifier]:
            data.progress ??
            (finalStatus === "downloaded" || finalStatus === "already_present"
              ? 1.0
              : 0),
        }));
      }

      if (finalStatus === "downloaded") {
        console.log(`Model ${modelIdentifier} successfully downloaded.`);
      } else if (finalStatus === "failed") {
        console.error(`Model ${modelIdentifier} download failed.`);
      }
    },
    onError: (error, modelIdentifier) => {
      setModelDownloadStatuses((prev) => ({
        ...prev,
        [modelIdentifier]: "failed",
      }));
      setModelDownloadProgress((prev) => ({ ...prev, [modelIdentifier]: 0 }));

      // Cancel progress simulation
      const canceler = activeCancelers[modelIdentifier];
      if (canceler) {
        canceler();
        setActiveCancelers((prev) => {
          const { [modelIdentifier]: removed, ...rest } = prev;
          return rest;
        });
      }

      console.error(
        `Error triggering download for model ${modelIdentifier}:`,
        error,
      );
    },
  });

  const cancelDownload = useCallback(
    (modelIdentifier: string) => {
      const canceler = activeCancelers[modelIdentifier];
      if (canceler) {
        canceler();
        setActiveCancelers((prev) => {
          const { [modelIdentifier]: removed, ...rest } = prev;
          return rest;
        });
        setModelDownloadStatuses((prev) => ({
          ...prev,
          [modelIdentifier]: "idle",
        }));
        setModelDownloadProgress((prev) => ({ ...prev, [modelIdentifier]: 0 }));
      }
    },
    [activeCancelers],
  );

  return {
    downloadModelMutation: downloadMutation,
    modelDownloadStatuses,
    modelDownloadProgress,
    cancelDownload,
    isDownloading: (modelId: string) =>
      modelDownloadStatuses[modelId] === "downloading",
    isDownloaded: (modelId: string) =>
      ["downloaded", "already_present"].includes(
        modelDownloadStatuses[modelId] || "idle",
      ),
    getProgress: (modelId: string) => modelDownloadProgress[modelId] || 0,
  };
}
