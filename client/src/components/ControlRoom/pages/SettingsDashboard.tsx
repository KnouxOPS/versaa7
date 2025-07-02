import React, { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useControlRoom, getSettingValue } from "../context/ControlRoomContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// Custom Components
import {
  KnouxToggle,
  KnouxSlider,
  KnouxSelect,
  KnouxTooltip,
  KnouxTurboButton,
} from "../components/KnouxComponents";

const SettingsSections = [
  { id: "general", icon: "fa-cog", labelAr: "عام", labelEn: "General" },
  {
    id: "intelligence",
    icon: "fa-brain",
    labelAr: "الذكاء",
    labelEn: "Intelligence",
  },
  {
    id: "performance",
    icon: "fa-rocket",
    labelAr: "الأداء",
    labelEn: "Performance",
  },
  {
    id: "visual",
    icon: "fa-eye",
    labelAr: "المرئيات",
    labelEn: "Visual Effects",
  },
  {
    id: "privacy",
    icon: "fa-shield-alt",
    labelAr: "الخصوصية",
    labelEn: "Privacy",
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

  // Preview setting without saving
  const previewSetting = (setting: any, value: any) => {
    dispatch({ type: "PREVIEW_SETTING", setting, value });
  };

  // Apply all preview changes
  const applyChanges = () => {
    dispatch({ type: "APPLY_PREVIEW" });
    setHasChanges(false);
  };

  // Cancel preview changes
  const cancelChanges = () => {
    dispatch({ type: "CANCEL_PREVIEW" });
    setHasChanges(false);
  };

  // Reset all settings
  const resetSettings = () => {
    dispatch({ type: "RESET_TO_DEFAULTS" });
    setHasChanges(false);
  };

  // Export settings
  const exportSettings = () => {
    dispatch({ type: "EXPORT_SETTINGS" });
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-cyan-400 mb-4">
        {lang === "ar" ? "الإعدادات العامة" : "General Settings"}
      </h3>

      {/* Language Selection */}
      <Card className="glass-light p-4">
        <KnouxSelect
          label={lang === "ar" ? "اللغة" : "Language"}
          value={getSettingValue(state, "language")}
          onChange={(value) => updateSetting("language", value)}
          options={[
            {
              value: "ar",
              label: "العربية",
              icon: "fa-globe",
              description: "Arabic (العربية)",
            },
            {
              value: "en",
              label: "English",
              icon: "fa-globe",
              description: "English",
            },
            {
              value: "fr",
              label: "Français",
              icon: "fa-globe",
              description: "French (Français)",
            },
          ]}
        />
      </Card>

      {/* Dark Mode */}
      <Card className="glass-light p-4">
        <KnouxTooltip
          content={
            lang === "ar"
              ? "الوضع الليلي أسهل على العيون"
              : "Dark mode is easier on the eyes"
          }
        >
          <KnouxToggle
            checked={getSettingValue(state, "darkMode")}
            onChange={(checked) => updateSetting("darkMode", checked)}
            label={lang === "ar" ? "الوضع الليلي" : "Dark Mode"}
            description={
              lang === "ar"
                ? "يقلل إجهاد العيون في البيئة المظلمة"
                : "Reduces eye strain in low light"
            }
          />
        </KnouxTooltip>
      </Card>

      {/* Knoux Flavor */}
      <Card className="glass-light p-4">
        <KnouxSelect
          label={lang === "ar" ? "نكهة كنوكس" : "Knoux Flavor"}
          value={getSettingValue(state, "knouxFlavor")}
          onChange={(value) => updateSetting("knouxFlavor", value)}
          options={[
            {
              value: "professional",
              label: lang === "ar" ? "مهني" : "Professional",
              icon: "fa-briefcase",
              description:
                lang === "ar" ? "رسمي وفعال" : "Formal and efficient",
            },
            {
              value: "casual",
              label: lang === "ar" ? "عادي" : "Casual",
              icon: "fa-smile",
              description:
                lang === "ar" ? "ودود ومريح" : "Friendly and relaxed",
            },
            {
              value: "badass",
              label: lang === "ar" ? "قوي" : "Badass",
              icon: "fa-fire",
              description: lang === "ar" ? "جريء وواثق" : "Bold and confident",
            },
          ]}
        />
      </Card>
    </div>
  );

  const renderIntelligenceSettings = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-cyan-400 mb-4">
        {lang === "ar" ? "إعدادات الذكاء" : "Intelligence Settings"}
      </h3>

      {/* AI Assistant Level */}
      <Card className="glass-light p-4">
        <KnouxSelect
          label={lang === "ar" ? "مستوى المساعد الذكي" : "AI Assistant Level"}
          value={getSettingValue(state, "aiAssistantLevel")}
          onChange={(value) => updateSetting("aiAssistantLevel", value)}
          options={[
            {
              value: "basic",
              label: lang === "ar" ? "أساسي" : "Basic",
              icon: "fa-robot",
              description: lang === "ar" ? "مساعدة بسيطة" : "Simple assistance",
            },
            {
              value: "advanced",
              label: lang === "ar" ? "متقدم" : "Advanced",
              icon: "fa-brain",
              description:
                lang === "ar" ? "ذكاء متطور" : "Enhanced intelligence",
            },
            {
              value: "genius",
              label: lang === "ar" ? "عبقري" : "Genius",
              icon: "fa-graduation-cap",
              description: lang === "ar" ? "ذكاء فائق" : "Maximum intelligence",
            },
          ]}
        />
      </Card>

      {/* Response Style */}
      <Card className="glass-light p-4">
        <KnouxSelect
          label={lang === "ar" ? "نمط الرد" : "Response Style"}
          value={getSettingValue(state, "responseStyle")}
          onChange={(value) => updateSetting("responseStyle", value)}
          options={[
            {
              value: "formal",
              label: lang === "ar" ? "رسمي" : "Formal",
              icon: "fa-tie",
            },
            {
              value: "friendly",
              label: lang === "ar" ? "ودود" : "Friendly",
              icon: "fa-heart",
            },
            {
              value: "witty",
              label: lang === "ar" ? "ذكي" : "Witty",
              icon: "fa-laugh",
            },
          ]}
        />
      </Card>

      {/* Content Filter */}
      <Card className="glass-light p-4">
        <KnouxSelect
          label={lang === "ar" ? "فلترة المحتوى" : "Content Filter"}
          value={getSettingValue(state, "contentFilter")}
          onChange={(value) => updateSetting("contentFilter", value)}
          options={[
            {
              value: "strict",
              label: lang === "ar" ? "صارم" : "Strict",
              icon: "fa-lock",
              description: lang === "ar" ? "فلترة قوية" : "Maximum filtering",
            },
            {
              value: "moderate",
              label: lang === "ar" ? "متوسط" : "Moderate",
              icon: "fa-adjust",
              description: lang === "ar" ? "توازن معقول" : "Balanced filtering",
            },
            {
              value: "off",
              label: lang === "ar" ? "مغلق" : "Off",
              icon: "fa-unlock",
              description: lang === "ar" ? "بلا فلترة" : "No filtering",
            },
          ]}
        />
      </Card>
    </div>
  );

  const renderPerformanceSettings = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-cyan-400 mb-4">
        {lang === "ar" ? "إعدادات الأداء" : "Performance Settings"}
      </h3>

      {/* Turbo Mode */}
      <Card className="glass-light p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold text-white mb-2">
              {lang === "ar" ? "وضع التوربو" : "Turbo Mode"}
            </h4>
            <p className="text-sm text-gray-400">
              {lang === "ar"
                ? "تفعيل أقصى أداء للحوسبة"
                : "Enable maximum performance computing"}
            </p>
          </div>
          <KnouxTurboButton
            isActive={getSettingValue(state, "turboMode")}
            onClick={() => dispatch({ type: "TOGGLE_TURBO_MODE" })}
          />
        </div>
      </Card>

      {/* Rest Mode */}
      <Card className="glass-light p-4">
        <KnouxToggle
          checked={getSettingValue(state, "restMode")}
          onChange={(checked) => updateSetting("restMode", checked)}
          label={lang === "ar" ? "وضع الراحة" : "Rest Mode"}
          description={
            lang === "ar"
              ? "يقلل استهلاك الطاقة والموارد"
              : "Reduces power and resource usage"
          }
        />
      </Card>

      {/* Resource Optimization */}
      <Card className="glass-light p-4">
        <KnouxToggle
          checked={getSettingValue(state, "resourceOptimization")}
          onChange={(checked) => updateSetting("resourceOptimization", checked)}
          label={lang === "ar" ? "تحسين الموارد" : "Resource Optimization"}
          description={
            lang === "ar"
              ? "تح��ين تلقائي لاستخدام الذاكرة والمعالج"
              : "Automatic memory and CPU optimization"
          }
        />
      </Card>
    </div>
  );

  const renderVisualSettings = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-cyan-400 mb-4">
        {lang === "ar" ? "إعدادات المرئيات" : "Visual Effects Settings"}
      </h3>

      {/* Neon Glow */}
      <Card className="glass-light p-4">
        <KnouxSlider
          label={lang === "ar" ? "توهج النيون" : "Neon Glow"}
          value={getSettingValue(state, "neonGlow")}
          onChange={(value) => previewSetting("neonGlow", value)}
          min={0}
          max={100}
          color="cyan"
        />
      </Card>

      {/* Glassmorphism */}
      <Card className="glass-light p-4">
        <KnouxSlider
          label={lang === "ar" ? "التأثير الزجاجي" : "Glassmorphism"}
          value={getSettingValue(state, "glassmorphism")}
          onChange={(value) => previewSetting("glassmorphism", value)}
          min={0}
          max={100}
          color="purple"
        />
      </Card>

      {/* Animations */}
      <Card className="glass-light p-4">
        <KnouxToggle
          checked={getSettingValue(state, "animations")}
          onChange={(checked) => updateSetting("animations", checked)}
          label={lang === "ar" ? "الحركات" : "Animations"}
          description={
            lang === "ar"
              ? "تفعيل تأثيرات الحركة السلسة"
              : "Enable smooth motion effects"
          }
        />
      </Card>

      {/* Shadows */}
      <Card className="glass-light p-4">
        <KnouxToggle
          checked={getSettingValue(state, "shadows")}
          onChange={(checked) => updateSetting("shadows", checked)}
          label={lang === "ar" ? "الظلال" : "Shadows"}
          description={
            lang === "ar"
              ? "إضافة عمق بصري للعناصر"
              : "Add visual depth to elements"
          }
        />
      </Card>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-cyan-400 mb-4">
        {lang === "ar" ? "إعدادات الخصوصية" : "Privacy Settings"}
      </h3>

      {/* Tracking Block */}
      <Card className="glass-light p-4">
        <KnouxToggle
          checked={getSettingValue(state, "trackingBlock")}
          onChange={(checked) => updateSetting("trackingBlock", checked)}
          label={lang === "ar" ? "حجب التتبع" : "Block Tracking"}
          description={
            lang === "ar"
              ? "منع تتبع الأنشطة والسلوك"
              : "Prevent activity and behavior tracking"
          }
        />
      </Card>

      {/* Local Storage */}
      <Card className="glass-light p-4">
        <KnouxToggle
          checked={getSettingValue(state, "localStorage")}
          onChange={(checked) => updateSetting("localStorage", checked)}
          label={lang === "ar" ? "التخزين المحلي" : "Local Storage"}
          description={
            lang === "ar"
              ? "حفظ الإعدادات محلياً على الجهاز"
              : "Save settings locally on device"
          }
        />
      </Card>

      {/* Data Export */}
      <Card className="glass-light p-4">
        <div className="space-y-4">
          <KnouxToggle
            checked={getSettingValue(state, "dataExport")}
            onChange={(checked) => updateSetting("dataExport", checked)}
            label={lang === "ar" ? "تصدير البيانات" : "Data Export"}
            description={
              lang === "ar"
                ? "السماح بتصدير البيانات والإعدادات"
                : "Allow export of data and settings"
            }
          />

          {getSettingValue(state, "dataExport") && (
            <Button
              onClick={exportSettings}
              size="sm"
              variant="outline"
              className="border-green-400/30 text-green-400 hover:bg-green-400/10"
            >
              <i className="fas fa-download mr-2"></i>
              {lang === "ar" ? "تصدير الإعدادات" : "Export Settings"}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case "general":
        return renderGeneralSettings();
      case "intelligence":
        return renderIntelligenceSettings();
      case "performance":
        return renderPerformanceSettings();
      case "visual":
        return renderVisualSettings();
      case "privacy":
        return renderPrivacySettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="h-full flex">
      {/* Settings Sidebar */}
      <div className="w-64 border-r border-cyan-400/20 bg-gradient-to-b from-[#222227]/60 to-[#0F0F12]/60">
        <div className="p-4">
          <h2 className="text-lg font-bold text-white mb-4">
            {lang === "ar" ? "أقسام الإعدادات" : "Settings Sections"}
          </h2>

          {/* Search */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder={lang === "ar" ? "بحث..." : "Search..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 pl-8 bg-white/5 border border-cyan-400/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
            />
            <i className="fas fa-search absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
          </div>

          {/* Sections */}
          <nav className="space-y-2">
            {SettingsSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                  activeSection === section.id
                    ? "bg-gradient-to-r from-cyan-400/20 to-purple-400/20 border border-cyan-400/30 text-white"
                    : "hover:bg-white/5 text-gray-300 hover:text-white"
                }`}
              >
                <i
                  className={`fas ${section.icon} ${
                    activeSection === section.id
                      ? "text-cyan-400"
                      : "text-gray-400"
                  }`}
                ></i>
                <span className="font-medium">
                  {lang === "ar" ? section.labelAr : section.labelEn}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Content Header */}
        <div className="p-6 border-b border-cyan-400/20">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {lang === "ar" ? "لوحة الإعدادات" : "Settings Dashboard"}
              </h1>
              <p className="text-gray-400">
                {lang === "ar"
                  ? "تخصيص تجربة كنوكس حسب تفضيلاتك"
                  : "Customize your Knoux experience"}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {Object.keys(state.previewChanges).length > 0 && (
                <>
                  <Button
                    onClick={cancelChanges}
                    size="sm"
                    variant="outline"
                    className="border-red-400/30 text-red-400 hover:bg-red-400/10"
                  >
                    {lang === "ar" ? "إلغاء" : "Cancel"}
                  </Button>
                  <Button
                    onClick={applyChanges}
                    size="sm"
                    className="bg-green-500 hover:bg-green-600"
                  >
                    {lang === "ar" ? "تطبيق" : "Apply"}
                  </Button>
                </>
              )}

              <Button
                onClick={resetSettings}
                size="sm"
                variant="outline"
                className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10"
              >
                <i className="fas fa-undo mr-2"></i>
                {lang === "ar" ? "إعادة تعيين" : "Reset"}
              </Button>
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <ScrollArea className="flex-1 p-6">{renderSectionContent()}</ScrollArea>
      </div>
    </div>
  );
};
