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
  rem: number;
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

  // Spacing Tokens
  const spacingTokens: SpacingToken[] = [
    { name: "xs", value: "0.25rem", px: 4, rem: 0.25 },
    { name: "sm", value: "0.5rem", px: 8, rem: 0.5 },
    { name: "md", value: "1rem", px: 16, rem: 1 },
    { name: "lg", value: "1.5rem", px: 24, rem: 1.5 },
    { name: "xl", value: "2rem", px: 32, rem: 2 },
    { name: "2xl", value: "3rem", px: 48, rem: 3 },
    { name: "3xl", value: "4rem", px: 64, rem: 4 },
    { name: "4xl", value: "6rem", px: 96, rem: 6 },
  ];

  // Typography Tokens
  const typographyTokens: TypographyToken[] = [
    {
      name: "heading-1",
      nameAr: "العنوان الأول",
      fontSize: "3rem",
      lineHeight: "1.2",
      fontWeight: "700",
      usage: "Main page titles",
      usageAr: "عناوين الصفحات الرئيسية",
    },
    {
      name: "heading-2",
      nameAr: "العنوان الثاني",
      fontSize: "2.25rem",
      lineHeight: "1.3",
      fontWeight: "600",
      usage: "Section headers",
      usageAr: "عناوين الأقسام",
    },
    {
      name: "heading-3",
      nameAr: "العنوان الثالث",
      fontSize: "1.875rem",
      lineHeight: "1.4",
      fontWeight: "600",
      usage: "Subsection headers",
      usageAr: "عناوين الأقسام الفرعية",
    },
    {
      name: "body-large",
      nameAr: "النص الكبير",
      fontSize: "1.125rem",
      lineHeight: "1.6",
      fontWeight: "400",
      usage: "Large body text",
      usageAr: "النص الأساسي الكبير",
    },
    {
      name: "body",
      nameAr: "النص الأساسي",
      fontSize: "1rem",
      lineHeight: "1.5",
      fontWeight: "400",
      usage: "Default body text",
      usageAr: "النص الأساسي الافتراضي",
    },
    {
      name: "body-small",
      nameAr: "النص الصغير",
      fontSize: "0.875rem",
      lineHeight: "1.4",
      fontWeight: "400",
      usage: "Small descriptions",
      usageAr: "الأوصاف الصغيرة",
    },
    {
      name: "caption",
      nameAr: "التسمية التوضيحية",
      fontSize: "0.75rem",
      lineHeight: "1.3",
      fontWeight: "400",
      usage: "Captions and labels",
      usageAr: "التسميات التوضيحية والملصقات",
    },
  ];

  // Effect Tokens
  const effectTokens = [
    {
      name: "shadow-sm",
      nameAr: "ظل صغير",
      value: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      description: "Small shadow for subtle elevation",
    },
    {
      name: "shadow-md",
      nameAr: "ظل متوسط",
      value: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      description: "Medium shadow for cards",
    },
    {
      name: "shadow-lg",
      nameAr: "ظل كبير",
      value: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      description: "Large shadow for modals",
    },
    {
      name: "glow-cyan",
      nameAr: "توهج سماوي",
      value: "0 0 20px rgba(0, 255, 255, 0.5)",
      description: "Cyan neon glow effect",
    },
    {
      name: "glow-purple",
      nameAr: "توهج بنفسجي",
      value: "0 0 20px rgba(139, 92, 246, 0.5)",
      description: "Purple neon glow effect",
    },
    {
      name: "blur-glass",
      nameAr: "ضبابية زجاجية",
      value: "blur(20px)",
      description: "Glassmorphism backdrop blur",
    },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Add notification logic here
  };

  const generateExport = () => {
    let output = "";

    switch (exportFormat) {
      case "css":
        output = ":root {\n";
        colorTokens.forEach((token) => {
          output += `  --color-${token.name}: ${token.value};\n`;
        });
        spacingTokens.forEach((token) => {
          output += `  --space-${token.name}: ${token.value};\n`;
        });
        output += "}";
        break;

      case "scss":
        colorTokens.forEach((token) => {
          output += `$color-${token.name}: ${token.value};\n`;
        });
        spacingTokens.forEach((token) => {
          output += `$space-${token.name}: ${token.value};\n`;
        });
        break;

      case "json":
        const tokens = {
          colors: Object.fromEntries(colorTokens.map((t) => [t.name, t.value])),
          spacing: Object.fromEntries(
            spacingTokens.map((t) => [t.name, t.value]),
          ),
          typography: Object.fromEntries(
            typographyTokens.map((t) => [
              t.name,
              {
                fontSize: t.fontSize,
                lineHeight: t.lineHeight,
                fontWeight: t.fontWeight,
              },
            ]),
          ),
        };
        output = JSON.stringify(tokens, null, 2);
        break;

      case "js":
        output = "export const tokens = {\n";
        output += "  colors: {\n";
        colorTokens.forEach((token) => {
          output += `    ${token.name.replace("-", "")}: '${token.value}',\n`;
        });
        output += "  },\n";
        output += "  spacing: {\n";
        spacingTokens.forEach((token) => {
          output += `    ${token.name}: '${token.value}',\n`;
        });
        output += "  }\n};";
        break;
    }

    return output;
  };

  const downloadExport = () => {
    const content = generateExport();
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `knoux-design-tokens.${exportFormat}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {lang === "ar" ? "رموز التصميم" : "Design Tokens"}
            </h2>
            <p className="text-gray-400">
              {lang === "ar"
                ? "النظام الأساسي للألوان والخطوط والمسافات"
                : "Foundation system for colors, typography, and spacing"}
            </p>
          </div>

          {/* Export Controls */}
          <div className="flex items-center gap-2">
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value as any)}
              className="bg-gray-800 border border-cyan-400/30 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="css">CSS Variables</option>
              <option value="scss">SCSS Variables</option>
              <option value="json">JSON</option>
              <option value="js">JavaScript</option>
            </select>
            <Button
              onClick={downloadExport}
              size="sm"
              className="bg-green-500 hover:bg-green-600"
            >
              <i className="fas fa-download mr-2"></i>
              {lang === "ar" ? "تصدير" : "Export"}
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="colors">
              {lang === "ar" ? "الألوان" : "Colors"}
            </TabsTrigger>
            <TabsTrigger value="typography">
              {lang === "ar" ? "الخطوط" : "Typography"}
            </TabsTrigger>
            <TabsTrigger value="spacing">
              {lang === "ar" ? "المسافات" : "Spacing"}
            </TabsTrigger>
            <TabsTrigger value="effects">
              {lang === "ar" ? "التأثيرات" : "Effects"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="colors" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {colorTokens.map((token) => (
                <Card
                  key={token.name}
                  className="glass-light p-4 hover:border-cyan-400/50 transition-all duration-300"
                >
                  <div
                    className="w-full h-16 rounded-lg mb-3 border border-white/10"
                    style={{ backgroundColor: token.value }}
                  ></div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-white text-sm">
                        {lang === "ar" ? token.nameAr : token.name}
                      </h3>
                      <Badge className="text-xs bg-gray-600 text-gray-300">
                        {token.category}
                      </Badge>
                    </div>
                    <code className="text-xs text-cyan-400 font-mono block bg-black/30 p-1 rounded">
                      {token.value}
                    </code>
                    <p className="text-xs text-gray-400">
                      {lang === "ar" ? token.descriptionAr : token.description}
                    </p>
                    <Button
                      onClick={() => copyToClipboard(token.value)}
                      size="sm"
                      variant="outline"
                      className="w-full text-xs border-gray-600 hover:bg-gray-700"
                    >
                      <i className="fas fa-copy mr-1"></i>
                      {lang === "ar" ? "نسخ" : "Copy"}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="typography" className="mt-6">
            <div className="space-y-4">
              {typographyTokens.map((token) => (
                <Card key={token.name} className="glass-light p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h3
                        className="text-white mb-2"
                        style={{
                          fontSize: token.fontSize,
                          lineHeight: token.lineHeight,
                          fontWeight: token.fontWeight,
                        }}
                      >
                        {lang === "ar" ? "نموذج النص" : "Sample Text"}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4">
                        {lang === "ar" ? token.usageAr : token.usage}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Name:</span>
                        <code className="text-cyan-400 text-sm">
                          {token.name}
                        </code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Size:</span>
                        <code className="text-cyan-400 text-sm">
                          {token.fontSize}
                        </code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Weight:</span>
                        <code className="text-cyan-400 text-sm">
                          {token.fontWeight}
                        </code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">
                          Line Height:
                        </span>
                        <code className="text-cyan-400 text-sm">
                          {token.lineHeight}
                        </code>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="spacing" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {spacingTokens.map((token) => (
                <Card key={token.name} className="glass-light p-4">
                  <div className="text-center space-y-3">
                    <h3 className="font-semibold text-white">{token.name}</h3>
                    <div
                      className="bg-cyan-400 mx-auto"
                      style={{
                        width: Math.min(token.px, 64) + "px",
                        height: Math.min(token.px, 64) + "px",
                      }}
                    ></div>
                    <div className="space-y-1 text-xs">
                      <code className="text-cyan-400 block">{token.value}</code>
                      <div className="text-gray-400">{token.px}px</div>
                      <div className="text-gray-400">{token.rem}rem</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="effects" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {effectTokens.map((token) => (
                <Card key={token.name} className="glass-light p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-white">
                        {lang === "ar" ? token.nameAr : token.name}
                      </h3>
                      <Button
                        onClick={() => copyToClipboard(token.value)}
                        size="sm"
                        variant="outline"
                        className="text-xs border-gray-600 hover:bg-gray-700"
                      >
                        <i className="fas fa-copy mr-1"></i>
                        {lang === "ar" ? "نسخ" : "Copy"}
                      </Button>
                    </div>

                    {/* Effect Preview */}
                    <div
                      className="w-full h-16 bg-gray-800 rounded-lg flex items-center justify-center"
                      style={{
                        boxShadow: token.name.includes("glow")
                          ? token.value
                          : token.name.includes("shadow")
                            ? token.value
                            : "none",
                        filter: token.name.includes("blur")
                          ? token.value
                          : "none",
                      }}
                    >
                      <span className="text-white text-sm">Preview</span>
                    </div>

                    <div className="space-y-2">
                      <code className="text-cyan-400 text-xs font-mono block bg-black/30 p-2 rounded">
                        {token.value}
                      </code>
                      <p className="text-gray-400 text-xs">
                        {token.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
