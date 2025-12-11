import React, { useState, useEffect } from "react";
import { AiTool } from "@/shared/types";
import { useLanguage } from "@/hooks/useLanguage";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProcessingStep {
  id: string;
  name_ar: string;
  name_en: string;
  status: "pending" | "active" | "completed" | "error";
  progress: number;
  startTime?: number;
  endTime?: number;
}

interface AdvancedProcessingModalProps {
  isOpen: boolean;
  tool: AiTool | null;
  progress: number;
  message: string;
  onCancel?: () => void;
  estimatedTimeSeconds?: number;
}

export const AdvancedProcessingModal: React.FC<
  AdvancedProcessingModalProps
> = ({ isOpen, tool, progress, message, onCancel, estimatedTimeSeconds }) => {
  const { language } = useLanguage();
  const lang = language || "en";

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  // Define processing steps based on tool type
  const getProcessingSteps = (tool: AiTool | null): ProcessingStep[] => {
    if (!tool) return [];

    const commonSteps: ProcessingStep[] = [
      {
        id: "init",
        name_ar: "تهيئة النظام",
        name_en: "System Initialization",
        status: "pending",
        progress: 0,
      },
      {
        id: "load_model",
        name_ar: "تحميل النموذج",
        name_en: "Loading AI Model",
        status: "pending",
        progress: 0,
      },
      {
        id: "preprocess",
        name_ar: "معالجة أولية للصورة",
        name_en: "Image Preprocessing",
        status: "pending",
        progress: 0,
      },
    ];

    // Add tool-specific steps
    const toolSpecificSteps: Record<string, ProcessingStep[]> = {
      face_swap: [
        {
          id: "detect_faces",
          name_ar: "كشف الوجوه",
          name_en: "Face Detection",
          status: "pending",
          progress: 0,
        },
        {
          id: "align_faces",
          name_ar: "محاذاة الوجوه",
          name_en: "Face Alignment",
          status: "pending",
          progress: 0,
        },
        {
          id: "swap_faces",
          name_ar: "تبديل الوجوه",
          name_en: "Face Swapping",
          status: "pending",
          progress: 0,
        },
      ],
      beauty_filter: [
        {
          id: "analyze_features",
          name_ar: "تحليل الملامح",
          name_en: "Feature Analysis",
          status: "pending",
          progress: 0,
        },
        {
          id: "enhance_skin",
          name_ar: "تحسين البشرة",
          name_en: "Skin Enhancement",
          status: "pending",
          progress: 0,
        },
      ],
      hd_boost: [
        {
          id: "analyze_structure",
          name_ar: "تحليل هيكل الصورة",
          name_en: "Image Structure Analysis",
          status: "pending",
          progress: 0,
        },
        {
          id: "upscale",
          name_ar: "تكبير الدقة",
          name_en: "Resolution Upscaling",
          status: "pending",
          progress: 0,
        },
      ],
      bg_remover: [
        {
          id: "segment",
          name_ar: "تقسيم العناصر",
          name_en: "Object Segmentation",
          status: "pending",
          progress: 0,
        },
        {
          id: "refine_edges",
          name_ar: "تحسين الحواف",
          name_en: "Edge Refinement",
          status: "pending",
          progress: 0,
        },
      ],
    };

    const specificSteps = toolSpecificSteps[tool.id] || [
      {
        id: "process",
        name_ar: "معالجة بالذكاء الاصطناعي",
        name_en: "AI Processing",
        status: "pending",
        progress: 0,
      },
    ];

    const finalSteps: ProcessingStep[] = [
      {
        id: "postprocess",
        name_ar: "معالجة نهائية",
        name_en: "Post-processing",
        status: "pending",
        progress: 0,
      },
      {
        id: "complete",
        name_ar: "إنهاء المعالجة",
        name_en: "Completing",
        status: "pending",
        progress: 0,
      },
    ];

    return [...commonSteps, ...specificSteps, ...finalSteps];
  };

  const [steps, setSteps] = useState<ProcessingStep[]>(() =>
    getProcessingSteps(tool),
  );

  // Update steps when tool changes
  useEffect(() => {
    if (tool) {
      setSteps(getProcessingSteps(tool));
      setCurrentStepIndex(0);
      setStartTime(Date.now());
    }
  }, [tool]);

  // Update elapsed time
  useEffect(() => {
    if (isOpen && startTime) {
      const interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isOpen, startTime]);

  // Update steps based on progress
  useEffect(() => {
    if (progress > 0) {
      const totalSteps = steps.length;
      const currentStep = Math.min(
        Math.floor((progress / 100) * totalSteps),
        totalSteps - 1,
      );

      setSteps((prevSteps) =>
        prevSteps.map((step, index) => ({
          ...step,
          status:
            index < currentStep
              ? "completed"
              : index === currentStep
                ? "active"
                : "pending",
          progress:
            index < currentStep
              ? 100
              : index === currentStep
                ? ((progress / 100) * totalSteps - currentStep) * 100
                : 0,
        })),
      );

      setCurrentStepIndex(currentStep);
    }
  }, [progress, steps.length]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getStepIcon = (status: ProcessingStep["status"]) => {
    switch (status) {
      case "completed":
        return <i className="fas fa-check-circle text-green-400"></i>;
      case "active":
        return <i className="fas fa-spinner fa-spin text-cyan-400"></i>;
      case "error":
        return <i className="fas fa-exclamation-circle text-red-400"></i>;
      default:
        return <i className="fas fa-circle text-gray-500"></i>;
    }
  };

  if (!isOpen || !tool) return null;

  const currentStep = steps[currentStepIndex];
  const remainingTime = estimatedTimeSeconds
    ? Math.max(0, estimatedTimeSeconds - elapsedTime)
    : null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full glass-strong border-cyan-400/30 shadow-2xl">
        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-cyan-400 to-purple-600 flex items-center justify-center animate-pulse-glow">
              <i className="fas fa-magic text-2xl text-white"></i>
            </div>
            <h2 className="text-2xl font-bold text-white">
              {lang === "ar" ? "معالجة بالذكاء الاصطناعي" : "AI Processing"}
            </h2>
            <p className="text-gray-300">
              {tool.getName(lang)} - {tool.category}
            </p>
          </div>

          {/* Overall Progress */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">{message}</span>
              <span className="text-cyan-400 font-bold">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-3 bg-gray-800" />
          </div>

          {/* Current Step Details */}
          {currentStep && (
            <Card className="p-4 bg-cyan-400/10 border-cyan-400/20">
              <div className="flex items-center gap-3 mb-3">
                {getStepIcon(currentStep.status)}
                <span className="font-semibold text-cyan-300">
                  {lang === "ar" ? currentStep.name_ar : currentStep.name_en}
                </span>
                <Badge
                  variant="outline"
                  className="border-cyan-400/30 text-cyan-400 text-xs"
                >
                  {currentStepIndex + 1}/{steps.length}
                </Badge>
              </div>
              {currentStep.status === "active" && (
                <Progress value={currentStep.progress} className="h-2" />
              )}
            </Card>
          )}

          {/* Steps List */}
          <div className="max-h-48 overflow-y-auto space-y-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                  step.status === "active"
                    ? "bg-cyan-400/10 border border-cyan-400/20"
                    : step.status === "completed"
                      ? "bg-green-400/10"
                      : "bg-gray-800/20"
                }`}
              >
                {getStepIcon(step.status)}
                <span
                  className={`flex-1 text-sm ${
                    step.status === "completed"
                      ? "text-green-300"
                      : step.status === "active"
                        ? "text-cyan-300"
                        : "text-gray-400"
                  }`}
                >
                  {lang === "ar" ? step.name_ar : step.name_en}
                </span>
                {step.status === "active" && (
                  <span className="text-xs text-cyan-400">
                    {Math.round(step.progress)}%
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Time Information */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center p-3 bg-gray-800/20 rounded-lg">
              <div className="text-gray-400">
                {lang === "ar" ? "الوقت المنقضي" : "Elapsed Time"}
              </div>
              <div className="text-cyan-400 font-bold text-lg">
                {formatTime(elapsedTime)}
              </div>
            </div>
            {remainingTime !== null && (
              <div className="text-center p-3 bg-gray-800/20 rounded-lg">
                <div className="text-gray-400">
                  {lang === "ar" ? "الوقت المتبقي" : "Remaining Time"}
                </div>
                <div className="text-orange-400 font-bold text-lg">
                  {formatTime(remainingTime)}
                </div>
              </div>
            )}
          </div>

          {/* Model Information */}
          <Card className="p-3 bg-purple-400/10 border-purple-400/20">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-purple-300 font-semibold">
                  {lang === "ar" ? "النموذج:" : "Model:"}
                </span>
                <p className="text-purple-100">{tool.model_info.name}</p>
              </div>
              <div>
                <span className="text-purple-300 font-semibold">
                  {lang === "ar" ? "الحجم:" : "Size:"}
                </span>
                <p className="text-purple-100">{tool.model_info.size_gb} GB</p>
              </div>
              <div>
                <span className="text-purple-300 font-semibold">
                  {lang === "ar" ? "المعقدة:" : "Complexity:"}
                </span>
                <p className="text-purple-100 capitalize">
                  {tool.processing_complexity}
                </p>
              </div>
              <div>
                <span className="text-purple-300 font-semibold">
                  {lang === "ar" ? "الوقت المتوقع:" : "Est. Time:"}
                </span>
                <p className="text-purple-100">
                  {tool.model_info.processing_time_secs}
                </p>
              </div>
            </div>
          </Card>

          {/* Cancel Button */}
          {onCancel && (
            <div className="text-center">
              <Button
                onClick={onCancel}
                variant="outline"
                className="border-red-400/30 text-red-400 hover:bg-red-400/10"
              >
                <i className="fas fa-stop mr-2"></i>
                {lang === "ar" ? "إيقاف المعالجة" : "Cancel Processing"}
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
