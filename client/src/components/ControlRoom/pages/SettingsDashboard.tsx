import React, { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useControlRoom, getSettingValue } from "../context/ControlRoomContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

// Custom Components
import {
  KnouxToggle,
  KnouxSlider,
  KnouxSelect,
  KnouxTooltip,
  KnouxTurboButton,
} from "../components/KnouxComponents";

const SettingsSections = [
  {
    id: "general",
    icon: "fa-cog",
    labelAr: "عام",
    labelEn: "General",
    color: "cyan",
  },
  {
    id: "intelligence",
    icon: "fa-brain",
    labelAr: "الذكاء",
    labelEn: "Intelligence",
    color: "purple",
  },
  {
    id: "performance",
    icon: "fa-rocket",
    labelAr: "الأداء",
    labelEn: "Performance",
    color: "green",
  },
  {
    id: "visual",
    icon: "fa-eye",
    labelAr: "المرئيات",
    labelEn: "Visual Effects",
    color: "blue",
  },
  {
    id: "privacy",
    icon: "fa-shield-alt",
    labelAr: "الخصوصية",
    labelEn: "Privacy",
    color: "red",
  },
];

export const SettingsDashboard: React.FC = () => {
  const { language } = useLanguage();
  const lang = language || "en";
  const { state, dispatch } = useControlRoom();

  const [activeSection, setActiveSection] = useState("general");
  const [searchQuery, setSearchQuery] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  // Helper function to update settings
  const updateSetting = (setting: any, value: any) => {
    dispatch({ type: "UPDATE_SETTING", setting, value });
    setHasChanges(true);
  };

  // Reset all settings
  const resetSettings = () => {
    dispatch({ type: "RESET_SETTINGS" });
    setHasChanges(false);
  };

  const getColorClasses = (color: string) => {
    const colors = {
      cyan: "border-cyan-400/30 hover:border-cyan-400/50 text-cyan-400",
      purple: "border-purple-400/30 hover:border-purple-400/50 text-purple-400",
      green: "border-green-400/30 hover:border-green-400/50 text-green-400",
      blue: "border-blue-400/30 hover:border-blue-400/50 text-blue-400",
      red: "border-red-400/30 hover:border-red-400/50 text-red-400",
    };
    return colors[color as keyof typeof colors] || colors.cyan;
  };

  return (
    <div className="h-full flex">
      {/* Sidebar - Settings Sections */}
      <div className="w-80 border-r border-gray-700/50 bg-gradient-to-b from-gray-900/50 to-gray-800/50">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-2">
              {lang === "ar" ? "أقسام الإعدادات" : "Settings Sections"}
            </h2>
            <p className="text-gray-400 text-sm">
              {lang === "ar"
                ? "خصص تجربة كنوكس الخاصة بك"
                : "Customize your Knoux experience"}
            </p>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Input
                placeholder={lang === "ar" ? "بحث..." : "Search..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-strong border-cyan-400/30 focus:border-cyan-400/50 pl-10"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>

          {/* Settings Sections */}
          <div className="space-y-2">
            {SettingsSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all duration-300 group ${
                  activeSection === section.id
                    ? `glass-strong ${getColorClasses(section.color)} shadow-[0_0_20px_rgba(0,255,255,0.1)]`
                    : "hover:bg-white/5 text-gray-400 hover:text-white"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    activeSection === section.id
                      ? `bg-${section.color}-400/20`
                      : "bg-gray-700/50"
                  }`}
                >
                  <i className={`fas ${section.icon} text-lg`}></i>
                </div>
                <div className="text-left flex-1">
                  <div className="font-medium">
                    {lang === "ar" ? section.labelAr : section.labelEn}
                  </div>
                </div>
                {activeSection === section.id && (
                  <div className="w-3 h-3 rounded-full bg-current animate-pulse"></div>
                )}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-8 space-y-3">
            {hasChanges && (
              <Button
                onClick={resetSettings}
                variant="outline"
                className="w-full border-red-400/30 text-red-400 hover:bg-red-400/10"
              >
                <i className="fas fa-undo mr-2"></i>
                {lang === "ar" ? "إعادة تعيين" : "Reset"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6">
        <ScrollArea className="h-full">
          {activeSection === "general" && (
            <div className="space-y-6">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {lang === "ar" ? "الإعدادات العامة" : "General Settings"}
                </h3>
                <p className="text-gray-400">
                  {lang === "ar"
                    ? "إعدادات أساسية للنظام"
                    : "Basic system settings"}
                </p>
              </div>

              {/* Language Setting */}
              <Card className="glass-strong p-6 border border-cyan-400/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-white mb-1">
                      {lang === "ar" ? "اللغة" : "Language"}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      {lang === "ar"
                        ? "اختر لغة الواجهة"
                        : "Choose interface language"}
                    </p>
                  </div>
                  <KnouxSelect
                    value={getSettingValue(state.settings, "language", "ar")}
                    onValueChange={(value) => updateSetting("language", value)}
                    options={[
                      { value: "ar", label: "العربية" },
                      { value: "en", label: "English" },
                    ]}
                  />
                </div>
              </Card>

              {/* Dark Mode Setting */}
              <Card className="glass-strong p-6 border border-cyan-400/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-white mb-1">Dark Mode</h4>
                    <p className="text-gray-400 text-sm">
                      {lang === "ar"
                        ? "يقلل إجهاد العين في الإضاءة المنخفضة"
                        : "Reduces eye strain in low light"}
                    </p>
                  </div>
                  <KnouxToggle
                    checked={getSettingValue(state.settings, "darkMode", true)}
                    onChange={(value) => updateSetting("darkMode", value)}
                  />
                </div>
              </Card>

              {/* Knoux Personality */}
              <Card className="glass-strong p-6 border border-purple-400/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-white mb-1">
                      {lang === "ar" ? "نكهة كنوكس" : "Knoux Flavor"}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      {lang === "ar"
                        ? "اختر شخصية المساعد"
                        : "Choose assistant personality"}
                    </p>
                  </div>
                  <KnouxSelect
                    value={getSettingValue(
                      state.settings,
                      "knouxFlavor",
                      "badass",
                    )}
                    onValueChange={(value) =>
                      updateSetting("knouxFlavor", value)
                    }
                    options={[
                      { value: "professional", label: "Professional" },
                      { value: "casual", label: "Casual" },
                      { value: "badass", label: "Badass" },
                    ]}
                  />
                </div>
              </Card>
            </div>
          )}

          {activeSection === "intelligence" && (
            <div className="space-y-6">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {lang === "ar" ? "إعدادات الذكاء" : "Intelligence Settings"}
                </h3>
                <p className="text-gray-400">
                  {lang === "ar"
                    ? "تحكم في سلوك الذكاء الاصطناعي"
                    : "Control AI behavior"}
                </p>
              </div>

              <Card className="glass-strong p-6 border border-purple-400/30">
                <div className="space-y-4">
                  <h4 className="font-semibold text-white">
                    {lang === "ar" ? "مستوى الذكاء" : "Intelligence Level"}
                  </h4>
                  <KnouxSlider
                    value={getSettingValue(
                      state.settings,
                      "intelligenceLevel",
                      80,
                    )}
                    onChange={(value) =>
                      updateSetting("intelligenceLevel", value)
                    }
                    min={0}
                    max={100}
                    step={1}
                    label={
                      lang === "ar" ? "مستوى الذكاء" : "Intelligence Level"
                    }
                  />
                </div>
              </Card>
            </div>
          )}

          {activeSection === "performance" && (
            <div className="space-y-6">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {lang === "ar" ? "إعدادات الأداء" : "Performance Settings"}
                </h3>
                <p className="text-gray-400">
                  {lang === "ar"
                    ? "تحسين الأداء والسرعة"
                    : "Optimize performance and speed"}
                </p>
              </div>

              <Card className="glass-strong p-6 border border-green-400/30">
                <div className="space-y-4">
                  <h4 className="font-semibold text-white">
                    {lang === "ar" ? "وضع التوربو" : "Turbo Mode"}
                  </h4>
                  <KnouxTurboButton
                    active={getSettingValue(state.settings, "turboMode", false)}
                    onToggle={(value) => updateSetting("turboMode", value)}
                  />
                </div>
              </Card>
            </div>
          )}

          {activeSection === "visual" && (
            <div className="space-y-6">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {lang === "ar" ? "التأثيرات البصرية" : "Visual Effects"}
                </h3>
                <p className="text-gray-400">
                  {lang === "ar"
                    ? "خصص مظهر الواجهة"
                    : "Customize interface appearance"}
                </p>
              </div>

              <Card className="glass-strong p-6 border border-blue-400/30">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-white mb-3">
                      {lang === "ar" ? "شدة التوهج" : "Glow Intensity"}
                    </h4>
                    <KnouxSlider
                      value={getSettingValue(
                        state.settings,
                        "glowIntensity",
                        100,
                      )}
                      onChange={(value) =>
                        updateSetting("glowIntensity", value)
                      }
                      min={0}
                      max={100}
                      step={5}
                    />
                  </div>

                  <div>
                    <h4 className="font-semibold text-white mb-3">
                      {lang === "ar" ? "شفافية الزجاج" : "Glass Transparency"}
                    </h4>
                    <KnouxSlider
                      value={getSettingValue(
                        state.settings,
                        "glassOpacity",
                        100,
                      )}
                      onChange={(value) => updateSetting("glassOpacity", value)}
                      min={0}
                      max={100}
                      step={5}
                    />
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeSection === "privacy" && (
            <div className="space-y-6">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {lang === "ar" ? "إعدادات الخصوصية" : "Privacy Settings"}
                </h3>
                <p className="text-gray-400">
                  {lang === "ar"
                    ? "تحكم في خصوصية البيانات"
                    : "Control data privacy"}
                </p>
              </div>

              <Card className="glass-strong p-6 border border-red-400/30">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-white">
                        {lang === "ar" ? "الوضع الخاص" : "Private Mode"}
                      </h4>
                      <p className="text-gray-400 text-sm">
                        {lang === "ar"
                          ? "لا يحفظ أي بيانات"
                          : "No data storage"}
                      </p>
                    </div>
                    <KnouxToggle
                      checked={getSettingValue(
                        state.settings,
                        "privateMode",
                        true,
                      )}
                      onChange={(value) => updateSetting("privateMode", value)}
                    />
                  </div>
                </div>
              </Card>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};
