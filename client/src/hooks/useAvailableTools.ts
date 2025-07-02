import { useQuery } from "@tanstack/react-query";
import { GetToolsListResponse, AiTool } from "@/shared/types";
import {
  COMPREHENSIVE_AI_TOOLS,
  TOOL_CATEGORIES,
} from "@/data/comprehensiveToolsDatabase";

// Simulate fetching tools from backend or use local comprehensive database
const fetchToolsList = async (): Promise<GetToolsListResponse> => {
  // For now, use local comprehensive database
  // In production, this would fetch from backend /get_tools_list endpoint

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Add helper methods to tools
  const toolsWithMethods = COMPREHENSIVE_AI_TOOLS.map((tool) => ({
    ...tool,
    getName: (lang: "ar" | "en") =>
      lang === "ar" ? tool.name_ar : tool.name_en,
    getDescription: (lang: "ar" | "en") =>
      lang === "ar" ? tool.description_ar : tool.description_en,
    getFeatures: (lang: "ar" | "en") =>
      tool.features.map((f) =>
        lang === "ar" ? f.description_ar : f.description_en,
      ),
  }));

  return {
    tools: toolsWithMethods,
    categories: TOOL_CATEGORIES,
  };
};

export function useAvailableTools() {
  return useQuery<GetToolsListResponse, Error>({
    queryKey: ["tools", "list"],
    queryFn: fetchToolsList,
    staleTime: Infinity, // Tools list doesn't change during app session
    retry: 3,
    retryDelay: 1000,
  });
}

// Additional hooks for specific tool queries
export function useToolById(toolId: string) {
  const { data: toolsData } = useAvailableTools();

  return toolsData?.tools.find((tool) => tool.id === toolId) || null;
}

export function useToolsByCategory(category: string) {
  const { data: toolsData } = useAvailableTools();

  return toolsData?.tools.filter((tool) => tool.category === category) || [];
}
