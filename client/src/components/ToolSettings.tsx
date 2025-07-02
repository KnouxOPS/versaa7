import React from "react";
import { AiTool } from "@/shared/types";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ToolSettingsProps {
  selectedTool: AiTool;
  settings: Record<string, any>;
  onSettingsChange: (settings: Record<string, any>) => void;
}

export const ToolSettings: React.FC<ToolSettingsProps> = ({
  selectedTool,
  settings,
  onSettingsChange,
}) => {
  const { t } = useLanguage();

  const updateSetting = (key: string, value: any) => {
    onSettingsChange({
      ...settings,
      [key]: value,
    });
  };

  const renderSettingControl = (key: string, schema: any) => {
    const currentValue = settings[key] ?? schema.default;

    switch (schema.type) {
      case "integer":
      case "number":
        if (schema.enum) {
          // Dropdown for enum values
          return (
            <div key={key} className="space-y-2">
              <label className="text-sm font-medium text-gray-300 capitalize">
                {key.replace("_", " ")}
              </label>
              <select
                value={currentValue}
                onChange={(e) => updateSetting(key, parseInt(e.target.value))}
                className="w-full p-2 rounded glass border border-cyan-400/30 text-white bg-gray-800/50"
              >
                {schema.enum.map((option: number) => (
                  <option key={option} value={option}>
                    {option}x
                  </option>
                ))}
              </select>
            </div>
          );
        } else {
          // Number input with range
          return (
            <div key={key} className="space-y-2">
              <label className="text-sm font-medium text-gray-300 capitalize">
                {key.replace("_", " ")}: {currentValue}
              </label>
              <input
                type="range"
                min={schema.minimum || 0}
                max={schema.maximum || 100}
                value={currentValue}
                onChange={(e) => updateSetting(key, parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          );
        }

      case "string":
        if (schema.enum) {
          // Dropdown for string enum
          return (
            <div key={key} className="space-y-2">
              <label className="text-sm font-medium text-gray-300 capitalize">
                {key.replace("_", " ")}
              </label>
              <select
                value={currentValue}
                onChange={(e) => updateSetting(key, e.target.value)}
                className="w-full p-2 rounded glass border border-cyan-400/30 text-white bg-gray-800/50"
              >
                {schema.enum.map((option: string) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          );
        } else {
          // Text input
          return (
            <div key={key} className="space-y-2">
              <label className="text-sm font-medium text-gray-300 capitalize">
                {key.replace("_", " ")}
              </label>
              <input
                type="text"
                value={currentValue}
                onChange={(e) => updateSetting(key, e.target.value)}
                className="w-full p-2 rounded glass border border-cyan-400/30 text-white bg-gray-800/50"
                placeholder={
                  schema.description || `Enter ${key.replace("_", " ")}`
                }
              />
            </div>
          );
        }

      case "boolean":
        return (
          <div
            key={key}
            className="flex items-center space-x-2 space-x-reverse"
          >
            <input
              type="checkbox"
              checked={currentValue}
              onChange={(e) => updateSetting(key, e.target.checked)}
              className="rounded border border-cyan-400/30"
            />
            <label className="text-sm font-medium text-gray-300 capitalize">
              {key.replace("_", " ")}
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  if (
    !selectedTool.input_schema ||
    Object.keys(selectedTool.input_schema).length === 0
  ) {
    return null;
  }

  return (
    <Card className="glass p-4 border-purple-400/30">
      <h3 className="text-lg font-semibold text-purple-400 mb-4 flex items-center">
        <i className="fas fa-sliders-h mr-2"></i>
        إعدادات الأداة
      </h3>

      <div className="space-y-4">
        {Object.entries(selectedTool.input_schema).map(([key, schema]) =>
          renderSettingControl(key, schema),
        )}
      </div>

      {Object.keys(selectedTool.input_schema).length > 0 && (
        <Button
          onClick={() => onSettingsChange({})}
          variant="outline"
          size="sm"
          className="mt-4 border-gray-400 text-gray-400 hover:bg-gray-400/20"
        >
          إعادة تعيين الإعدادات
        </Button>
      )}
    </Card>
  );
};
