import React, { useState, useCallback, useMemo } from "react";
import {
  AiTool,
  MaskData,
  ProcessToolRequestPayload,
  ProcessToolResponse,
} from "@/shared/types";
import { useAvailableTools, useToolById } from "@/hooks/useAvailableTools";
import { useModelDownloading } from "@/hooks/useModelDownloading";
import { useLanguage } from "@/hooks/useLanguage";
import { ToolsList } from "./ToolsList";
import { ImageCanvasWithMasking } from "./ImageCanvasWithMasking";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation } from "@tanstack/react-query";

// Mock API function for local processing (will be replaced with actual local AI)
const processToolLocally = async (
  payload: ProcessToolRequestPayload,
): Promise<ProcessToolResponse> => {
  // Simulate processing time
  await new Promise((resolve) =>
    setTimeout(resolve, 2000 + Math.random() * 3000),
  );

  // Simulate different outcomes based on tool
  if (Math.random() > 0.1) {
    // 90% success rate
    return {
      success: true,
      editedImage: payload.image, // Return same image for now (will be replaced with actual processing)
      message: `${payload.tool_id} processing completed successfully`,
    };
  } else {
    return {
      success: false,
      message: `${payload.tool_id} processing failed: Simulated error`,
    };
  }
};

interface ToolSettingsProps {
  tool: AiTool;
  settings: Record<string, any>;
  onSettingsChange: (settings: Record<string, any>) => void;
  language: "ar" | "en";
}

