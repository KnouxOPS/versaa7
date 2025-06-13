import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";

// أنواع البيانات
interface AIService {
  id: string;
  name: string;
  model: string;
  isVIP: boolean;
  gpuRequired: boolean;
  memoryLimit: string;
  concurrentLimit: number;
  activeProcessing: number;
  estimatedTime: number;
  workersReady: boolean;
  status: "ready" | "busy" | "offline" | "error";
}

interface ProcessingJob {
  id: string;
  serviceId: string;
  status: "queued" | "processing" | "completed" | "failed";
  progress: number;
  message: string;
  startTime: number;
  endTime?: number;
  result?: {
    processedImage: string;
    metadata: any;
  };
  error?: string;
}

interface AIServiceState {
  services: Record<string, AIService>;
  jobs: Record<string, ProcessingJob>;
  activeJobs: string[];
  isConnected: boolean;
  serverStatus: {
    totalServices: number;
    activeProcessing: number;
    queueLength: number;
    uptime: number;
  };
  vipSession: {
    isActive: boolean;
    tier?: "gold" | "platinum" | "diamond";
    token?: string;
    expiresAt?: Date;
  };
}

type AIServiceAction =
  | { type: "SET_SERVICES"; payload: Record<string, AIService> }
  | {
      type: "UPDATE_SERVICE";
      payload: { id: string; updates: Partial<AIService> };
    }
  | { type: "ADD_JOB"; payload: ProcessingJob }
  | {
      type: "UPDATE_JOB";
      payload: { id: string; updates: Partial<ProcessingJob> };
    }
  | { type: "REMOVE_JOB"; payload: string }
  | { type: "SET_CONNECTION_STATUS"; payload: boolean }
  | { type: "UPDATE_SERVER_STATUS"; payload: AIServiceState["serverStatus"] }
  | { type: "SET_VIP_SESSION"; payload: AIServiceState["vipSession"] }
  | { type: "CLEAR_VIP_SESSION" };

// حالة ابتدائية
const initialState: AIServiceState = {
  services: {},
  jobs: {},
  activeJobs: [],
  isConnected: false,
  serverStatus: {
    totalServices: 0,
    activeProcessing: 0,
    queueLength: 0,
    uptime: 0,
  },
  vipSession: {
    isActive: false,
  },
};

// Reducer
function aiServiceReducer(
  state: AIServiceState,
  action: AIServiceAction,
): AIServiceState {
  switch (action.type) {
    case "SET_SERVICES":
      return {
        ...state,
        services: action.payload,
      };

    case "UPDATE_SERVICE":
      return {
        ...state,
        services: {
          ...state.services,
          [action.payload.id]: {
            ...state.services[action.payload.id],
            ...action.payload.updates,
          },
        },
      };

    case "ADD_JOB":
      return {
        ...state,
        jobs: {
          ...state.jobs,
          [action.payload.id]: action.payload,
        },
        activeJobs: [...state.activeJobs, action.payload.id],
      };

    case "UPDATE_JOB":
      const updatedJob = {
        ...state.jobs[action.payload.id],
        ...action.payload.updates,
      };

      let newActiveJobs = state.activeJobs;
      if (updatedJob.status === "completed" || updatedJob.status === "failed") {
        newActiveJobs = state.activeJobs.filter(
          (id) => id !== action.payload.id,
        );
      }

      return {
        ...state,
        jobs: {
          ...state.jobs,
          [action.payload.id]: updatedJob,
        },
        activeJobs: newActiveJobs,
      };

    case "REMOVE_JOB":
      const { [action.payload]: removedJob, ...remainingJobs } = state.jobs;
      return {
        ...state,
        jobs: remainingJobs,
        activeJobs: state.activeJobs.filter((id) => id !== action.payload),
      };

    case "SET_CONNECTION_STATUS":
      return {
        ...state,
        isConnected: action.payload,
      };

    case "UPDATE_SERVER_STATUS":
      return {
        ...state,
        serverStatus: action.payload,
      };

    case "SET_VIP_SESSION":
      return {
        ...state,
        vipSession: action.payload,
      };

    case "CLEAR_VIP_SESSION":
      return {
        ...state,
        vipSession: { isActive: false },
      };

    default:
      return state;
  }
}

