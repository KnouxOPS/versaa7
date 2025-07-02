import { useQuery } from "@tanstack/react-query";
import { AiTool, GetToolsListResponse } from "@/shared/types";
import { AI_TOOLS_DATABASE, ToolsDatabase } from "@/data/aiToolsDatabase";

// Simulated API call for local tools (will be replaced with actual local processing)
const fetchLocalToolsList = async (): Promise<GetToolsListResponse> => {
  // Simulate API delay for consistency
  await new Promise((resolve) => setTimeout(resolve, 100));

  const tools = AI_TOOLS_DATABASE.map((tool) => ({
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

  const categories = ToolsDatabase.getCategories();

  return {
    tools,
    categories,
  };
};

export function useAvailableTools() {
  return useQuery<GetToolsListResponse, Error>({
    queryKey: ["tools", "local"],
    queryFn: fetchLocalToolsList,
    staleTime: Infinity, // Tools list doesn't change during app session
    cacheTime: Infinity,
    retry: false, // No retry needed for local data
  });
}

// Additional hooks for tool management
export function useToolById(toolId: string | null) {
  return useQuery<AiTool | null, Error>({
    queryKey: ["tool", toolId],
    queryFn: () => {
      if (!toolId) return null;
      const tool = ToolsDatabase.getToolById(toolId);
      if (!tool) return null;

      return {
        ...tool,
        getName: (lang: "ar" | "en") =>
          lang === "ar" ? tool.name_ar : tool.name_en,
        getDescription: (lang: "ar" | "en") =>
          lang === "ar" ? tool.description_ar : tool.description_en,
        getFeatures: (lang: "ar" | "en") =>
          tool.features.map((f) =>
            lang === "ar" ? f.description_ar : f.description_en,
          ),
      };
    },
    enabled: !!toolId,
    staleTime: Infinity,
  });
}

export function useToolsByCategory(category: string | null) {
  return useQuery<AiTool[], Error>({
    queryKey: ["tools", "category", category],
    queryFn: () => {
      if (!category || category === "all") {
        return AI_TOOLS_DATABASE.map((tool) => ({
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
      }

      const tools = ToolsDatabase.getToolsByCategory(category);
      return tools.map((tool) => ({
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
    },
    enabled: !!category,
    staleTime: Infinity,
  });
}

export function useSearchTools(query: string, language: "ar" | "en" = "en") {
  return useQuery<AiTool[], Error>({
    queryKey: ["tools", "search", query, language],
    queryFn: () => {
      if (!query.trim()) return [];

      const tools = ToolsDatabase.searchTools(query, language);
      return tools.map((tool) => ({
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
    },
    enabled: query.trim().length > 0,
    staleTime: 30000, // Search results cache for 30 seconds
  });
}