const ToolSettings: React.FC<ToolSettingsProps> = ({
  tool,
  settings,
  onSettingsChange,
  language,
}) => {
  const updateSetting = useCallback(
    (key: string, value: any) => {
      onSettingsChange({ ...settings, [key]: value });
    },
    [settings, onSettingsChange],
  );

  // Generate UI based on tool's input schema
  const renderSettingControl = (key: string, schema: any) => {
    const currentValue = settings[key] ?? schema.default;

    switch (schema.type) {
      case "number":
        if (schema.enum) {
          return (
            <Select
              value={currentValue?.toString()}
              onValueChange={(value) => updateSetting(key, parseInt(value))}
            >
              <SelectTrigger className="bg-white/5 border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {schema.enum.map((option: number) => (
                  <SelectItem key={option} value={option.toString()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        } else {
          return (
            <div className="space-y-2">
              <Slider
                value={[currentValue || schema.default || 0]}
                onValueChange={([value]) => updateSetting(key, value)}
                min={schema.minimum || 0}
                max={schema.maximum || 1}
                step={0.1}
              />
              <div className="text-xs text-gray-400 text-center">
                {currentValue || schema.default || 0}
              </div>
            </div>
          );
        }

      case "string":
        if (schema.enum) {
          return (
            <Select
              value={currentValue}
              onValueChange={(value) => updateSetting(key, value)}
            >
              <SelectTrigger className="bg-white/5 border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {schema.enum.map((option: string) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        } else {
          return (
            <Input
              value={currentValue || ""}
              onChange={(e) => updateSetting(key, e.target.value)}
              placeholder={schema.description}
              className="bg-white/5 border-white/10"
            />
          );
        }

      case "boolean":
        return (
          <Button
            onClick={() => updateSetting(key, !currentValue)}
            variant={currentValue ? "default" : "outline"}
            size="sm"
            className="w-full"
          >
            {currentValue ? "Enabled" : "Disabled"}
          </Button>
        );

      default:
        return null;
    }
  };

  if (!tool.input_schema) return null;

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-300">Tool Settings</h4>
      {Object.entries(tool.input_schema).map(([key, schema]: [string, any]) => (
        <div key={key} className="space-y-2">
          <label className="text-xs font-medium text-gray-400 capitalize">
            {key.replace(/_/g, " ")}:{" "}
            {schema.required && <span className="text-red-400">*</span>}
          </label>
          {renderSettingControl(key, schema)}
          {schema.description && (
            <p className="text-xs text-gray-500">{schema.description}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export const MainImageEditor: React.FC = () => {
  // State management
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [currentMask, setCurrentMask] = useState<MaskData | null>(null);
  const [secondImage, setSecondImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [toolSettings, setToolSettings] = useState<Record<string, any>>({});
  const [activeTab, setActiveTab] = useState<"tools" | "editor">("tools");

  // Hooks
  const { language } = useLanguage();
  const lang = language || "en";

  const { data: toolsData, isLoading: isLoadingTools } = useAvailableTools();
  const { data: selectedTool } = useToolById(selectedToolId);
  const { isModelReady } = useModelDownloading();

  // Processing mutation
  const processingMutation = useMutation<
    ProcessToolResponse,
    Error,
    ProcessToolRequestPayload
  >({
    mutationFn: processToolLocally,
    onSuccess: (data) => {
      if (data.success && data.editedImage) {
        setEditedImage(data.editedImage);
      }
    },
  });

  // Handlers
  const handleToolSelect = useCallback((tool: AiTool) => {
    setSelectedToolId(tool.id);
    setActiveTab("editor");
    setPrompt("");
    setToolSettings({});
    setCurrentMask(null);
    setSecondImage(null);
  }, []);

  const handleImageUpload = useCallback((imageUrl: string) => {
    setOriginalImage(imageUrl);
    setEditedImage(null);
    setCurrentMask(null);
  }, []);

  const handleSecondImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setSecondImage(result);
      };
      reader.readAsDataURL(file);
    },
    [],
  );

  const handleMaskChange = useCallback((maskData: MaskData | null) => {
    setCurrentMask(maskData);
  }, []);

  const handleSettingsChange = useCallback((settings: Record<string, any>) => {
    setToolSettings(settings);
  }, []);

  // Validation
  const canProcess = useMemo(() => {
    if (!selectedTool || !originalImage || processingMutation.isLoading)
      return false;

    // Check if model is ready
    if (!isModelReady(selectedTool.model_info.backend_identifier)) return false;

    // Check required inputs
    if (selectedTool.requires_prompt && !prompt.trim()) return false;
    if (selectedTool.requires_mask && !currentMask) return false;
    if (selectedTool.requires_second_image && !secondImage) return false;

    return true;
  }, [
    selectedTool,
    originalImage,
    isModelReady,
    prompt,
    currentMask,
    secondImage,
    processingMutation.isLoading,
  ]);

  const handleProcess = useCallback(async () => {
    if (!canProcess || !selectedTool || !originalImage) return;

    const payload: ProcessToolRequestPayload = {
      tool_id: selectedTool.id,
      image: originalImage,
      mask: currentMask?.base64,
      prompt: selectedTool.requires_prompt ? prompt : undefined,
      image2: selectedTool.requires_second_image ? secondImage : undefined,
      settings: toolSettings,
    };

    processingMutation.mutate(payload);
  }, [
    canProcess,
    selectedTool,
    originalImage,
    currentMask,
    prompt,
    secondImage,
    toolSettings,
    processingMutation,
  ]);

  const getModelStatusForTool = (tool: AiTool) => {
    return isModelReady(tool.model_info.backend_identifier)
      ? "ready"
      : "not_ready";
  };

  if (isLoadingTools) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Loading AI tools...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex">
      {/* Tools Sidebar */}
      <div className="w-80 border-r border-white/10 bg-black/20">
        {toolsData && (
          <ToolsList
            tools={toolsData.tools}
            categories={toolsData.categories}
            selectedToolId={selectedToolId}
            onToolSelect={handleToolSelect}
            className="h-full"
          />
        )}
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {selectedTool ? (
          <>
            {/* Header */}
            <div className="p-6 border-b border-white/10 bg-black/10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {selectedTool.getName(lang)}
                  </h1>
                  <p className="text-gray-400">
                    {selectedTool.getDescription(lang)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="border-cyan-400/30 text-cyan-400"
                  >
                    {selectedTool.category}
                  </Badge>
                  <Badge
                    variant={
                      getModelStatusForTool(selectedTool) === "ready"
                        ? "default"
                        : "outline"
                    }
                    className={
                      getModelStatusForTool(selectedTool) === "ready"
                        ? "bg-green-500"
                        : "border-red-400/30 text-red-400"
                    }
                  >
                    {getModelStatusForTool(selectedTool) === "ready"
                      ? "Model Ready"
                      : "Model Not Ready"}
                  </Badge>
                </div>
              </div>

              {/* Tool Requirements */}
              <div className="flex gap-4 text-sm">
                {selectedTool.requires_mask && (
                  <div className="flex items-center gap-1 text-purple-400">
                    <i className="fas fa-paint-brush"></i>
                    <span>Requires Mask</span>
                  </div>
                )}
                {selectedTool.requires_prompt && (
                  <div className="flex items-center gap-1 text-blue-400">
                    <i className="fas fa-edit"></i>
                    <span>Requires Prompt</span>
                  </div>
                )}
                {selectedTool.requires_second_image && (
                  <div className="flex items-center gap-1 text-green-400">
                    <i className="fas fa-images"></i>
                    <span>Requires Second Image</span>
                  </div>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex">
              {/* Image Canvas */}
              <div className="flex-1 p-6">
                <ImageCanvasWithMasking
                  originalImage={originalImage}
                  editedImage={editedImage}
                  onImageUpload={handleImageUpload}
                  onMaskChange={handleMaskChange}
                  showMaskingTools={selectedTool.requires_mask}
                  isProcessing={processingMutation.isLoading}
                  className="h-full"
                />
              </div>

              {/* Controls Panel */}
              <div className="w-80 border-l border-white/10 bg-black/20">
                <ScrollArea className="h-full p-6">
                  <div className="space-y-6">
                    {/* Prompt Input */}
                    {selectedTool.requires_prompt && (
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-300">
                          Prompt <span className="text-red-400">*</span>
                        </label>
                        <Textarea
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          placeholder={`Describe what you want to achieve with ${selectedTool.getName(lang)}...`}
                          className="bg-white/5 border-white/10 text-white min-h-[100px]"
                        />
                      </div>
                    )}

                    {/* Second Image Upload */}
                    {selectedTool.requires_second_image && (
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-300">
                          Second Image <span className="text-red-400">*</span>
                        </label>
                        <div className="space-y-2">
                          <Button
                            onClick={() =>
                              document
                                .getElementById("second-image-input")
                                ?.click()
                            }
                            variant="outline"
                            className="w-full border-white/10 hover:bg-white/5"
                          >
                            <i className="fas fa-upload mr-2"></i>
                            Choose Second Image
                          </Button>
                          {secondImage && (
                            <div className="relative">
                              <img
                                src={secondImage}
                                alt="Second"
                                className="w-full h-24 object-cover rounded-lg"
                              />
                              <Button
                                onClick={() => setSecondImage(null)}
                                size="sm"
                                variant="destructive"
                                className="absolute top-1 right-1"
                              >
                                <i className="fas fa-times"></i>
                              </Button>
                            </div>
                          )}
                          <input
                            id="second-image-input"
                            type="file"
                            accept="image/*"
                            onChange={handleSecondImageUpload}
                            className="hidden"
                          />
                        </div>
                      </div>
                    )}

                    {/* Tool Settings */}
                    {selectedTool.input_schema && (
                      <ToolSettings
                        tool={selectedTool}
                        settings={toolSettings}
                        onSettingsChange={handleSettingsChange}
                        language={lang}
                      />
                    )}

                    {/* Processing Status */}
                    {processingMutation.isLoading && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Processing...</span>
                          <span className="text-cyan-400">
                            {selectedTool.model_info.processing_time_secs}
                          </span>
                        </div>
                        <Progress value={undefined} className="h-2" />
                      </div>
                    )}

                    {/* Error Display */}
                    {processingMutation.error && (
                      <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                        <p className="text-red-400 text-sm">
                          {processingMutation.error.message}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <Button
                        onClick={handleProcess}
                        disabled={!canProcess}
                        className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processingMutation.isLoading ? (
                          <>
                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-magic mr-2"></i>
                            Apply {selectedTool.getName("en")}
                          </>
                        )}
                      </Button>

                      {editedImage && (
                        <Button
                          onClick={() => {
                            const link = document.createElement("a");
                            link.download = `${selectedTool.id}_result.png`;
                            link.href = editedImage;
                            link.click();
                          }}
                          variant="outline"
                          className="w-full border-green-400/30 text-green-400 hover:bg-green-400/10"
                        >
                          <i className="fas fa-download mr-2"></i>
                          Download Result
                        </Button>
                      )}

                      <Button
                        onClick={() => {
                          setOriginalImage(null);
                          setEditedImage(null);
                          setCurrentMask(null);
                          setPrompt("");
                          setSecondImage(null);
                          setToolSettings({});
                        }}
                        variant="outline"
                        className="w-full border-gray-400/30 text-gray-400 hover:bg-gray-400/10"
                      >
                        <i className="fas fa-refresh mr-2"></i>
                        Reset All
                      </Button>
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyan-400 to-purple-600 flex items-center justify-center">
                <i className="fas fa-tools text-2xl text-white"></i>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Select an AI Tool
              </h2>
              <p className="text-gray-400 max-w-md">
                Choose from our collection of 30 advanced AI tools to transform
                your images. Each tool uses state-of-the-art models for
                professional results.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