// Context
const AIServiceContext = createContext<{
  state: AIServiceState;
  dispatch: React.Dispatch<AIServiceAction>;
  actions: {
    loadServices: () => Promise<void>;
    submitJob: (
      serviceId: string,
      imageFile: File,
      settings?: any,
    ) => Promise<string>;
    submitVIPJob: (
      serviceId: string,
      imageFile: File,
      settings?: any,
    ) => Promise<string>;
    authenticateVIP: (key: string) => Promise<boolean>;
    renewVIPSession: () => Promise<boolean>;
    cancelJob: (jobId: string) => void;
    getJobHistory: () => ProcessingJob[];
    connectWebSocket: () => void;
    disconnectWebSocket: () => void;
  };
} | null>(null);

// Provider Component
export function AIServiceProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(aiServiceReducer, initialState);
  const wsRef = React.useRef<WebSocket | null>(null);

  // تحميل الخدمات
  const loadServices = useCallback(async () => {
    try {
      const response = await fetch("/api/ai/services");
      if (!response.ok) throw new Error("Failed to load services");

      const data = await response.json();
      if (data.success) {
        dispatch({ type: "SET_SERVICES", payload: data.services });
        dispatch({ type: "SET_CONNECTION_STATUS", payload: true });
      }
    } catch (error) {
      console.error("خطأ في تحميل الخدمات:", error);
      dispatch({ type: "SET_CONNECTION_STATUS", payload: false });
    }
  }, []);

  // إرسال مهمة معالجة
  const submitJob = useCallback(
    async (serviceId: string, imageFile: File, settings = {}) => {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("serviceId", serviceId);
      formData.append("settings", JSON.stringify(settings));
      formData.append("isVIP", "false");

      try {
        const response = await fetch("/api/ai/process", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // إعداد Server-Sent Events للاستماع للتحديثات
        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response body");

        let jobId = "";

        const readChunk = async (): Promise<void> => {
          const { done, value } = await reader.read();
          if (done) return;

          const chunk = new TextDecoder().decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.substring(6));

                if (data.type === "started") {
                  jobId = data.requestId;
                  const job: ProcessingJob = {
                    id: jobId,
                    serviceId,
                    status: "processing",
                    progress: 10,
                    message: data.message || "بدأت المعالجة...",
                    startTime: Date.now(),
                  };
                  dispatch({ type: "ADD_JOB", payload: job });
                } else if (data.type === "progress") {
                  dispatch({
                    type: "UPDATE_JOB",
                    payload: {
                      id: jobId,
                      updates: {
                        progress: data.progress,
                        message: data.message,
                      },
                    },
                  });
                } else if (data.type === "completed") {
                  dispatch({
                    type: "UPDATE_JOB",
                    payload: {
                      id: jobId,
                      updates: {
                        status: "completed",
                        progress: 100,
                        message: "اكتملت المعالجة!",
                        endTime: Date.now(),
                        result: {
                          processedImage: data.processedImage,
                          metadata: data.metadata,
                        },
                      },
                    },
                  });
                } else if (data.type === "error") {
                  dispatch({
                    type: "UPDATE_JOB",
                    payload: {
                      id: jobId,
                      updates: {
                        status: "failed",
                        message: data.error || "فشلت المعالجة",
                        endTime: Date.now(),
                        error: data.error,
                      },
                    },
                  });
                }
              } catch (parseError) {
                console.error("خطأ في تحليل SSE data:", parseError);
              }
            }
          }

          return readChunk();
        };

        await readChunk();
        return jobId;
      } catch (error) {
        console.error("خطأ في إرسال المهمة:", error);
        throw error;
      }
    },
    [],
  );

  // إرسال مهمة VIP
  const submitVIPJob = useCallback(
    async (serviceId: string, imageFile: File, settings = {}) => {
      if (!state.vipSession.isActive || !state.vipSession.token) {
        throw new Error("مطلوب جلسة VIP صحيحة");
      }

      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("serviceId", serviceId);
      formData.append("settings", JSON.stringify(settings));
      formData.append("isVIP", "true");

      try {
        const response = await fetch("/api/ai/process", {
          method: "POST",
          headers: {
            "x-vip-token": state.vipSession.token,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // نفس منطق معالجة SSE كما في submitJob
        return await handleSSEResponse(response, serviceId);
      } catch (error) {
        console.error("خطأ في إرسال مهمة VIP:", error);
        throw error;
      }
    },
    [state.vipSession],
  );

  // معالجة استجابة SSE (دالة مساعدة)
  const handleSSEResponse = async (
    response: Response,
    serviceId: string,
  ): Promise<string> => {
    const reader = response.body?.getReader();
    if (!reader) throw new Error("No response body");

    let jobId = "";

    const readChunk = async (): Promise<void> => {
      const { done, value } = await reader.read();
      if (done) return;

      const chunk = new TextDecoder().decode(value);
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.substring(6));

            if (data.type === "started") {
              jobId = data.requestId;
              const job: ProcessingJob = {
                id: jobId,
                serviceId,
                status: "processing",
                progress: 10,
                message: data.message || "بدأت المعالجة...",
                startTime: Date.now(),
              };
              dispatch({ type: "ADD_JOB", payload: job });
            } else if (data.type === "progress") {
              dispatch({
                type: "UPDATE_JOB",
                payload: {
                  id: jobId,
                  updates: {
                    progress: data.progress,
                    message: data.message,
                  },
                },
              });
            } else if (data.type === "completed") {
              dispatch({
                type: "UPDATE_JOB",
                payload: {
                  id: jobId,
                  updates: {
                    status: "completed",
                    progress: 100,
                    message: "اكتملت المعالجة!",
                    endTime: Date.now(),
                    result: {
                      processedImage: data.processedImage,
                      metadata: data.metadata,
                    },
                  },
                },
              });
            } else if (data.type === "error") {
              dispatch({
                type: "UPDATE_JOB",
                payload: {
                  id: jobId,
                  updates: {
                    status: "failed",
                    message: data.error || "فشلت المعالجة",
                    endTime: Date.now(),
                    error: data.error,
                  },
                },
              });
            }
          } catch (parseError) {
            console.error("خطأ في تحليل SSE data:", parseError);
          }
        }
      }

      return readChunk();
    };

    await readChunk();
    return jobId;
  };

  // تسجيل دخول VIP
  const authenticateVIP = useCallback(async (key: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/ai/vip/authenticate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vipKey: key }),
      });

      if (!response.ok) return false;

      const data = await response.json();
      if (data.success) {
        const vipSession = {
          isActive: true,
          tier: data.tier,
          token: data.token,
          expiresAt: new Date(data.expiresAt),
        };

        dispatch({ type: "SET_VIP_SESSION", payload: vipSession });

        // حفظ في localStorage
        localStorage.setItem("vip_session", JSON.stringify(vipSession));

        return true;
      }

      return false;
    } catch (error) {
      console.error("خطأ في تسجيل د��ول VIP:", error);
      return false;
    }
  }, []);

  // تجديد جلسة VIP
  const renewVIPSession = useCallback(async (): Promise<boolean> => {
    if (!state.vipSession.token) return false;

    try {
      const response = await fetch("/api/ai/vip/renew", {
        method: "POST",
        headers: {
          "x-vip-token": state.vipSession.token,
        },
      });

      if (!response.ok) return false;

      const data = await response.json();
      if (data.success) {
        const updatedSession = {
          ...state.vipSession,
          token: data.newToken,
          expiresAt: new Date(data.expiresAt),
        };

        dispatch({ type: "SET_VIP_SESSION", payload: updatedSession });
        localStorage.setItem("vip_session", JSON.stringify(updatedSession));

        return true;
      }

      return false;
    } catch (error) {
      console.error("خطأ في تجديد جلسة VIP:", error);
      return false;
    }
  }, [state.vipSession.token]);

  // إلغاء مهمة
  const cancelJob = useCallback((jobId: string) => {
    dispatch({ type: "REMOVE_JOB", payload: jobId });
  }, []);

  // الحصول على سجل المهام
  const getJobHistory = useCallback((): ProcessingJob[] => {
    return Object.values(state.jobs).sort((a, b) => b.startTime - a.startTime);
  }, [state.jobs]);

  // WebSocket للتحديثات المباشرة
  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(`ws://localhost:5000/api/ai/ws`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("🔗 متصل بـ AI WebSocket");
      dispatch({ type: "SET_CONNECTION_STATUS", payload: true });
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "server_status") {
          dispatch({ type: "UPDATE_SERVER_STATUS", payload: data.status });
        } else if (data.type === "service_update") {
          dispatch({
            type: "UPDATE_SERVICE",
            payload: { id: data.serviceId, updates: data.updates },
          });
        }
      } catch (error) {
        console.error("خطأ في معالجة WebSocket message:", error);
      }
    };

    ws.onclose = () => {
      console.log("❌ انقطع الاتصال بـ AI WebSocket");
      dispatch({ type: "SET_CONNECTION_STATUS", payload: false });

      // إعادة الاتصال بعد 5 ثوان
      setTimeout(connectWebSocket, 5000);
    };

    ws.onerror = (error) => {
      console.error("خطأ في AI WebSocket:", error);
    };
  }, []);

  const disconnectWebSocket = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  // تأثيرات التحميل الأولي
  useEffect(() => {
    loadServices();

    // تحميل جلسة VIP من localStorage
    const savedSession = localStorage.getItem("vip_session");
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        if (new Date(session.expiresAt) > new Date()) {
          dispatch({ type: "SET_VIP_SESSION", payload: session });
        } else {
          localStorage.removeItem("vip_session");
        }
      } catch (error) {
        localStorage.removeItem("vip_session");
      }
    }

    // تحديث دوري للحالة
    const interval = setInterval(() => {
      loadServices();
    }, 30000); // كل 30 ثانية

    return () => clearInterval(interval);
  }, [loadServices]);

  // تنظيف عند إغلاق المكون
  useEffect(() => {
    return () => {
      disconnectWebSocket();
    };
  }, [disconnectWebSocket]);

  const actions = {
    loadServices,
    submitJob,
    submitVIPJob,
    authenticateVIP,
    renewVIPSession,
    cancelJob,
    getJobHistory,
    connectWebSocket,
    disconnectWebSocket,
  };

  return (
    <AIServiceContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </AIServiceContext.Provider>
  );
}

// Hook للاستخدام
export function useAIService() {
  const context = useContext(AIServiceContext);
  if (!context) {
    throw new Error("useAIService must be used within AIServiceProvider");
  }
  return context;
}

// Hook مخصص للخدمات
export function useAIServices() {
  const { state } = useAIService();
  return {
    services: state.services,
    isConnected: state.isConnected,
    serverStatus: state.serverStatus,
  };
}

// Hook مخصص للمهام
export function useAIJobs() {
  const { state, actions } = useAIService();
  return {
    jobs: state.jobs,
    activeJobs: state.activeJobs.map((id) => state.jobs[id]),
    jobHistory: actions.getJobHistory(),
    submitJob: actions.submitJob,
    cancelJob: actions.cancelJob,
  };
}

// Hook مخصص لـ VIP
export function useVIP() {
  const { state, actions } = useAIService();
  return {
    vipSession: state.vipSession,
    authenticateVIP: actions.authenticateVIP,
    renewVIPSession: actions.renewVIPSession,
    submitVIPJob: actions.submitVIPJob,
  };
}

// تصدير الأنواع
export type { AIService, ProcessingJob, AIServiceState };
