import React, { useState } from "react";
import { AiTool } from "@/shared/types";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, ShieldAlert, Eye, EyeOff } from "lucide-react";

interface SensitiveContentWarningProps {
  tool: AiTool;
  onAccept: () => void;
  onCancel: () => void;
  isOpen: boolean;
}

export const SensitiveContentWarning: React.FC<
  SensitiveContentWarningProps
> = ({ tool, onAccept, onCancel, isOpen }) => {
  const { language } = useLanguage();
  const lang = language || "en";
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  if (!isOpen || !tool.is_sensitive) return null;

  const warnings = {
    ar: {
      title: "⚠️ تحذير: محتوى حساس للبالغين (+18)",
      subtitle: "هذه الأداة قد تنتج محتوى للبالغين فقط",
      description: `أداة "${tool.name_ar}" مصنفة كمحتوى حساس وقد تنتج نتائج غير مناسبة للقاصرين أو في بيئات العمل.`,
      requirements: [
        "يجب أن تكون بالغاً (18+ سنة)",
        "استخدم هذه الأداة بمسؤولية",
        "لا تشارك النتائج في أماكن غير مناسبة",
        "احترم القوانين المحلية والأخلاقيات",
      ],
      privacy: "جميع العمليات محلية - لا يتم رفع أي محتوى للإنترنت",
      agreement: "أؤكد أنني بالغ وأوافق على الشروط أعلاه",
      accept: "متابعة للأداة",
      cancel: "إلغاء",
      showDetails: "عرض تفاصيل الأداة",
      hideDetails: "إخفاء التفاصيل",
    },
    en: {
      title: "⚠️ Warning: Adult Content (+18)",
      subtitle: "This tool may produce adult-only content",
      description: `The "${tool.name_en}" tool is classified as sensitive content and may produce results inappropriate for minors or workplace environments.`,
      requirements: [
        "You must be an adult (18+ years old)",
        "Use this tool responsibly",
        "Do not share results in inappropriate places",
        "Respect local laws and ethics",
      ],
      privacy:
        "All processing is local - no content is uploaded to the internet",
      agreement: "I confirm that I am an adult and agree to the terms above",
      accept: "Continue to Tool",
      cancel: "Cancel",
      showDetails: "Show Tool Details",
      hideDetails: "Hide Details",
    },
  };

  const content = warnings[lang];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full bg-red-900/20 border-red-500/30 shadow-2xl">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-3">
              <ShieldAlert className="w-8 h-8 text-red-400" />
              <Badge
                variant="destructive"
                className="text-lg px-4 py-2 font-bold"
              >
                +18
              </Badge>
              <AlertTriangle className="w-8 h-8 text-yellow-400" />
            </div>
            <h2 className="text-2xl font-bold text-red-300">{content.title}</h2>
            <p className="text-lg text-red-200">{content.subtitle}</p>
          </div>

          {/* Description */}
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-100 leading-relaxed">
              {content.description}
            </p>
          </div>

          {/* Requirements */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-red-300 flex items-center gap-2">
              <i className="fas fa-exclamation-circle"></i>
              {lang === "ar" ? "متطلبات الاستخدام:" : "Usage Requirements:"}
            </h3>
            <ul className="space-y-2">
              {content.requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-3 text-red-100">
                  <i className="fas fa-check-circle text-red-400 mt-1"></i>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Privacy Note */}
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
            <div className="flex items-center gap-2 text-green-300">
              <i className="fas fa-lock"></i>
              <span className="font-semibold">
                {lang === "ar" ? "ضمان الخصوصية:" : "Privacy Guarantee:"}
              </span>
            </div>
            <p className="text-green-200 mt-1">{content.privacy}</p>
          </div>

          {/* Tool Details Toggle */}
          <div className="border-t border-red-500/20 pt-4">
            <Button
              onClick={() => setShowPreview(!showPreview)}
              variant="outline"
              size="sm"
              className="border-red-400/30 text-red-400 hover:bg-red-400/10"
            >
              {showPreview ? (
                <EyeOff className="w-4 h-4 mr-2" />
              ) : (
                <Eye className="w-4 h-4 mr-2" />
              )}
              {showPreview ? content.hideDetails : content.showDetails}
            </Button>

            {showPreview && (
              <div className="mt-4 p-4 bg-black/20 rounded-lg border border-red-500/20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-red-300 font-semibold">
                      {lang === "ar" ? "الاسم:" : "Name:"}
                    </span>
                    <p className="text-red-100">{tool.getName(lang)}</p>
                  </div>
                  <div>
                    <span className="text-red-300 font-semibold">
                      {lang === "ar" ? "الفئة:" : "Category:"}
                    </span>
                    <p className="text-red-100">{tool.category}</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-red-300 font-semibold">
                      {lang === "ar" ? "الوصف:" : "Description:"}
                    </span>
                    <p className="text-red-100 mt-1">
                      {tool.getDescription(lang)}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-red-300 font-semibold">
                      {lang === "ar" ? "المميزات:" : "Features:"}
                    </span>
                    <ul className="text-red-100 mt-1 list-disc list-inside">
                      {tool.getFeatures(lang).map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Agreement Checkbox */}
          <div className="flex items-start space-x-3 space-x-reverse">
            <Checkbox
              id="terms-agreement"
              checked={acceptTerms}
              onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
              className="mt-1 border-red-400"
            />
            <label
              htmlFor="terms-agreement"
              className="text-red-200 leading-relaxed cursor-pointer flex-1"
            >
              {content.agreement}
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1 border-gray-500 text-gray-300 hover:bg-gray-700"
            >
              <i className="fas fa-times mr-2"></i>
              {content.cancel}
            </Button>
            <Button
              onClick={onAccept}
              disabled={!acceptTerms}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className="fas fa-arrow-right mr-2"></i>
              {content.accept}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
