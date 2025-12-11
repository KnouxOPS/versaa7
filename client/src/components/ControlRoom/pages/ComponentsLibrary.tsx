import React, { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

// Import our custom components
import {
  KnouxToggle,
  KnouxSlider,
  KnouxSelect,
  KnouxTooltip,
  KnouxTurboButton,
} from "../components/KnouxComponents";

interface ComponentCategory {
  id: string;
  name: string;
  nameAr: string;
  icon: string;
  count: number;
  color: string;
}

interface ComponentExample {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  category: string;
  component: React.ReactNode;
  code: string;
}

export const ComponentsLibrary: React.FC = () => {
  const { language } = useLanguage();
  const lang = language || "en";

  const [selectedCategory, setSelectedCategory] = useState<string>("inputs");
  const [selectedComponent, setSelectedComponent] =
    useState<ComponentExample | null>(null);
  const [showCode, setShowCode] = useState(false);

  // Sample state for interactive examples
  const [toggleValue, setToggleValue] = useState(true);
  const [sliderValue, setSliderValue] = useState(75);
  const [selectValue, setSelectValue] = useState("option1");
  const [turboActive, setTurboActive] = useState(false);

  const categories: ComponentCategory[] = [
    {
      id: "inputs",
      name: "Inputs",
      nameAr: "المدخلات",
      icon: "fa-edit",
      count: 4,
      color: "cyan",
    },
    {
      id: "feedback",
      name: "Feedback",
      nameAr: "التعليقات",
      icon: "fa-bell",
      count: 4,
      color: "green",
    },
    {
      id: "navigation",
      name: "Navigation",
      nameAr: "التنقل",
      icon: "fa-compass",
      count: 4,
      color: "blue",
    },
    {
      id: "data",
      name: "Data Display",
      nameAr: "عرض البيانات",
      icon: "fa-chart-bar",
      count: 4,
      color: "purple",
    },
    {
      id: "layout",
      name: "Layout",
      nameAr: "التخطيط",
      icon: "fa-th-large",
      count: 4,
      color: "orange",
    },
  ];

  const components: ComponentExample[] = [
    {
      id: "knoux-toggle",
      name: "Knoux Toggle",
      nameAr: "مفتاح كنوكس",
      description: "Tron-style toggle switch with neon effects",
      descriptionAr: "مفتاح تبديل بأسلوب ترون مع تأثيرات نيون",
      category: "inputs",
      component: (
        <KnouxToggle
          checked={toggleValue}
          onChange={setToggleValue}
          label="Enable Feature"
          description="Toggle this awesome feature on or off"
        />
      ),
      code: `<KnouxToggle
  checked={toggleValue}
  onChange={setToggleValue}
  label="Enable Feature"
  description="Toggle this awesome feature on or off"
/>`,
    },
    {
      id: "knoux-slider",
      name: "Knoux Slider",
      nameAr: "شريط التمرير كنوكس",
      description: "Neon slider with glowing effects and smooth animations",
      descriptionAr: "شريط تمرير نيون مع تأثيرات متوهجة وحركات ناعمة",
      category: "inputs",
      component: (
        <KnouxSlider
          value={sliderValue}
          onChange={setSliderValue}
          min={0}
          max={100}
          step={1}
          label="Intensity Level"
        />
      ),
      code: `<KnouxSlider
  value={sliderValue}
  onChange={setSliderValue}
  min={0}
  max={100}
  step={1}
  label="Intensity Level"
/>`,
    },
    {
      id: "knoux-select",
      name: "Knoux Select",
      nameAr: "قائمة اختيار كنوكس",
      description: "Dropdown select with glassmorphism and neon borders",
      descriptionAr: "قائمة منسدلة مع زجاجية وحدود نيون",
      category: "inputs",
      component: (
        <KnouxSelect
          value={selectValue}
          onValueChange={setSelectValue}
          options={[
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
            { value: "option3", label: "Option 3" },
          ]}
        />
      ),
      code: `<KnouxSelect
  value={selectValue}
  onValueChange={setSelectValue}
  options={[
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ]}
/>`,
    },
    {
      id: "knoux-turbo-button",
      name: "Knoux Turbo Button",
      nameAr: "زر التوربو كنوكس",
      description: "Powerful turbo activation button with pulsing effects",
      descriptionAr: "زر تفعيل توربو قوي مع تأثيرات نابضة",
      category: "inputs",
      component: (
        <KnouxTurboButton active={turboActive} onToggle={setTurboActive} />
      ),
      code: `<KnouxTurboButton
  active={turboActive}
  onToggle={setTurboActive}
/>`,
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      cyan: "border-cyan-400/30 hover:border-cyan-400/50 text-cyan-400",
      green: "border-green-400/30 hover:border-green-400/50 text-green-400",
      blue: "border-blue-400/30 hover:border-blue-400/50 text-blue-400",
      purple: "border-purple-400/30 hover:border-purple-400/50 text-purple-400",
      orange: "border-orange-400/30 hover:border-orange-400/50 text-orange-400",
    };
    return colors[color as keyof typeof colors] || colors.cyan;
  };

  const filteredComponents = components.filter(
    (comp) => comp.category === selectedCategory,
  );

  return (
    <div className="h-full flex">
      {/* Sidebar - Categories */}
      <div className="w-80 border-r border-gray-700/50 bg-gradient-to-b from-gray-900/50 to-gray-800/50">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-2">
              {lang === "ar" ? "مكتبة المكونات" : "Components Library"}
            </h2>
            <p className="text-gray-400 text-sm">
              {lang === "ar"
                ? "مكونات UI مخصصة لكنوكس"
                : "Custom UI components for Knoux"}
            </p>
          </div>

          {/* Categories Grid */}
          <div className="space-y-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full p-4 rounded-xl transition-all duration-300 ${
                  selectedCategory === category.id
                    ? `glass-strong ${getColorClasses(category.color)} shadow-[0_0_20px_rgba(0,255,255,0.1)]`
                    : "hover:bg-white/5 text-gray-400 hover:text-white border border-transparent hover:border-gray-600"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        selectedCategory === category.id
                          ? `bg-${category.color}-400/20`
                          : "bg-gray-700/50"
                      }`}
                    >
                      <i className={`fas ${category.icon}`}></i>
                    </div>
                    <div className="text-left">
                      <div className="font-medium">
                        {lang === "ar" ? category.nameAr : category.name}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {category.count}
                  </Badge>
                </div>
              </button>
            ))}
          </div>

          {/* Selected Component Info */}
          {selectedComponent && (
            <div className="mt-8 glass-strong p-4 rounded-lg">
              <h3 className="font-semibold text-white mb-2">
                {lang === "ar"
                  ? selectedComponent.nameAr
                  : selectedComponent.name}
              </h3>
              <p className="text-gray-400 text-sm mb-3">
                {lang === "ar"
                  ? selectedComponent.descriptionAr
                  : selectedComponent.description}
              </p>
              <Button
                onClick={() => setShowCode(!showCode)}
                size="sm"
                variant="outline"
                className="w-full border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10"
              >
                <i className="fas fa-code mr-2"></i>
                {showCode ? "Hide Code" : "Show Code"}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {!selectedComponent ? (
          <div className="h-full">
            {/* Components Grid */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                {categories.find((c) => c.id === selectedCategory)?.name}
              </h3>
              <p className="text-gray-400">
                {lang === "ar"
                  ? "اختر مكوناً من القائمة لرؤية العرض التفاعلي وأمثلة الكود"
                  : "Choose a component from the sidebar to see interactive demo and code examples"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredComponents.map((component) => (
                <Card
                  key={component.id}
                  className="glass-strong p-6 border border-cyan-400/30 hover:border-cyan-400/50 transition-all duration-300 cursor-pointer hover:scale-105"
                  onClick={() => setSelectedComponent(component)}
                >
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold text-white mb-2">
                      {lang === "ar" ? component.nameAr : component.name}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      {lang === "ar"
                        ? component.descriptionAr
                        : component.description}
                    </p>
                  </div>

                  {/* Component Preview */}
                  <div className="glass-subtle p-4 rounded-lg">
                    {component.component}
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <Badge variant="outline" className="text-xs">
                      Interactive
                    </Badge>
                    <i className="fas fa-arrow-right text-cyan-400"></i>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-full">
            {/* Component Detail View */}
            <div className="mb-6">
              <Button
                onClick={() => setSelectedComponent(null)}
                variant="outline"
                size="sm"
                className="mb-4 border-gray-600 hover:bg-gray-700"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Back to Library
              </Button>

              <h3 className="text-2xl font-bold text-white mb-2">
                {lang === "ar"
                  ? selectedComponent.nameAr
                  : selectedComponent.name}
              </h3>
              <p className="text-gray-400">
                {lang === "ar"
                  ? selectedComponent.descriptionAr
                  : selectedComponent.description}
              </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-[calc(100%-120px)]">
              {/* Interactive Demo */}
              <Card className="glass-strong p-6 border border-cyan-400/30">
                <h4 className="text-lg font-semibold text-white mb-4">
                  {lang === "ar" ? "عرض تفاعلي" : "Interactive Demo"}
                </h4>
                <div className="glass-subtle p-6 rounded-lg">
                  {selectedComponent.component}
                </div>
              </Card>

              {/* Code Example */}
              {showCode && (
                <Card className="glass-strong p-6 border border-purple-400/30">
                  <h4 className="text-lg font-semibold text-white mb-4">
                    {lang === "ar" ? "مثال على الكود" : "Code Example"}
                  </h4>
                  <ScrollArea className="h-64">
                    <pre className="text-sm text-gray-300 bg-gray-900/50 p-4 rounded-lg overflow-x-auto">
                      <code>{selectedComponent.code}</code>
                    </pre>
                  </ScrollArea>
                  <Button
                    onClick={() =>
                      navigator.clipboard.writeText(selectedComponent.code)
                    }
                    size="sm"
                    variant="outline"
                    className="mt-4 border-purple-400/30 text-purple-400 hover:bg-purple-400/10"
                  >
                    <i className="fas fa-copy mr-2"></i>
                    Copy Code
                  </Button>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
