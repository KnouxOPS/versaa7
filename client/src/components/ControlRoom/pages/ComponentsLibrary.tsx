import React, { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import our custom components
import {
  KnouxToggle,
  KnouxSlider,
  KnouxSelect,
  KnouxTooltip,
  KnouxTurboButton,
} from "../components/KnouxComponents";

interface ComponentExample {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  category: "inputs" | "feedback" | "navigation" | "data" | "layout";
  component: React.ReactNode;
  code: string;
  props?: Array<{
    name: string;
    type: string;
    default?: any;
    description: string;
  }>;
}

export const ComponentsLibrary: React.FC = () => {
  const { language } = useLanguage();
  const lang = language || "en";

  const [activeCategory, setActiveCategory] = useState<string>("inputs");
  const [selectedComponent, setSelectedComponent] =
    useState<ComponentExample | null>(null);
  const [showCode, setShowCode] = useState(false);

  // Sample state for interactive examples
  const [toggleValue, setToggleValue] = useState(true);
  const [sliderValue, setSliderValue] = useState(75);
  const [selectValue, setSelectValue] = useState("option1");
  const [turboActive, setTurboActive] = useState(false);

  const componentExamples: ComponentExample[] = [
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
  size="md"
  disabled={false}
/>`,
      props: [
        {
          name: "checked",
          type: "boolean",
          description: "Current state of the toggle",
        },
        {
          name: "onChange",
          type: "(checked: boolean) => void",
          description: "Callback when state changes",
        },
        {
          name: "label",
          type: "string",
          description: "Label text for the toggle",
        },
        {
          name: "description",
          type: "string",
          description: "Description text below the label",
        },
        {
          name: "size",
          type: "'sm' | 'md' | 'lg'",
          default: "'md'",
          description: "Size of the toggle",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          description: "Whether the toggle is disabled",
        },
      ],
    },
    {
      id: "knoux-slider",
      name: "Knoux Slider",
      nameAr: "شريط تمرير كنوكس",
      description: "Neon slider with glowing effects and smooth animations",
      descriptionAr: "شريط تمرير نيون مع تأثيرات متوهجة وحركات سلسة",
      category: "inputs",
      component: (
        <KnouxSlider
          value={sliderValue}
          onChange={setSliderValue}
          label="Intensity Level"
          min={0}
          max={100}
          color="cyan"
          showValue={true}
        />
      ),
      code: `<KnouxSlider
  value={sliderValue}
  onChange={setSliderValue}
  label="Intensity Level"
  min={0}
  max={100}
  step={1}
  color="cyan"
  showValue={true}
/>`,
      props: [
        {
          name: "value",
          type: "number",
          description: "Current value of the slider",
        },
        {
          name: "onChange",
          type: "(value: number) => void",
          description: "Callback when value changes",
        },
        {
          name: "min",
          type: "number",
          default: "0",
          description: "Minimum value",
        },
        {
          name: "max",
          type: "number",
          default: "100",
          description: "Maximum value",
        },
        {
          name: "step",
          type: "number",
          default: "1",
          description: "Step increment",
        },
        { name: "label", type: "string", description: "Label for the slider" },
        {
          name: "color",
          type: "'cyan' | 'purple' | 'green' | 'red'",
          default: "'cyan'",
          description: "Color theme",
        },
        {
          name: "showValue",
          type: "boolean",
          default: "true",
          description: "Whether to show current value",
        },
      ],
    },
    {
      id: "knoux-select",
      name: "Knoux Select",
      nameAr: "قائمة اختيار كنوكس",
      description: "Dropdown select with glassmorphism and neon borders",
      descriptionAr: "قائمة منسدلة مع تأثير زجاجي وحدود نيون",
      category: "inputs",
      component: (
        <KnouxSelect
          value={selectValue}
          onChange={setSelectValue}
          label="Choose Option"
          options={[
            {
              value: "option1",
              label: "First Option",
              icon: "fa-star",
              description: "This is the first option",
            },
            {
              value: "option2",
              label: "Second Option",
              icon: "fa-heart",
              description: "This is the second option",
            },
            {
              value: "option3",
              label: "Third Option",
              icon: "fa-rocket",
              description: "This is the third option",
            },
          ]}
        />
      ),
      code: `<KnouxSelect
  value={selectValue}
  onChange={setSelectValue}
  label="Choose Option"
  placeholder="Select an option..."
  options={[
    { value: "option1", label: "First Option", icon: "fa-star", description: "Description" },
    { value: "option2", label: "Second Option", icon: "fa-heart", description: "Description" }
  ]}
  disabled={false}
/>`,
      props: [
        {
          name: "value",
          type: "string",
          description: "Currently selected value",
        },
        {
          name: "onChange",
          type: "(value: string) => void",
          description: "Callback when selection changes",
        },
        {
          name: "options",
          type: "KnouxSelectOption[]",
          description: "Array of selectable options",
        },
        { name: "label", type: "string", description: "Label for the select" },
        {
          name: "placeholder",
          type: "string",
          default: "'Select...'",
          description: "Placeholder text",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          description: "Whether the select is disabled",
        },
      ],
    },
    {
      id: "knoux-turbo-button",
      name: "Knoux Turbo Button",
      nameAr: "زر التوربو كنوكس",
      description: "Powerful turbo activation button with pulsing effects",
      descriptionAr: "زر تفعيل التوربو القوي مع تأثيرات نابضة",
      category: "inputs",
      component: (
        <div className="flex items-center justify-center p-4">
          <KnouxTurboButton
            isActive={turboActive}
            onClick={() => setTurboActive(!turboActive)}
            size="lg"
          />
        </div>
      ),
      code: `<KnouxTurboButton
  isActive={turboActive}
  onClick={() => setTurboActive(!turboActive)}
  size="lg"
  disabled={false}
/>`,
      props: [
        {
          name: "isActive",
          type: "boolean",
          description: "Whether turbo mode is active",
        },
        {
          name: "onClick",
          type: "() => void",
          description: "Callback when button is clicked",
        },
        {
          name: "size",
          type: "'sm' | 'md' | 'lg'",
          default: "'lg'",
          description: "Size of the button",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          description: "Whether the button is disabled",
        },
      ],
    },
    {
      id: "knoux-tooltip",
      name: "Knoux Tooltip",
      nameAr: "تلميح كنوكس",
      description: "Smart tooltip with personality-based content",
      descriptionAr: "تلميح ذكي مع محتوى يعتمد على الشخصية",
      category: "feedback",
      component: (
        <div className="flex gap-4 items-center justify-center p-4">
          <KnouxTooltip
            content="Professional tooltip"
            personality="professional"
          >
            <Button variant="outline" size="sm">
              Professional
            </Button>
          </KnouxTooltip>
          <KnouxTooltip content="Friendly tooltip" personality="casual">
            <Button variant="outline" size="sm">
              Casual
            </Button>
          </KnouxTooltip>
          <KnouxTooltip content="Badass tooltip" personality="badass">
            <Button variant="outline" size="sm">
              Badass
            </Button>
          </KnouxTooltip>
        </div>
      ),
      code: `<KnouxTooltip 
  content="Your tooltip content"
  personality="badass"
  position="top"
>
  <Button>Hover me!</Button>
</KnouxTooltip>`,
      props: [
        {
          name: "content",
          type: "string",
          description: "Tooltip content text",
        },
        {
          name: "children",
          type: "React.ReactNode",
          description: "Element to show tooltip on hover",
        },
        {
          name: "position",
          type: "'top' | 'bottom' | 'left' | 'right'",
          default: "'top'",
          description: "Position of tooltip",
        },
        {
          name: "personality",
          type: "'professional' | 'casual' | 'badass'",
          default: "'badass'",
          description: "Tooltip personality style",
        },
      ],
    },
  ];

  const categories = [
    { id: "inputs", label: "Inputs", labelAr: "المدخلات", icon: "fa-edit" },
    {
      id: "feedback",
      label: "Feedback",
      labelAr: "التفاعل",
      icon: "fa-comment",
    },
    {
      id: "navigation",
      label: "Navigation",
      labelAr: "التنقل",
      icon: "fa-compass",
    },
    {
      id: "data",
      label: "Data Display",
      labelAr: "عرض البيانات",
      icon: "fa-chart-bar",
    },
    { id: "layout", label: "Layout", labelAr: "التخطيط", icon: "fa-th-large" },
  ];

  const filteredComponents = componentExamples.filter(
    (comp) => comp.category === activeCategory,
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a notification here
  };

  return (
    <div className="h-full flex">
      {/* Components Sidebar */}
      <div className="w-80 border-r border-cyan-400/20 bg-gradient-to-b from-[#222227]/60 to-[#0F0F12]/60">
        <div className="p-4">
          <h2 className="text-lg font-bold text-white mb-4">
            {lang === "ar" ? "مكتبة المكونات" : "Components Library"}
          </h2>

          {/* Categories */}
          <div className="space-y-2 mb-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                  activeCategory === category.id
                    ? "bg-gradient-to-r from-cyan-400/20 to-purple-400/20 border border-cyan-400/30 text-white"
                    : "hover:bg-white/5 text-gray-300 hover:text-white"
                }`}
              >
                <i
                  className={`fas ${category.icon} ${
                    activeCategory === category.id
                      ? "text-cyan-400"
                      : "text-gray-400"
                  }`}
                ></i>
                <span className="font-medium">
                  {lang === "ar" ? category.labelAr : category.label}
                </span>
                <Badge className="ml-auto text-xs bg-gray-600 text-gray-300">
                  {filteredComponents.length}
                </Badge>
              </button>
            ))}
          </div>

          {/* Components List */}
          <ScrollArea className="h-96">
            <div className="space-y-2">
              {filteredComponents.map((component) => (
                <button
                  key={component.id}
                  onClick={() => setSelectedComponent(component)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-300 ${
                    selectedComponent?.id === component.id
                      ? "bg-blue-400/20 border border-blue-400/30"
                      : "hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <div className="font-medium text-white text-sm">
                    {lang === "ar" ? component.nameAr : component.name}
                  </div>
                  <div className="text-xs text-gray-400 mt-1 line-clamp-2">
                    {lang === "ar"
                      ? component.descriptionAr
                      : component.description}
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {selectedComponent ? (
          <>
            {/* Component Header */}
            <div className="p-6 border-b border-cyan-400/20">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">
                    {lang === "ar"
                      ? selectedComponent.nameAr
                      : selectedComponent.name}
                  </h1>
                  <p className="text-gray-400">
                    {lang === "ar"
                      ? selectedComponent.descriptionAr
                      : selectedComponent.description}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowCode(!showCode)}
                    size="sm"
                    variant="outline"
                    className="border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10"
                  >
                    <i className="fas fa-code mr-2"></i>
                    {showCode
                      ? lang === "ar"
                        ? "إخفاء الكود"
                        : "Hide Code"
                      : lang === "ar"
                        ? "عرض الكود"
                        : "Show Code"}
                  </Button>
                  <Button
                    onClick={() => copyToClipboard(selectedComponent.code)}
                    size="sm"
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <i className="fas fa-copy mr-2"></i>
                    {lang === "ar" ? "نسخ" : "Copy"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Component Content */}
            <ScrollArea className="flex-1 p-6">
              <Tabs value={showCode ? "code" : "demo"} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="demo" onClick={() => setShowCode(false)}>
                    {lang === "ar" ? "المعاينة" : "Demo"}
                  </TabsTrigger>
                  <TabsTrigger value="code" onClick={() => setShowCode(true)}>
                    {lang === "ar" ? "الكود" : "Code"}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="demo" className="mt-6">
                  {/* Live Demo */}
                  <Card className="glass-strong p-8 mb-6">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      {lang === "ar" ? "معاينة تفاعلية" : "Interactive Demo"}
                    </h3>
                    <div className="flex items-center justify-center min-h-32">
                      {selectedComponent.component}
                    </div>
                  </Card>

                  {/* Props Documentation */}
                  {selectedComponent.props && (
                    <Card className="glass-light p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">
                        {lang === "ar" ? "الخصائص" : "Props"}
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-600">
                              <th className="text-left py-2 text-cyan-400">
                                Name
                              </th>
                              <th className="text-left py-2 text-cyan-400">
                                Type
                              </th>
                              <th className="text-left py-2 text-cyan-400">
                                Default
                              </th>
                              <th className="text-left py-2 text-cyan-400">
                                Description
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedComponent.props.map((prop, index) => (
                              <tr
                                key={index}
                                className="border-b border-gray-700/50"
                              >
                                <td className="py-2 text-white font-mono">
                                  {prop.name}
                                </td>
                                <td className="py-2 text-purple-400 font-mono">
                                  {prop.type}
                                </td>
                                <td className="py-2 text-gray-400 font-mono">
                                  {prop.default || "-"}
                                </td>
                                <td className="py-2 text-gray-300">
                                  {prop.description}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="code" className="mt-6">
                  <Card className="glass-light p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-white">
                        {lang === "ar" ? "كود المثال" : "Example Code"}
                      </h3>
                      <Button
                        onClick={() => copyToClipboard(selectedComponent.code)}
                        size="sm"
                        variant="outline"
                        className="border-green-400/30 text-green-400 hover:bg-green-400/10"
                      >
                        <i className="fas fa-copy mr-2"></i>
                        {lang === "ar" ? "نسخ الكود" : "Copy Code"}
                      </Button>
                    </div>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-sm">
                      <code className="text-gray-300">
                        {selectedComponent.code}
                      </code>
                    </pre>
                  </Card>
                </TabsContent>
              </Tabs>
            </ScrollArea>
          </>
        ) : (
          // No component selected
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyan-400 to-purple-600 flex items-center justify-center">
                <i className="fas fa-cube text-2xl text-white"></i>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {lang === "ar" ? "اختر مكوناً للمعاينة" : "Select a Component"}
              </h2>
              <p className="text-gray-400 max-w-md mx-auto">
                {lang === "ar"
                  ? "اختر مكوناً من القائمة الجانبية لرؤية المعاينة التفاعلية والكود"
                  : "Choose a component from the sidebar to see interactive demo and code examples"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
