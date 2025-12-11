import React, { useState, useCallback } from "react";
import { AiTool } from "@/shared/types";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface AdvancedToolSettingsProps {
  tool: AiTool;
  settings: Record<string, any>;
  onSettingsChange: (settings: Record<string, any>) => void;
  className?: string;
}

export const AdvancedToolSettings: React.FC<AdvancedToolSettingsProps> = ({
  tool,
  settings,
  onSettingsChange,
  className = "",
}) => {
  const { language } = useLanguage();
  const lang = language || "en";

  const updateSetting = useCallback(
    (key: string, value: any) => {
      const newSettings = { ...settings, [key]: value };
      onSettingsChange(newSettings);
    },
    [settings, onSettingsChange],
  );

  const resetToDefaults = useCallback(() => {
    const defaultSettings: Record<string, any> = {};

    if (tool.input_schema) {
      Object.entries(tool.input_schema).forEach(
        ([key, schema]: [string, any]) => {
          if (schema.default !== undefined) {
            defaultSettings[key] = schema.default;
          }
        },
      );
    }

    onSettingsChange(defaultSettings);
  }, [tool.input_schema, onSettingsChange]);

  const renderSettingControl = (key: string, schema: any) => {
    const currentValue = settings[key] ?? schema.default;
    const isRequired = schema.required === true;

    switch (schema.type) {
      case "number":
        if (schema.enum) {
          return (
            <Select
              value={currentValue?.toString()}
              onValueChange={(value) => updateSetting(key, parseFloat(value))}
            >
              <SelectTrigger className="bg-white/5 border-white/10">
                <SelectValue placeholder="اختر قيمة" />
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
          const min = schema.minimum || 0;
          const max = schema.maximum || 1;
          const step = schema.step || 0.1;

          return (
            <div className="space-y-3">
              <Slider
                value={[currentValue || schema.default || 0]}
                onValueChange={([value]) => updateSetting(key, value)}
                min={min}
                max={max}
                step={step}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>{min}</span>
                <span className="font-semibold text-cyan-400">
                  {typeof currentValue === "number"
                    ? currentValue.toFixed(2)
                    : schema.default}
                </span>
                <span>{max}</span>
              </div>
            </div>
          );
        }

      case "integer":
        if (schema.enum) {
          return (
            <Select
              value={currentValue?.toString()}
              onValueChange={(value) => updateSetting(key, parseInt(value))}
            >
              <SelectTrigger className="bg-white/5 border-white/10">
                <SelectValue placeholder="اختر قيمة" />
              </SelectTrigger>
              <SelectContent>
                {schema.enum.map((option: number) => (
                  <SelectItem key={option} value={option.toString()}>
                    {option}x
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        } else {
          return (
            <Input
              type="number"
              value={currentValue || ""}
              onChange={(e) =>
                updateSetting(key, parseInt(e.target.value) || 0)
              }
              placeholder={schema.description}
              className="bg-white/5 border-white/10"
              min={schema.minimum}
              max={schema.maximum}
            />
          );
        }

      case "string":
        if (schema.enum) {
          return (
            <Select
              value={currentValue || schema.default}
              onValueChange={(value) => updateSetting(key, value)}
            >
              <SelectTrigger className="bg-white/5 border-white/10">
                <SelectValue placeholder="اختر نوع" />
              </SelectTrigger>
              <SelectContent>
                {schema.enum.map((option: string) => (
                  <SelectItem key={option} value={option}>
                    <div className="flex items-center gap-2">
                      <span className="capitalize">
                        {option.replace(/_/g, " ")}
                      </span>
                      {option === currentValue && (
                        <Badge variant="secondary" className="text-xs">
                          نشط
                        </Badge>
                      )}
                    </div>
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
              placeholder={
                schema.description || `أدخل ${key.replace(/_/g, " ")}`
              }
              className="bg-white/5 border-white/10"
              required={isRequired}
            />
          );
        }

      case "boolean":
        return (
          <div className="flex items-center justify-between">
            <Switch
              checked={currentValue || false}
              onCheckedChange={(checked) => updateSetting(key, checked)}
            />
            <span className="text-sm text-gray-400">
              {currentValue ? "مفعل" : "معطل"}
            </span>
          </div>
        );

      default:
        return (
          <Input
            value={currentValue || ""}
            onChange={(e) => updateSetting(key, e.target.value)}
            placeholder={schema.description}
            className="bg-white/5 border-white/10"
          />
        );
    }
  };

  if (!tool.input_schema || Object.keys(tool.input_schema).length === 0) {
    return (
      <Card className="p-4 bg-white/5 border-white/10">
        <p className="text-gray-400 text-center text-sm">
          هذه الأداة لا تحتاج إعدادات إضافية
        </p>
      </Card>
    );
  }

  const requiredSettings = Object.entries(tool.input_schema).filter(
    ([_, schema]: [string, any]) => schema.required,
  );
  const optionalSettings = Object.entries(tool.input_schema).filter(
    ([_, schema]: [string, any]) => !schema.required,
  );

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
          <i className="fas fa-cogs text-cyan-400"></i>
          إعدادات الأداة
        </h4>
        <Button
          onClick={resetToDefaults}
          size="sm"
          variant="outline"
          className="text-xs border-gray-600 hover:bg-gray-700"
        >
          إعادة تعيين
        </Button>
      </div>

      {/* Required Settings */}
      {requiredSettings.length > 0 && (
        <Card className="p-4 bg-red-500/10 border-red-500/20">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="destructive" className="text-xs">
              مطلوب
            </Badge>
            <span className="text-sm font-medium text-red-300">
              إعدادات إجبارية
            </span>
          </div>
          <div className="space-y-4">
            {requiredSettings.map(([key, schema]: [string, any]) => (
              <div key={key} className="space-y-2">
                <Label className="text-xs font-medium text-red-200 flex items-center gap-1">
                  <span className="capitalize">{key.replace(/_/g, " ")}</span>
                  <span className="text-red-400">*</span>
                </Label>
                {renderSettingControl(key, schema)}
                {schema.description && (
                  <p className="text-xs text-red-300/80">
                    {schema.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Optional Settings */}
      {optionalSettings.length > 0 && (
        <Card className="p-4 bg-white/5 border-white/10">
          {requiredSettings.length > 0 && (
            <>
              <div className="flex items-center gap-2 mb-3">
                <Badge
                  variant="outline"
                  className="text-xs border-cyan-400/30 text-cyan-400"
                >
                  اختياري
                </Badge>
                <span className="text-sm font-medium text-gray-300">
                  إعدادات إضافية
                </span>
              </div>
              <Separator className="mb-4 border-gray-700" />
            </>
          )}
          <div className="space-y-4">
            {optionalSettings.map(([key, schema]: [string, any]) => (
              <div key={key} className="space-y-2">
                <Label className="text-xs font-medium text-gray-400 capitalize">
                  {key.replace(/_/g, " ")}
                </Label>
                {renderSettingControl(key, schema)}
                {schema.description && (
                  <p className="text-xs text-gray-500">{schema.description}</p>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Quality Modes */}
      {tool.quality_modes && tool.quality_modes.length > 0 && (
        <Card className="p-4 bg-white/5 border-white/10">
          <Label className="text-xs font-medium text-gray-400 mb-3 block">
            جودة المعالجة
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {tool.quality_modes.map((mode) => (
              <Button
                key={mode}
                onClick={() => updateSetting("quality_mode", mode)}
                size="sm"
                variant={settings.quality_mode === mode ? "default" : "outline"}
                className="text-xs capitalize"
              >
                {mode.replace(/_/g, " ")}
              </Button>
            ))}
          </div>
        </Card>
      )}

      {/* Tool Info */}
      <Card className="p-3 bg-gray-800/20 border-gray-700">
        <div className="text-xs text-gray-400 space-y-1">
          <div className="flex justify-between">
            <span>المعقدة:</span>
            <Badge
              variant="outline"
              className={`text-xs ${
                tool.processing_complexity === "low"
                  ? "border-green-400 text-green-400"
                  : tool.processing_complexity === "medium"
                    ? "border-yellow-400 text-yellow-400"
                    : tool.processing_complexity === "high"
                      ? "border-orange-400 text-orange-400"
                      : "border-red-400 text-red-400"
              }`}
            >
              {tool.processing_complexity}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span>الحجم:</span>
            <span className="text-cyan-400">{tool.model_info.size_gb} GB</span>
          </div>
          <div className="flex justify-between">
            <span>الوقت المتوقع:</span>
            <span className="text-cyan-400">
              {tool.model_info.processing_time_secs}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};
