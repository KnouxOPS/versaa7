import { useMutation } from "@tanstack/react-query";
import { ProcessToolRequestPayload, ProcessToolResponse } from "@/shared/types";

// API call to process tool
const processToolApi = async (
  payload: ProcessToolRequestPayload,
): Promise<ProcessToolResponse> => {
  const response = await fetch("/api/ai/process_tool", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response
      .json()
      .catch(() => ({ message: "Processing failed" }));
    throw new Error(
      `Processing error: ${errorBody.message || response.statusText}`,
    );
  }

  return response.json();
};

export function useProcessTool() {
  return useMutation<ProcessToolResponse, Error, ProcessToolRequestPayload>({
    mutationFn: processToolApi,
    onError: (error) => {
      console.error("Tool processing failed:", error);
    },
  });
}
