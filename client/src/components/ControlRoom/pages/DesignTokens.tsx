import React, { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useControlRoom } from "../context/ControlRoomContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ColorToken {
  name: string;
  nameAr: string;
  value: string;
  description: string;
  descriptionAr: string;
  category: "primary" | "secondary" | "semantic" | "surface";
}

interface SpacingToken {
  name: string;
  value: string;
  px: number;
  description: string;
}

interface TypographyToken {
  name: string;
  nameAr: string;
  fontSize: string;
  lineHeight: string;
  fontWeight: string;
  usage: string;
  usageAr: string;
}

export const DesignTokens: React.FC = () => {
  const { language } = useLanguage();
  const lang = language || "en";
  const { state } = useControlRoom();

  const [activeTab, setActiveTab] = useState("colors");
  const [exportFormat, setExportFormat] = useState<
    "css" | "scss" | "json" | "js"
  >("css");

  // Color Tokens
  const colorTokens: ColorToken[] = [
    {
      name: "primary-cyan",
      nameAr: "السماوي الأساسي",
      value: "#00FFEF",
      description: "Primary brand color - Neon cyan",
      descriptionAr: "اللون الأساسي للعلامة التجارية - سماوي نيون",
      category: "primary",
    },
    {
      name: "primary-purple",
      nameAr: "البنفسجي الأساسي",
      value: "#8888AE",
      description: "Secondary brand color - Purple gradient",
      descriptionAr: "اللون الثانوي للعلامة التجارية - تدرج بنفسجي",
      category: "primary",
    },
    {
      name: "surface-dark",
      nameAr: "السطح المظلم",
      value: "#0F0F12",
      description: "Main background surface",
      descriptionAr: "سطح الخلفية الرئيسي",
      category: "surface",
    },
    {
      name: "surface-glass",
      nameAr: "السطح الزجاجي",
      value: "#222227",
      description: "Glassmorphism card background",
      descriptionAr: "خلفية البطاقات الزجاجية",
      category: "surface",
    },
    {
      name: "success",
      nameAr: "النجاح",
      value: "#22C55E",
      description: "Success state color",
      descriptionAr: "لون حالة النجاح",
      category: "semantic",
    },
    {
      name: "warning",
      nameAr: "التحذير",
      value: "#F59E0B",
      description: "Warning state color",
      descriptionAr: "لون حالة التحذير",
      category: "semantic",
    },
    {
      name: "error",
      nameAr: "الخطأ",
      value: "#EF4444",
      description: "Error state color",
      descriptionAr: "لون حالة الخطأ",
      category: "semantic",
    },
    {
      name: "info",
      nameAr: "المعلومات",
      value: "#3B82F6",
      description: "Information state color",
      descriptionAr: "لون حالة المعلومات",
      category: "semantic",
    },
  ];

  // Typography Tokens
  const typographyTokens: TypographyToken[] = [
    {
      name: "heading-xl",
      nameAr: "عنوان كبير جداً",
      fontSize: "3rem",
      lineHeight: "1.2",
      fontWeight: "700",
      usage: "Main page headers",
      usageAr: "عناوين الصفحات الرئيسية",
    },
    {
      name: "heading-lg",
      nameAr: "عنوان كبير",
      fontSize: "2.25rem",
      lineHeight: "1.3",
      fontWeight: "600",
      usage: "Section headers",
      usageAr: "عناوين الأقسام",
    },
    {
      name: "heading-md",
      nameAr: "عنوان متوسط",
      fontSize: "1.5rem",
      lineHeight: "1.4",
      fontWeight: "600",
      usage: "Component headers",
      usageAr: "عناوين المكونات",
    },
    {
      name: "body-lg",
      nameAr: "نص كبير",
      fontSize: "1.125rem",
      lineHeight: "1.6",
      fontWeight: "400",
      usage: "Large body text",
      usageAr: "النص الأساسي الكبير",
    },
    {
      name: "body-md",
      nameAr: "نص متوسط",
      fontSize: "1rem",
      lineHeight: "1.5",
      fontWeight: "400",
      usage: "Default body text",
      usageAr: "النص الأساسي الافتراضي",
    },
    {
      name: "body-sm",
      nameAr: "نص صغير",
      fontSize: "0.875rem",
      lineHeight: "1.4",
      fontWeight: "400",
      usage: "Small text and captions",
      usageAr: "النص الصغير والتسميات التوضيحية",
    },
  ];

  // Spacing Tokens
  const spacingTokens: SpacingToken[] = [
    { name: "xs", value: "0.25rem", px: 4, description: "Extra small spacing" },
    { name: "sm", value: "0.5rem", px: 8, description: "Small spacing" },
    { name: "md", value: "1rem", px: 16, description: "Medium spacing" },
    { name: "lg", value: "1.5rem", px: 24, description: "Large spacing" },
    { name: "xl", value: "2rem", px: 32, description: "Extra large spacing" },
    { name: "2xl", value: "3rem", px: 48, description: "2X large spacing" },
    { name: "3xl", value: "4rem", px: 64, description: "3X large spacing" },
  ];

  // Effects Tokens
  const effectsTokens = [
    {
      name: "glass-blur",
      value: "blur(20px)",
      description: "Glassmorphism backdrop filter",
    },
    {
      name: "neon-glow",
      value: "0 0 20px rgba(0, 255, 239, 0.5)",
      description: "Neon glow effect",
    },
    {
      name: "card-shadow",
      value: "0 8px 32px rgba(0, 0, 0, 0.3)",
      description: "Card shadow effect",
    },
  ];

  const exportTokens = () => {
    let output = "";

    switch (exportFormat) {
      case "css":
        output = ":root {\n";
        colorTokens.forEach((token) => {
          output += `  --${token.name}: ${token.value};\n`;
        });
        output += "}";
        break;
      case "scss":
        colorTokens.forEach((token) => {
          output += `$${token.name}: ${token.value};\n`;
        });
        break;
      case "json":
        const jsonTokens = colorTokens.reduce(
          (acc, token) => {
            acc[token.name] = token.value;
            return acc;
          },
          {} as Record<string, string>,
        );
        output = JSON.stringify(jsonTokens, null, 2);
        break;
      case "js":
        output = "export const colors = {\n";
        colorTokens.forEach((token) => {
          output += `  '${token.name}': '${token.value}',\n`;
        });
        output += "};";
        break;
    }

    navigator.clipboard.writeText(output);
  };

  return (
    <div className="h-full flex">
      {/* Sidebar - Export Controls */}
      <div className="w-80 border-r border-gray-700/50 bg-gradient-to-b from-gray-900/50 to-gray-800/50">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-2">
              {lang === "ar" ? "رموز التصميم" : "Design Tokens"}
            </h2>
            <p className="text-gray-400 text-sm">
              {lang === "ar"
                ? "نظام الأساس للألوان والطباعة والمسافات"
                : "Foundation system for colors, typography, and spacing"}
            </p>
          </div>

          {/* Export Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white">
              {lang === "ar" ? "تصدير الرموز" : "Export Tokens"}
            </h3>

            {/* Format Selector */}
            <div className="space-y-2">
              <label className="text-xs text-gray-400">
                {lang === "ar" ? "تنسيق التصدير" : "Export Format"}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(["css", "scss", "json", "js"] as const).map((format) => (
                  <Button
                    key={format}
                    onClick={() => setExportFormat(format)}
                    variant={exportFormat === format ? "default" : "outline"}
                    size="sm"
                    className={
                      exportFormat === format
                        ? "bg-cyan-500 hover:bg-cyan-600"
                        : "border-gray-600 hover:bg-gray-700"
                    }
                  >
                    {format.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>

            {/* Export Button */}
            <Button
              onClick={exportTokens}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
            >
              <i className="fas fa-download mr-2"></i>
              {lang === "ar" ? "تصدير" : "Export"}
            </Button>
          </div>

          {/* Token Categories */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-white mb-3">
              {lang === "ar" ? "فئات الرموز" : "Token Categories"}
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">
                  {lang === "ar" ? "الألوان" : "Colors"}:
                </span>
                <span className="text-cyan-400">{colorTokens.length}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">
                  {lang === "ar" ? "الطباعة" : "Typography"}:
                </span>
                <span className="text-purple-400">
                  {typographyTokens.length}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">
                  {lang === "ar" ? "المسافات" : "Spacing"}:
                </span>
                <span className="text-green-400">{spacingTokens.length}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">
                  {lang === "ar" ? "التأثيرات" : "Effects"}:
                </span>
                <span className="text-orange-400">{effectsTokens.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-4 glass-strong rounded-xl p-1 mb-6">
            <TabsTrigger
              value="colors"
              className="data-[state=active]:bg-cyan-400/20 data-[state=active]:text-cyan-400"
            >
              <i className="fas fa-palette mr-2"></i>
              {lang === "ar" ? "الألوان" : "Colors"}
            </TabsTrigger>
            <TabsTrigger
              value="typography"
              className="data-[state=active]:bg-purple-400/20 data-[state=active]:text-purple-400"
            >
              <i className="fas fa-font mr-2"></i>
              {lang === "ar" ? "الطباعة" : "Typography"}
            </TabsTrigger>
            <TabsTrigger
              value="spacing"
              className="data-[state=active]:bg-green-400/20 data-[state=active]:text-green-400"
            >
              <i className="fas fa-expand-arrows-alt mr-2"></i>
              {lang === "ar" ? "المسافات" : "Spacing"}
            </TabsTrigger>
            <TabsTrigger
              value="effects"
              className="data-[state=active]:bg-orange-400/20 data-[state=active]:text-orange-400"
            >
              <i className="fas fa-magic mr-2"></i>
              {lang === "ar" ? "التأثيرات" : "Effects"}
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[calc(100%-80px)]">
            {/* Colors Tab */}
            <TabsContent value="colors" className="mt-0 space-y-4">
              {["primary", "surface", "semantic"].map((category) => (
                <div key={category}>
                  <h3 className="text-lg font-semibold text-white mb-4 capitalize">
                    {category} Colors
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {colorTokens
                      .filter((token) => token.category === category)
                      .map((token) => (
                        <Card
                          key={token.name}
                          className="glass-strong p-4 border border-cyan-400/30"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className="w-12 h-12 rounded-lg border-2 border-white/20"
                              style={{ backgroundColor: token.value }}
                            ></div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-white text-sm">
                                {token.name}
                              </h4>
                              <p className="text-xs text-gray-400 mb-1">
                                {category}
                              </p>
                              <p className="text-xs font-mono text-cyan-400">
                                {token.value}
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-400 mt-3">
                            {lang === "ar"
                              ? token.descriptionAr
                              : token.description}
                          </p>
                          <Button
                            onClick={() =>
                              navigator.clipboard.writeText(token.value)
                            }
                            size="sm"
                            variant="outline"
                            className="w-full mt-3 border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 text-xs"
                          >
                            <i className="fas fa-copy mr-2"></i>
                            {lang === "ar" ? "نسخ" : "Copy"}
                          </Button>
                        </Card>
                      ))}
                  </div>
                </div>
              ))}
            </TabsContent>

            {/* Typography Tab */}
            <TabsContent value="typography" className="mt-0 space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {typographyTokens.map((token) => (
                  <Card
                    key={token.name}
                    className="glass-strong p-6 border border-purple-400/30"
                  >
                    <div className="mb-4">
                      <h4 className="font-semibold text-white mb-1">
                        {token.name}
                      </h4>
                      <p className="text-sm text-gray-400">
                        {lang === "ar" ? token.usageAr : token.usage}
                      </p>
                    </div>

                    <div
                      className="text-white mb-4"
                      style={{
                        fontSize: token.fontSize,
                        lineHeight: token.lineHeight,
                        fontWeight: token.fontWeight,
                      }}
                    >
                      Sample Text - نص تجريبي
                    </div>

                    <div className="space-y-2 text-xs text-gray-400">
                      <div className="flex justify-between">
                        <span>Font Size:</span>
                        <span className="text-purple-400 font-mono">
                          {token.fontSize}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Line Height:</span>
                        <span className="text-purple-400 font-mono">
                          {token.lineHeight}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Font Weight:</span>
                        <span className="text-purple-400 font-mono">
                          {token.fontWeight}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Spacing Tab */}
            <TabsContent value="spacing" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {spacingTokens.map((token) => (
                  <Card
                    key={token.name}
                    className="glass-strong p-4 border border-green-400/30"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-white">{token.name}</h4>
                      <Badge variant="outline" className="text-xs font-mono">
                        {token.px}px
                      </Badge>
                    </div>

                    <div className="mb-3">
                      <div
                        className="bg-green-400/20 border border-green-400/50 rounded"
                        style={{ height: token.px, minHeight: "4px" }}
                      ></div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between text-gray-400">
                        <span>REM:</span>
                        <span className="text-green-400 font-mono">
                          {token.value}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>PX:</span>
                        <span className="text-green-400 font-mono">
                          {token.px}px
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-400 mt-2">
                      {token.description}
                    </p>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Effects Tab */}
            <TabsContent value="effects" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {effectsTokens.map((token) => (
                  <Card
                    key={token.name}
                    className="glass-strong p-6 border border-orange-400/30"
                  >
                    <h4 className="font-semibold text-white mb-2">
                      {token.name}
                    </h4>
                    <p className="text-sm text-gray-400 mb-4">
                      {token.description}
                    </p>

                    <div className="glass-subtle p-4 rounded-lg mb-4">
                      <div
                        className="w-full h-16 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 rounded-lg"
                        style={{
                          backdropFilter:
                            token.name === "glass-blur"
                              ? token.value
                              : undefined,
                          boxShadow:
                            token.name === "neon-glow"
                              ? token.value
                              : token.name === "card-shadow"
                                ? token.value
                                : undefined,
                        }}
                      ></div>
                    </div>

                    <div className="text-xs font-mono text-orange-400 bg-gray-900/50 p-2 rounded">
                      {token.value}
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
    </div>
  );
};
