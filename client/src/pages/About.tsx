import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useLanguage } from "@/hooks/useLanguage";
import { NeuralBackground } from "@/components/NeuralBackground";
import { useState } from "react";

export default function About() {
  const { t, currentLanguage, toggleLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");

  const aiModels = [
    {
      name: "Stable Diffusion",
      purpose: "Core image generation and transformation engine",
      capabilities: [
        "Text-to-Image",
        "Image-to-Image",
        "Inpainting",
        "Outpainting",
        "Style Transfer",
      ],
      integration: "Local PyTorch with CUDA/ROCm support",
      icon: "fas fa-magic",
    },
    {
      name: "Phi-3 Vision",
      purpose: "Multi-modal AI for intelligent face and body analysis",
      capabilities: [
        "Facial analysis",
        "Smart beauty enhancement",
        "Context understanding",
        "Semantic segmentation",
      ],
      integration: "Microsoft SLM - optimized for local inference",
      icon: "fas fa-brain",
    },
    {
      name: "DeepFaceLab / InsightFace",
      purpose: "Advanced face swapping and realistic transformations",
      capabilities: [
        "Face swapping",
        "Facial landmark detection",
        "Expression transfer",
        "Identity preservation",
      ],
      integration: "Python libraries with pre-trained models",
      icon: "fas fa-mask",
    },
    {
      name: "Real-ESRGAN",
      purpose: "Super-resolution and image enhancement",
      capabilities: [
        "4x upscaling",
        "Noise reduction",
        "Detail enhancement",
        "Quality restoration",
      ],
      integration: "PyTorch with GPU acceleration",
      icon: "fas fa-expand-arrows-alt",
    },
    {
      name: "Segment Anything (SAM)",
      purpose: "Precise object detection and segmentation",
      capabilities: [
        "Object isolation",
        "Background removal",
        "Mask generation",
        "Smart selection",
      ],
      integration: "Meta's foundation model for segmentation",
      icon: "fas fa-crosshairs",
    },
    {
      name: "ControlNet",
      purpose: "Precise control over AI-generated content",
      capabilities: [
        "Pose control",
        "Edge guidance",
        "Depth conditioning",
        "Structural preservation",
      ],
      integration: "Stable Diffusion extension with adapters",
      icon: "fas fa-sliders-h",
    },
  ];

  const toolCategories = [
    {
      category: "Core AI Features",
      icon: "fas fa-magic",
      color: "text-cyan-400",
      tools: [
        "Magic Morph - Select & transform anything with unlimited AI power ✅",
        "Remove & Replace - Erase objects and fill with intelligent context ✅",
      ],
    },
    {
      category: "Background & Environment",
      icon: "fas fa-image",
      color: "text-green-400",
      tools: [
        "Background Replace - Generate or replace backgrounds intelligently ✅",
      ],
    },
    {
      category: "Object Manipulation",
      icon: "fas fa-cube",
      color: "text-orange-400",
      tools: [
        "Object Recoloring - Change colors of any object seamlessly ✅",
        "Text2Image Add - Add new objects with text descriptions ✅",
      ],
    },
    {
      category: "Artistic & Creative",
      icon: "fas fa-paint-brush",
      color: "text-pink-400",
      tools: [
        "Style Transfer - Transform to any artistic style (Anime, Van Gogh, etc.) ✅",
      ],
    },
    {
      category: "Enhancement & Quality",
      icon: "fas fa-sparkles",
      color: "text-emerald-400",
      tools: ["AI Enhance - Upscale and enhance to Ultra HD quality ✅"],
    },
  ];

  const tabs = [
    { id: "overview", name: "Overview", icon: "fas fa-info-circle" },
    { id: "tools", name: "Working AI Tools", icon: "fas fa-toolbox" },
    { id: "models", name: "AI Models", icon: "fas fa-brain" },
    { id: "privacy", name: "Privacy & Freedom", icon: "fas fa-shield-alt" },
    { id: "technical", name: "Technical Details", icon: "fas fa-cog" },
  ];

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <NeuralBackground />

      {/* Navigation */}
      <nav className="glass fixed top-0 left-0 right-0 z-50 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 p-1 animate-pulse-glow">
                <div className="w-full h-full bg-gray-900 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-cyan-400 neon-text">
                    K
                  </span>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold neon-text text-cyan-400">
                  KNOUX VERSA
                </h1>
                <p className="text-xs text-gray-400">
                  {t("The Uncensored AI Nexus")}
                </p>
              </div>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="glass border-cyan-400/30 hover:bg-cyan-400/10"
            >
              <i className="fas fa-globe mr-2"></i>
              {currentLanguage === "en" ? "العربية" : "English"}
            </Button>
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="glass border-purple-400/30 hover:bg-purple-400/10"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                {t("Back to App")}
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <i className="fas fa-info-circle text-6xl text-cyan-400 mb-6 animate-pulse-glow"></i>
            <h2 className="text-4xl font-bold neon-text text-cyan-400 mb-4">
              KNOUX VERSA
            </h2>
            <h3 className="text-2xl font-semibold text-purple-400 mb-4">
              {t("Freedom Without Limits - Local AI Image Editor")}
            </h3>
            <p className="text-xl text-gray-300">
              {t(
                "8 Working AI Tools • Complete Privacy • No Censorship • Fully Local Processing",
              )}
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  glass rounded-full px-6 py-3 font-semibold transition-all duration-300
                  ${
                    activeTab === tab.id
                      ? "border-2 border-cyan-400 bg-cyan-400/10 neon-glow text-cyan-400"
                      : "border border-gray-600 hover:border-gray-400 text-gray-300"
                  }
                `}
              >
                <i className={`${tab.icon} mr-2`}></i>
                {t(tab.name)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Vision Statement */}
              <Card className="glass-strong rounded-2xl p-8 animate-float">
                <h3 className="text-3xl font-bold text-cyan-400 neon-text mb-6">
                  {t('Our Vision: "Freedom Without Limits with KnouxAI"')}
                </h3>
                <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
                  <p>
                    {t(
                      "Our vision is to build an AI image editor that surpasses any existing solutions by providing tremendous image processing power, but most importantly, ensuring absolute privacy and complete freedom.",
                    )}
                  </p>
                  <p>
                    {t(
                      "Users won't need any internet connection or external subscriptions - all operations happen on their device. This means every image they edit remains theirs alone, never leaves their device, and cannot be tracked or used in any way.",
                    )}
                  </p>
                  <p>
                    {t(
                      "We integrate the most powerful open-source AI models to work locally, with a modern and attractive user interface supporting both Arabic and English.",
                    )}
                  </p>
                </div>
              </Card>

              {/* Core Principles */}
              <Card
                className="glass-strong rounded-2xl p-8 animate-float"
                style={{ animationDelay: "0.2s" }}
              >
                <h3 className="text-2xl font-bold text-purple-400 neon-text mb-6">
                  {t("Core Principles")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <i className="fas fa-laptop text-cyan-400 text-2xl mt-1"></i>
                      <div>
                        <h4 className="font-bold text-cyan-400 text-lg">
                          {t("100% Local Processing")}
                        </h4>
                        <p className="text-gray-300">
                          {t(
                            "No internet, no external APIs. Every tool, every AI model, every operation happens exclusively on the user's device.",
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <i className="fas fa-shield-alt text-green-400 text-2xl mt-1"></i>
                      <div>
                        <h4 className="font-bold text-green-400 text-lg">
                          {t("100% Complete Privacy")}
                        </h4>
                        <p className="text-gray-300">
                          {t(
                            "No images or data are uploaded to any external server, ensuring absolute security and privacy of user images.",
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <i className="fas fa-tachometer-alt text-yellow-400 text-2xl mt-1"></i>
                      <div>
                        <h4 className="font-bold text-yellow-400 text-lg">
                          {t("Speed & Performance")}
                        </h4>
                        <p className="text-gray-300">
                          {t(
                            "Optimized to leverage local CPU and GPU resources for maximum performance and smooth editing experience.",
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <i className="fas fa-unlock text-red-400 text-2xl mt-1"></i>
                      <div>
                        <h4 className="font-bold text-red-400 text-lg">
                          {t("No Restrictions or Censorship")}
                        </h4>
                        <p className="text-gray-300">
                          {t(
                            "Complete freedom to use all tools without limitations, including adult content tools (with user responsibility).",
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Developer Section */}
              <Card
                className="glass-strong rounded-2xl p-8 animate-float border-yellow-500/50 vip-exclusive"
                style={{ animationDelay: "0.4s" }}
              >
                <div className="text-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-cyan-400 to-purple-600 p-1 mx-auto mb-4">
                    <div className="w-full h-full bg-gray-900 rounded-full flex items-center justify-center">
                      <i className="fas fa-user-astronaut text-3xl text-cyan-400"></i>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-cyan-400 neon-text mb-2">
                    {t("Created by Sadek Elgazar (KNOUX)")}
                  </h3>
                  <p className="text-gray-400">Abu Dhabi, UAE 🇦🇪</p>
                </div>

                <div className="space-y-4 text-gray-300">
                  <p className="text-lg leading-relaxed">
                    {t(
                      "AI Engineer and modern software developer with authentic Arabic flavor. Creator of advanced systems, automation enthusiast, and programming artist who leaves his mark on every project.",
                    )}
                  </p>
                  <p className="text-md">
                    {t(
                      "From Abu Dhabi, UAE — to the whole world, with an entrepreneurial spirit that combines precision, creativity, and brand luxury!",
                    )}
                  </p>
                </div>
              </Card>
            </div>
          )}

          {activeTab === "tools" && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-cyan-400 neon-text mb-4">
                  {t("8 Working AI Tools")}
                </h3>
                <p className="text-lg text-gray-300">
                  {t(
                    "Each tool is fully implemented and leverages powerful AI models for real image transformations",
                  )}
                </p>
              </div>

              {toolCategories.map((category, index) => (
                <Card
                  key={category.category}
                  className="glass-strong rounded-2xl p-8 animate-float"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center mb-6">
                    <i
                      className={`${category.icon} text-3xl ${category.color} mr-4`}
                    ></i>
                    <h4
                      className={`text-2xl font-bold ${category.color} neon-text`}
                    >
                      {t(category.category)}
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category.tools.map((tool, toolIndex) => (
                      <div
                        key={toolIndex}
                        className="flex items-start space-x-3 p-3 glass rounded-lg"
                      >
                        <i className="fas fa-check-circle text-green-400 mt-1"></i>
                        <p className="text-gray-300">{t(tool)}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}

              {/* VIP Exclusive Section */}
              <Card className="glass-strong rounded-2xl p-8 animate-float border-yellow-500/50 vip-exclusive">
                <div className="flex items-center mb-6">
                  <i className="fas fa-crown text-3xl text-yellow-400 mr-4"></i>
                  <h4 className="text-2xl font-bold text-yellow-400 neon-text">
                    {t("VIP Exclusive Tools")}
                  </h4>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-4 glass rounded-lg border border-yellow-500/30">
                    <i className="fas fa-magic text-yellow-400 mt-1"></i>
                    <div>
                      <h5 className="font-bold text-yellow-400">
                        {t("VIP Magic Morph")}
                      </h5>
                      <p className="text-gray-300">
                        {t(
                          "Sequential AI commands with unlimited complexity - exclusive to Sadek Elgazar",
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-4 glass rounded-lg border border-red-500/30">
                    <i className="fas fa-unlock text-red-400 mt-1"></i>
                    <div>
                      <h5 className="font-bold text-red-400">
                        {t("VIP Uncensored Suite")}
                      </h5>
                      <p className="text-gray-300">
                        {t(
                          "Access to all uncensored AI transformations with full creative freedom",
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === "models" && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-cyan-400 neon-text mb-4">
                  {t("Integrated AI Models")}
                </h3>
                <p className="text-lg text-gray-300">
                  {t(
                    "We integrate only the most powerful open-source AI models, all running locally on your device",
                  )}
                </p>
              </div>

              {aiModels.map((model, index) => (
                <Card
                  key={model.name}
                  className="glass-strong rounded-2xl p-8 animate-float"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start space-x-6">
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-cyan-400/20 to-purple-500/20 flex items-center justify-center">
                      <i className={`${model.icon} text-2xl text-cyan-400`}></i>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-2xl font-bold text-cyan-400 neon-text mb-2">
                        {model.name}
                      </h4>
                      <p className="text-gray-300 text-lg mb-4">
                        {t(model.purpose)}
                      </p>

                      <div className="mb-4">
                        <h5 className="font-semibold text-purple-400 mb-2">
                          {t("Capabilities")}:
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {model.capabilities.map((capability, capIndex) => (
                            <Badge
                              key={capIndex}
                              variant="secondary"
                              className="bg-purple-500/20 text-purple-400"
                            >
                              {t(capability)}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h5 className="font-semibold text-green-400 mb-2">
                          {t("Local Integration")}:
                        </h5>
                        <p className="text-gray-400">{t(model.integration)}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {activeTab === "privacy" && (
            <div className="space-y-8">
              <Card className="glass-strong rounded-2xl p-8 animate-float">
                <h3 className="text-3xl font-bold text-green-400 neon-text mb-6">
                  {t("Your Digital Fortress")}
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <i className="fas fa-laptop text-cyan-400 text-2xl mt-1"></i>
                    <div>
                      <h4 className="font-bold text-cyan-400 text-lg mb-2">
                        {t("Everything Works Offline")}
                      </h4>
                      <p className="text-gray-300">
                        {t(
                          "All AI models and their massive data weights are loaded on the user's device. No internet required for any functionality.",
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <i className="fas fa-shield-alt text-green-400 text-2xl mt-1"></i>
                    <div>
                      <h4 className="font-bold text-green-400 text-lg mb-2">
                        {t("Complete User Control")}
                      </h4>
                      <p className="text-gray-300">
                        {t(
                          "Clear deletion options, optional encryption for work folders, and ability to permanently remove any files from your device.",
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <i className="fas fa-code text-purple-400 text-2xl mt-1"></i>
                    <div>
                      <h4 className="font-bold text-purple-400 text-lg mb-2">
                        {t("Open Source Transparency")}
                      </h4>
                      <p className="text-gray-300">
                        {t(
                          "All application code is open source and auditable. Complete transparency in how data is handled and privacy is protected.",
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <i className="fas fa-unlock text-red-400 text-2xl mt-1"></i>
                    <div>
                      <h4 className="font-bold text-red-400 text-lg mb-2">
                        {t("Unrestricted Freedom")}
                      </h4>
                      <p className="text-gray-300">
                        {t(
                          "No content filtering or censorship. Adult tools available with clear user responsibility warnings. Complete creative freedom.",
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card
                className="glass-strong rounded-2xl p-8 animate-float border-red-500/50"
                style={{ animationDelay: "0.2s" }}
              >
                <h3 className="text-2xl font-bold text-red-400 neon-text mb-4">
                  {t("User Responsibility Notice")}
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {t(
                    "While we provide powerful uncensored tools, users bear complete responsibility for their usage. We include clear warnings for sensitive tools and remind users that using content for illegal or harmful purposes is their personal responsibility alone.",
                  )}
                </p>
              </Card>
            </div>
          )}

          {activeTab === "technical" && (
            <div className="space-y-8">
              <Card className="glass-strong rounded-2xl p-8 animate-float">
                <h3 className="text-3xl font-bold text-cyan-400 neon-text mb-6">
                  {t("Technical Architecture")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xl font-bold text-purple-400 mb-4">
                      {t("Backend")}
                    </h4>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-center">
                        <i className="fas fa-check text-green-400 mr-2"></i>{" "}
                        Python with PyTorch ecosystem
                      </li>
                      <li className="flex items-center">
                        <i className="fas fa-check text-green-400 mr-2"></i>{" "}
                        Hugging Face Transformers
                      </li>
                      <li className="flex items-center">
                        <i className="fas fa-check text-green-400 mr-2"></i>{" "}
                        OpenCV for image processing
                      </li>
                      <li className="flex items-center">
                        <i className="fas fa-check text-green-400 mr-2"></i>{" "}
                        REST API for frontend communication
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-purple-400 mb-4">
                      {t("Frontend")}
                    </h4>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-center">
                        <i className="fas fa-check text-green-400 mr-2"></i>{" "}
                        Electron for cross-platform desktop
                      </li>
                      <li className="flex items-center">
                        <i className="fas fa-check text-green-400 mr-2"></i>{" "}
                        Modern web technologies (HTML/CSS/JS)
                      </li>
                      <li className="flex items-center">
                        <i className="fas fa-check text-green-400 mr-2"></i>{" "}
                        Glassmorphism + Neon design
                      </li>
                      <li className="flex items-center">
                        <i className="fas fa-check text-green-400 mr-2"></i>{" "}
                        Full Arabic/English support
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>

              <Card
                className="glass-strong rounded-2xl p-8 animate-float"
                style={{ animationDelay: "0.2s" }}
              >
                <h3 className="text-2xl font-bold text-yellow-400 neon-text mb-6">
                  {t("Performance Optimization")}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <i className="fas fa-microchip text-green-400 mt-1"></i>
                    <div>
                      <h4 className="font-bold text-green-400">
                        {t("GPU Acceleration")}
                      </h4>
                      <p className="text-gray-300">
                        {t(
                          "Full CUDA/ROCm support for NVIDIA and AMD GPUs. Massive performance boost for AI inference.",
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <i className="fas fa-compress text-blue-400 mt-1"></i>
                    <div>
                      <h4 className="font-bold text-blue-400">
                        {t("Model Optimization")}
                      </h4>
                      <p className="text-gray-300">
                        {t(
                          "ONNX conversion, quantization (FP16/INT8), and TorchScript compilation for faster inference.",
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <i className="fas fa-memory text-purple-400 mt-1"></i>
                    <div>
                      <h4 className="font-bold text-purple-400">
                        {t("Memory Management")}
                      </h4>
                      <p className="text-gray-300">
                        {t(
                          "Smart model caching, lazy loading, and efficient memory usage for smooth operation.",
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card
                className="glass-strong rounded-2xl p-8 animate-float"
                style={{ animationDelay: "0.4s" }}
              >
                <h3 className="text-2xl font-bold text-orange-400 neon-text mb-6">
                  {t("Distribution & Updates")}
                </h3>
                <div className="space-y-4 text-gray-300">
                  <p>
                    <strong className="text-orange-400">
                      {t("Executable Packages")}:
                    </strong>{" "}
                    {t(
                      "Single executable files for Windows, macOS, and Linux with all dependencies included.",
                    )}
                  </p>
                  <p>
                    <strong className="text-orange-400">
                      {t("Model Management")}:
                    </strong>{" "}
                    {t(
                      "Built-in tools for downloading, updating, and managing AI model weights locally.",
                    )}
                  </p>
                  <p>
                    <strong className="text-orange-400">
                      {t("Open Source")}:
                    </strong>{" "}
                    {t(
                      "Full source code available on GitHub for community contribution and transparency.",
                    )}
                  </p>
                </div>
              </Card>
            </div>
          )}

          {/* Call to Action */}
          <div className="text-center mt-12">
            <Link href="/">
              <Button className="transform-button px-8 py-4 text-lg font-bold rounded-xl">
                <i className="fas fa-rocket mr-3"></i>
                {t("Experience the Power - Start Transforming")}
              </Button>
            </Link>
          </div>

          {/* Footer Signature */}
          <Card className="glass-strong rounded-2xl p-8 text-center mt-12 animate-float">
            <div className="border-l-4 border-cyan-400 pl-6 text-left max-w-2xl mx-auto">
              <p className="text-lg italic text-gray-300 mb-4">
                "{t("Where imagination meets artificial intelligence.")}
                <br />
                {t("Crafted with creativity by Sadek Elgazar")}"
              </p>
              <div className="flex items-center justify-between">
                <div className="text-cyan-400 font-bold">
                  - Sadek Elgazar (KNOUX)
                </div>
                <div className="text-sm text-gray-400">© 2025 KNOUX VERSA</div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
