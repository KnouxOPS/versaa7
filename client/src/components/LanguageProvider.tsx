import { createContext, useState, useEffect, ReactNode } from "react";

interface LanguageContextType {
  currentLanguage: "en" | "ar";
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

const translations = {
  en: {
    // Navigation & Header
    "The Uncensored AI Nexus": "The Uncensored AI Nexus",
    About: "About",
    "Back to App": "Back to App",

    // Hero Section
    "Transform Images with AI Magic": "Transform Images with AI Magic",
    "Select any area, write any command, and watch AI transform your vision into reality - without limits, without censorship.":
      "Select any area, write any command, and watch AI transform your vision into reality - without limits, without censorship.",

    // Services
    "Magic Morph": "Magic Morph",
    "Select & transform anything with unlimited AI power":
      "Select & transform anything with unlimited AI power",
    Uncensored: "Uncensored",
    "Remove & Replace": "Remove & Replace",
    "Erase objects and fill with intelligent context":
      "Erase objects and fill with intelligent context",
    "Style Transfer": "Style Transfer",
    "Transform to any artistic style (Anime, 3D, Van Gogh...)":
      "Transform to any artistic style (Anime, 3D, Van Gogh...)",
    "Background Replace": "Background Replace",
    "Generate or replace backgrounds with AI":
      "Generate or replace backgrounds with AI",
    "Object Recolor": "Object Recolor",
    "Change colors of any object intelligently":
      "Change colors of any object intelligently",
    "Text2Image Add": "Text2Image Add",
    "Add new objects with text descriptions":
      "Add new objects with text descriptions",
    "AI Enhance": "AI Enhance",
    "Upscale and enhance to Ultra HD quality":
      "Upscale and enhance to Ultra HD quality",
    "VIP Magic Morph": "VIP Magic Morph",
    "Ultra-advanced AI for complex transformations (Owner Only)":
      "Ultra-advanced AI for complex transformations (Owner Only)",
    "Sadek Elgazar Exclusive": "Sadek Elgazar Exclusive",

    // Image Upload
    "Upload & Select Area": "Upload & Select Area",
    "Drop your image here or click to upload":
      "Drop your image here or click to upload",
    "Supports JPG, PNG, WebP - Max 10MB": "Supports JPG, PNG, WebP - Max 10MB",
    "Choose Image": "Choose Image",
    "Uploading...": "Uploading...",
    "Please upload a valid image file.": "Please upload a valid image file.",
    "File size must be less than 10MB.": "File size must be less than 10MB.",
    "Failed to upload image. Please try again.":
      "Failed to upload image. Please try again.",

    // Selection Tools
    "Brush Select": "Brush Select",
    Rectangle: "Rectangle",
    Clear: "Clear",
    "New Image": "New Image",

    // AI Command Center
    "AI Command Center": "AI Command Center",
    "Selected Service": "Selected Service",
    "Output Quality": "Output Quality",
    "Standard (Fast)": "Standard (Fast)",
    "High Quality": "High Quality",
    "Ultra HD (Slow)": "Ultra HD (Slow)",
    "AI Command (The Prompt Nexus)": "AI Command (The Prompt Nexus)",
    "AI Suggestions": "AI Suggestions",
    "🚀 Start AI Transformation": "🚀 Start AI Transformation",
    "Processing...": "Processing...",
    "VIP Exclusive Service - Requires special access key":
      "VIP Exclusive Service - Requires special access key",

    // Processing
    "AI Processing...": "AI Processing...",
    "Analyzing your image...": "Analyzing your image...",
    "Understanding AI command...": "Understanding AI command...",
    "Generating transformation...": "Generating transformation...",
    "Applying AI magic...": "Applying AI magic...",
    "Enhancing details...": "Enhancing details...",
    "Finalizing results...": "Finalizing results...",

    // Results
    "AI Transformation Results": "AI Transformation Results",
    Before: "Before",
    After: "After",
    "Drag to compare": "Drag to compare",
    "Download Result": "Download Result",
    "Download Original": "Download Original",
    Share: "Share",
    "New Transform": "New Transform",
    "Transformation completed successfully • No watermarks • Full quality preserved":
      "Transformation completed successfully • No watermarks • Full quality preserved",
    "Link copied to clipboard!": "Link copied to clipboard!",

    // VIP Modal
    "VIP Exclusive Service": "VIP Exclusive Service",
    "This service is exclusive to the owner: Sadek Elgazar, and requires a VIP key.":
      "This service is exclusive to the owner: Sadek Elgazar, and requires a VIP key.",
    "Enter VIP Key...": "Enter VIP Key...",
    "Please enter a VIP key": "Please enter a VIP key",
    "Invalid VIP key": "Invalid VIP key",
    "Authentication failed. Please try again.":
      "Authentication failed. Please try again.",
    "Access VIP": "Access VIP",
    Cancel: "Cancel",
    "Verifying...": "Verifying...",
    "VIP Magic Morph Features": "VIP Magic Morph Features",
    "Unlimited transformation complexity":
      "Unlimited transformation complexity",
    "Sequential command processing": "Sequential command processing",
    "Ultra-premium quality output": "Ultra-premium quality output",
    "Priority processing queue": "Priority processing queue",
    "Exclusive Sadek Elgazar signature option":
      "Exclusive Sadek Elgazar signature option",
    "This service is exclusively reserved for the project owner: Sadek Elgazar":
      "This service is exclusively reserved for the project owner: Sadek Elgazar",

    // Error States
    "Transformation Failed": "Transformation Failed",
    "Try Again": "Try Again",

    // About Page
    "About KNOUX VERSA": "About KNOUX VERSA",
    "Revolutionary AI-powered image transformation platform":
      "Revolutionary AI-powered image transformation platform",
    "Developer: Sadek Elgazar (KNOUX)": "Developer: Sadek Elgazar (KNOUX)",
    "AI Engineer and modern software developer with authentic Arabic flavor. Creator of advanced systems, automation enthusiast, and programming artist who leaves his mark on every project.":
      "AI Engineer and modern software developer with authentic Arabic flavor. Creator of advanced systems, automation enthusiast, and programming artist who leaves his mark on every project.",
    "From Abu Dhabi, UAE — to the whole world, with an entrepreneurial spirit that combines precision, creativity, and brand luxury!":
      "From Abu Dhabi, UAE — to the whole world, with an entrepreneurial spirit that combines precision, creativity, and brand luxury!",
    "What is KNOUX VERSA?": "What is KNOUX VERSA?",
    "is an advanced AI platform that automatically edits your images with text commands, without limits or restrictions — 'Select, Write, Be Amazed!'":
      "is an advanced AI platform that automatically edits your images with text commands, without limits or restrictions — 'Select, Write, Be Amazed!'",
    "It uses the latest AI technologies (Image Generation/Transformation), and a futuristic luxury user interface that supports Arabic and English.":
      "It uses the latest AI technologies (Image Generation/Transformation), and a futuristic luxury user interface that supports Arabic and English.",
    "Why KNOUX VERSA?": "Why KNOUX VERSA?",
    "Fastest & Strongest": "Fastest & Strongest",
    "Edit images in moments without needing Photoshop or Adobe expertise.":
      "Edit images in moments without needing Photoshop or Adobe expertise.",
    "AI that speaks your language": "AI that speaks your language",
    "Arabic and English, human text commands, and easy integration.":
      "Arabic and English, human text commands, and easy integration.",
    "Uncompromising privacy": "Uncompromising privacy",
    "Everything happens on your device, or on encrypted and secure servers.":
      "Everything happens on your device, or on encrypted and secure servers.",
    "Modern interface": "Modern interface",
    "Glass/neon design (Glassmorphism + Neon), full support for all devices.":
      "Glass/neon design (Glassmorphism + Neon), full support for all devices.",
    "Exclusive Features": "Exclusive Features",
    "Edit clothes, backgrounds, elements... with just a text command!":
      "Edit clothes, backgrounds, elements... with just a text command!",
    "Instant preview and save in Ultra HD quality.":
      "Instant preview and save in Ultra HD quality.",
    "Bilingual support with simplified explanations for beginners.":
      "Bilingual support with simplified explanations for beginners.",
    "VIP Premium Service (Magic Morph):": "VIP Premium Service (Magic Morph):",
    "Sequential commands with creative results — available only to the project owner (Sadek Elgazar)!":
      "Sequential commands with creative results — available only to the project owner (Sadek Elgazar)!",
    "Back to Transform Images": "Back to Transform Images",

    // Footer
    "Crafted with creativity by": "Crafted with creativity by",
    "© 2025 KNOUX VERSA — Where imagination meets artificial intelligence.":
      "© 2025 KNOUX VERSA — Where imagination meets artificial intelligence.",
    "Support the creator on": "Support the creator on",

    // New AI Tools Translations
    "Face Swap": "Face Swap",
    "Seamlessly swap faces with ultra-realistic results":
      "Seamlessly swap faces with ultra-realistic results",
    "AI Beauty Filter": "AI Beauty Filter",
    "Enhance facial features naturally with smart retouching":
      "Enhance facial features naturally with smart retouching",
    "Body Reshape": "Body Reshape",
    "Intelligently resize and reshape body parts":
      "Intelligently resize and reshape body parts",
    "Age Transform": "Age Transform",
    "Make people look younger or older realistically":
      "Make people look younger or older realistically",
    "Gender Swap": "Gender Swap",
    "Transform gender while preserving identity":
      "Transform gender while preserving identity",
    "Expression Change": "Expression Change",
    "Modify facial expressions (smile, surprise, etc.)":
      "Modify facial expressions (smile, surprise, etc.)",
    "Virtual Try-On": "Virtual Try-On",
    "Try different clothes virtually on your body":
      "Try different clothes virtually on your body",
    "Clothing Removal": "Clothing Removal",
    "Remove or modify clothing items": "Remove or modify clothing items",
    "Makeup Editor": "Makeup Editor",
    "Add or remove makeup with precision":
      "Add or remove makeup with precision",
    "Tattoo Designer": "Tattoo Designer",
    "Add realistic tattoos and accessories":
      "Add realistic tattoos and accessories",
    "Hair Transformation": "Hair Transformation",
    "Change hairstyle, length, and color":
      "Change hairstyle, length, and color",
    "Eye Color Change": "Eye Color Change",
    "Modify eye and skin colors naturally":
      "Modify eye and skin colors naturally",
    "Smart Background Removal": "Smart Background Removal",
    "Remove backgrounds with AI precision":
      "Remove backgrounds with AI precision",
    "Smart Lighting": "Smart Lighting",
    "Automatically adjust lighting and shadows":
      "Automatically adjust lighting and shadows",
    "Scene Compositing": "Scene Compositing",
    "Blend multiple photos into one scene":
      "Blend multiple photos into one scene",
    "Object Removal": "Object Removal",
    "Intelligently remove unwanted objects":
      "Intelligently remove unwanted objects",
    "Object Recoloring": "Object Recoloring",
    "Change colors of any object seamlessly":
      "Change colors of any object seamlessly",
    "Text to Object": "Text to Object",
    "Add new objects using text descriptions":
      "Add new objects using text descriptions",
    Cartoonize: "Cartoonize",
    "Convert realistic photos to cartoon style":
      "Convert realistic photos to cartoon style",
    "Colorize B&W": "Colorize B&W",
    "Add realistic colors to black & white photos":
      "Add realistic colors to black & white photos",
    "Super Resolution": "Super Resolution",
    "Upscale images to Ultra HD quality": "Upscale images to Ultra HD quality",
    "Noise Removal": "Noise Removal",
    "Remove noise and enhance image clarity":
      "Remove noise and enhance image clarity",
    "Red Eye Fix": "Red Eye Fix",
    "Automatically correct red eye effects":
      "Automatically correct red eye effects",
    "Smart Crop": "Smart Crop",
    "AI-powered intelligent cropping": "AI-powered intelligent cropping",
    "Smart Photo Blending": "Smart Photo Blending",
    "Seamlessly blend multiple photos": "Seamlessly blend multiple photos",
    "Interactive Filters": "Interactive Filters",
    "Real-time filters with AI animations":
      "Real-time filters with AI animations",
    "3D Depth Effects": "3D Depth Effects",
    "Generate depth maps for 3D effects": "Generate depth maps for 3D effects",
    "VIP Uncensored Suite": "VIP Uncensored Suite",
    "Access to all uncensored AI transformations":
      "Access to all uncensored AI transformations",

    // Categories and UI
    "All Tools": "All Tools",
    "Face & Body": "Face & Body",
    Fashion: "Fashion",
    Style: "Style",
    Background: "Background",
    Objects: "Objects",
    Artistic: "Artistic",
    Enhancement: "Enhancement",
    Creative: "Creative",
    "VIP Exclusive": "VIP Exclusive",
    "AI Tools Available": "AI Tools Available",
    Category: "Category",
    "Adult Content Warning": "Adult Content Warning",
    "This tool contains adult content (18+). By proceeding, you acknowledge that you are of legal age and accept full responsibility for your use of this content.":
      "This tool contains adult content (18+). By proceeding, you acknowledge that you are of legal age and accept full responsibility for your use of this content.",
    "I Accept (18+)": "I Accept (18+)",

    // About Page New Sections
    "Freedom Without Limits - Local AI Image Editor":
      "Freedom Without Limits - Local AI Image Editor",
    "30+ Powerful AI Tools • Complete Privacy • No Censorship • Fully Local Processing":
      "30+ Powerful AI Tools • Complete Privacy • No Censorship • Fully Local Processing",
    "30 AI Tools": "30 AI Tools",
    "AI Models": "AI Models",
    "Privacy & Freedom": "Privacy & Freedom",
    "Technical Details": "Technical Details",
    'Our Vision: "Freedom Without Limits with KnouxAI"':
      'Our Vision: "Freedom Without Limits with KnouxAI"',
    "Our vision is to build an AI image editor that surpasses any existing solutions by providing tremendous image processing power, but most importantly, ensuring absolute privacy and complete freedom.":
      "Our vision is to build an AI image editor that surpasses any existing solutions by providing tremendous image processing power, but most importantly, ensuring absolute privacy and complete freedom.",
    "Users won't need any internet connection or external subscriptions - all operations happen on their device. This means every image they edit remains theirs alone, never leaves their device, and cannot be tracked or used in any way.":
      "Users won't need any internet connection or external subscriptions - all operations happen on their device. This means every image they edit remains theirs alone, never leaves their device, and cannot be tracked or used in any way.",
    "We integrate the most powerful open-source AI models to work locally, with a modern and attractive user interface supporting both Arabic and English.":
      "We integrate the most powerful open-source AI models to work locally, with a modern and attractive user interface supporting both Arabic and English.",
    "Core Principles": "Core Principles",
    "100% Local Processing": "100% Local Processing",
    "No internet, no external APIs. Every tool, every AI model, every operation happens exclusively on the user's device.":
      "No internet, no external APIs. Every tool, every AI model, every operation happens exclusively on the user's device.",
    "100% Complete Privacy": "100% Complete Privacy",
    "No images or data are uploaded to any external server, ensuring absolute security and privacy of user images.":
      "No images or data are uploaded to any external server, ensuring absolute security and privacy of user images.",
    "Speed & Performance": "Speed & Performance",
    "Optimized to leverage local CPU and GPU resources for maximum performance and smooth editing experience.":
      "Optimized to leverage local CPU and GPU resources for maximum performance and smooth editing experience.",
    "No Restrictions or Censorship": "No Restrictions or Censorship",
    "Complete freedom to use all tools without limitations, including adult content tools (with user responsibility).":
      "Complete freedom to use all tools without limitations, including adult content tools (with user responsibility).",
    "Created by Sadek Elgazar (KNOUX)": "Created by Sadek Elgazar (KNOUX)",
    "30 Supercharged AI Tools": "30 Supercharged AI Tools",
    "Each tool leverages the most powerful open-source AI models for unprecedented image transformation capabilities":
      "Each tool leverages the most powerful open-source AI models for unprecedented image transformation capabilities",
    "Face & Body Transformation": "Face & Body Transformation",
    "Fashion & Style": "Fashion & Style",
    "Background & Environment": "Background & Environment",
    "Object Manipulation": "Object Manipulation",
    "Artistic & Creative": "Artistic & Creative",
    "Enhancement & Quality": "Enhancement & Quality",
    "VIP Exclusive Tools": "VIP Exclusive Tools",
    "Sequential AI commands with unlimited complexity - exclusive to Sadek Elgazar":
      "Sequential AI commands with unlimited complexity - exclusive to Sadek Elgazar",
    "Access to all uncensored AI transformations with full creative freedom":
      "Access to all uncensored AI transformations with full creative freedom",
    "Integrated AI Models": "Integrated AI Models",
    "We integrate only the most powerful open-source AI models, all running locally on your device":
      "We integrate only the most powerful open-source AI models, all running locally on your device",
    "Your Digital Fortress": "Your Digital Fortress",
    "Everything Works Offline": "Everything Works Offline",
    "All AI models and their massive data weights are loaded on the user's device. No internet required for any functionality.":
      "All AI models and their massive data weights are loaded on the user's device. No internet required for any functionality.",
    "Complete User Control": "Complete User Control",
    "Clear deletion options, optional encryption for work folders, and ability to permanently remove any files from your device.":
      "Clear deletion options, optional encryption for work folders, and ability to permanently remove any files from your device.",
    "Open Source Transparency": "Open Source Transparency",
    "All application code is open source and auditable. Complete transparency in how data is handled and privacy is protected.":
      "All application code is open source and auditable. Complete transparency in how data is handled and privacy is protected.",
    "Unrestricted Freedom": "Unrestricted Freedom",
    "No content filtering or censorship. Adult tools available with clear user responsibility warnings. Complete creative freedom.":
      "No content filtering or censorship. Adult tools available with clear user responsibility warnings. Complete creative freedom.",
    "User Responsibility Notice": "User Responsibility Notice",
    "While we provide powerful uncensored tools, users bear complete responsibility for their usage. We include clear warnings for sensitive tools and remind users that using content for illegal or harmful purposes is their personal responsibility alone.":
      "While we provide powerful uncensored tools, users bear complete responsibility for their usage. We include clear warnings for sensitive tools and remind users that using content for illegal or harmful purposes is their personal responsibility alone.",
    "Technical Architecture": "Technical Architecture",
    Backend: "Backend",
    Frontend: "Frontend",
    "Performance Optimization": "Performance Optimization",
    "GPU Acceleration": "GPU Acceleration",
    "Full CUDA/ROCm support for NVIDIA and AMD GPUs. Massive performance boost for AI inference.":
      "Full CUDA/ROCm support for NVIDIA and AMD GPUs. Massive performance boost for AI inference.",
    "Model Optimization": "Model Optimization",
    "ONNX conversion, quantization (FP16/INT8), and TorchScript compilation for faster inference.":
      "ONNX conversion, quantization (FP16/INT8), and TorchScript compilation for faster inference.",
    "Memory Management": "Memory Management",
    "Smart model caching, lazy loading, and efficient memory usage for smooth operation.":
      "Smart model caching, lazy loading, and efficient memory usage for smooth operation.",
    "Distribution & Updates": "Distribution & Updates",
    "Executable Packages": "Executable Packages",
    "Single executable files for Windows, macOS, and Linux with all dependencies included.":
      "Single executable files for Windows, macOS, and Linux with all dependencies included.",
    "Model Management": "Model Management",
    "Built-in tools for downloading, updating, and managing AI model weights locally.":
      "Built-in tools for downloading, updating, and managing AI model weights locally.",
    "Open Source": "Open Source",
    "Full source code available on GitHub for community contribution and transparency.":
      "Full source code available on GitHub for community contribution and transparency.",
    "Experience the Power - Start Transforming":
      "Experience the Power - Start Transforming",
    "Where imagination meets artificial intelligence.":
      "Where imagination meets artificial intelligence.",
    Capabilities: "Capabilities",
    "Local Integration": "Local Integration",
    Working: "Working",
    "8 Working AI Tools • Complete Privacy • No Censorship • Fully Local Processing":
      "8 Working AI Tools • Complete Privacy • No Censorship • Fully Local Processing",
    "Working AI Tools": "Working AI Tools",
    "8 Working AI Tools": "8 Working AI Tools",
    "Each tool is fully implemented and leverages powerful AI models for real image transformations":
      "Each tool is fully implemented and leverages powerful AI models for real image transformations",
    "Core AI Features": "Core AI Features",
    "Core Features": "Core Features",
    "Image Editor": "Image Editor",
    Circle: "Circle",
    "Click to upload an image or drag and drop":
      "Click to upload an image or drag and drop",
    "Supports JPG, PNG, GIF up to 10MB": "Supports JPG, PNG, GIF up to 10MB",
    "Select a tool above and draw on the image to mark areas for AI transformation.":
      "Select a tool above and draw on the image to mark areas for AI transformation.",
    "Selection active - ready for AI processing":
      "Selection active - ready for AI processing",
    "No area selected - AI will process the entire image":
      "No area selected - AI will process the entire image",
    "Failed to load image. Please try again.":
      "Failed to load image. Please try again.",
  },
  ar: {
    // Navigation & Header
    "The Uncensored AI Nexus": "مركز الذكاء الاصطناعي بلا قيود",
    About: "حول",
    "Back to App": "العودة للتطبيق",

    // Hero Section
    "Transform Images with AI Magic": "حوّل الصور بسحر الذكاء الاصطناعي",
    "Select any area, write any command, and watch AI transform your vision into reality - without limits, without censorship.":
      "ظلّل أي منطقة، اكتب أي أمر، وشاهد الذكاء الاصطناعي يحوّل رؤيتك إلى واقع - بلا حدود، بلا قيود.",

    // Services
    "Magic Morph": "التحويل السحري",
    "Select & transform anything with unlimited AI power":
      "ظلّل وحوّل أي شيء بقوة الذكاء الاصطناعي اللامحدودة",
    Uncensored: "بلا قيود",
    "Remove & Replace": "إزالة واستبدال",
    "Erase objects and fill with intelligent context":
      "امحي العناصر واملأ المنطقة بذكاء سياقي",
    "Style Transfer": "تحويل الأسلوب",
    "Transform to any artistic style (Anime, 3D, Van Gogh...)":
      "حوّل لأي ستايل فني (أنمي، ثلاثي الأبعاد، فان جوخ...)",
    "Background Replace": "تغيير الخلفية",
    "Generate or replace backgrounds with AI":
      "ولّد أو استبدل الخلفيات بالذكاء الاصطناعي",
    "Object Recolor": "إعادة تلوين العناصر",
    "Change colors of any object intelligently": "غيّر ألوان أي عنصر بذكاء",
    "Text2Image Add": "إضافة نص لصورة",
    "Add new objects with text descriptions": "أضف عناصر جديدة بالوصف النصي",
    "AI Enhance": "تحسين ذكي",
    "Upscale and enhance to Ultra HD quality": "كبّر وحسّن لجودة فائقة الوضوح",
    "VIP Magic Morph": "التحويل السحري VIP",
    "Ultra-advanced AI for complex transformations (Owner Only)":
      "ذكاء اصطناعي فائق للتحولات المعقدة (المالك فقط)",
    "Sadek Elgazar Exclusive": "حصري لصادق الجزار",

    // Image Upload
    "Upload & Select Area": "ارفع واختر المنطقة",
    "Drop your image here or click to upload": "اسحب صورتك هنا أو اضغط للرفع",
    "Supports JPG, PNG, WebP - Max 10MB":
      "يدعم JPG, PNG, WebP - حد أقصى 10 ميجا",
    "Choose Image": "اختر صورة",
    "Uploading...": "جاري الرفع...",
    "Please upload a valid image file.": "يرجى رفع ملف صورة صحيح.",
    "File size must be less than 10MB.":
      "يجب أن يكون حجم الملف أقل من 10 ميجا.",
    "Failed to upload image. Please try again.":
      "فشل رفع الصورة. يرجى المحاولة مرة أخرى.",

    // Selection Tools
    "Brush Select": "فرشاة التحديد",
    Rectangle: "مستطيل",
    Clear: "مسح",
    "New Image": "صورة جديدة",

    // AI Command Center
    "AI Command Center": "مركز أوامر الذكاء الاصطناعي",
    "Selected Service": "الخدمة المختارة",
    "Output Quality": "جودة المخرجات",
    "Standard (Fast)": "عادية (سريعة)",
    "High Quality": "جودة عالية",
    "Ultra HD (Slow)": "فائقة الوضوح (بطيئة)",
    "AI Command (The Prompt Nexus)": "أمر الذكاء الاصطناعي (مركز الأوامر)",
    "AI Suggestions": "اقتراحات الذكاء الاصطناعي",
    "🚀 Start AI Transformation": "🚀 ابدأ التحويل الذكي",
    "Processing...": "معالجة...",
    "VIP Exclusive Service - Requires special access key":
      "خدمة VIP حصرية - تتطلب مفتاح وصول خاص",

    // Processing
    "AI Processing...": "معالجة ذكية...",
    "Analyzing your image...": "تحليل صورتك...",
    "Understanding AI command...": "فهم أمر الذكاء الاصطناعي...",
    "Generating transformation...": "توليد التحويل...",
    "Applying AI magic...": "تطبيق السحر الذكي...",
    "Enhancing details...": "تحسين التفاصيل...",
    "Finalizing results...": "وضع اللمسات الأخيرة...",

    // Results
    "AI Transformation Results": "نتائج التحويل الذكي",
    Before: "قبل",
    After: "بعد",
    "Drag to compare": "اسحب للمقارنة",
    "Download Result": "تحميل النتيجة",
    "Download Original": "تحميل الأصلي",
    Share: "مشاركة",
    "New Transform": "تحويل جديد",
    "Transformation completed successfully • No watermarks • Full quality preserved":
      "تم التحويل بنجاح • بلا علامات مائية • جودة كاملة محفوظة",
    "Link copied to clipboard!": "تم نسخ الرابط!",

    // VIP Modal
    "VIP Exclusive Service": "خدمة VIP حصرية",
    "This service is exclusive to the owner: Sadek Elgazar, and requires a VIP key.":
      "هذه الخدمة حصرية للمالك: صادق الجزار، وتتطلب مفتاح VIP.",
    "Enter VIP Key...": "أدخل مفتاح VIP...",
    "Please enter a VIP key": "يرجى إدخال مفتاح VIP",
    "Invalid VIP key": "مفتاح VIP غير صحيح",
    "Authentication failed. Please try again.":
      "فشل التحقق. يرجى المحاولة مرة أخرى.",
    "Access VIP": "دخول VIP",
    Cancel: "إلغاء",
    "Verifying...": "جاري التحقق...",
    "VIP Magic Morph Features": "ميزات التحويل السحري VIP",
    "Unlimited transformation complexity": "تعقيد تحويل لامحدود",
    "Sequential command processing": "معالجة أوامر متسلسلة",
    "Ultra-premium quality output": "مخرجات فائقة الجودة",
    "Priority processing queue": "أولوية في طابور المعالجة",
    "Exclusive Sadek Elgazar signature option": "خيار توقيع صادق الجزار الحصري",
    "This service is exclusively reserved for the project owner: Sadek Elgazar":
      "هذه الخدمة محفوظة حصرياً لمالك المشروع: صادق الجزار",

    // Error States
    "Transformation Failed": "فشل التحويل",
    "Try Again": "حاول مرة أخرى",

    // About Page
    "About KNOUX VERSA": "حول KNOUX VERSA",
    "Revolutionary AI-powered image transformation platform":
      "منصة ثورية لتحويل الصو�� بالذكاء الاصطناعي",
    "Developer: Sadek Elgazar (KNOUX)": "المطور: صادق الجزار (KNOUX)",
    "AI Engineer and modern software developer with authentic Arabic flavor. Creator of advanced systems, automation enthusiast, and programming artist who leaves his mark on every project.":
      "مهندس ذكاء اصطناعي ومطور برمجيات عصري بنكهة عربية أصلية. صانع الأنظمة المتطورة، العاشق للأتمتة، وفنان البرمجة الذي يضع بصمته في كل مشروع.",
    "From Abu Dhabi, UAE — to the whole world, with an entrepreneurial spirit that combines precision, creativity, and brand luxury!":
      "من أبوظبي، الإمارات — إلى العالم كله، بروح ريادية تجمع بين الدقة، الإبداع، وفخامة البراند!",
    "What is KNOUX VERSA?": "ما هو KNOUX VERSA؟",
    "is an advanced AI platform that automatically edits your images with text commands, without limits or restrictions — 'Select, Write, Be Amazed!'":
      "منصة ذكاء صناعي متقدمة تعدّل صورك أوتوماتيكياً بأوامر نصية، بدون حدود أو قيود — 'ظلّل، اكتب، انبهر!'",
    "It uses the latest AI technologies (Image Generation/Transformation), and a futuristic luxury user interface that supports Arabic and English.":
      "يستخدم أحدث تقنيات الذكاء الاصطناعي (توليد/تحويل الصور)، وواجهة مستخدم مستقبلية فاخرة تدعم العربية والإنجليزية.",
    "Why KNOUX VERSA?": "لماذا KNOUX VERSA؟",
    "Fastest & Strongest": "الأسرع والأقوى",
    "Edit images in moments without needing Photoshop or Adobe expertise.":
      "عدّل الصور في لحظات بدون الحاجة لخبرة فوتوشوب أو أدوبي.",
    "AI that speaks your language": "ذكاء اصطناعي يتكلم لغتك",
    "Arabic and English, human text commands, and easy integration.":
      "عربي وإنجليزي، أوامر نصية بشرية، وتكامل سهل.",
    "Uncompromising privacy": "خصوصية لا مساومة فيها",
    "Everything happens on your device, or on encrypted and secure servers.":
      "كل شيء يتم عندك، أو على خوادم مشفّرة وآمنة.",
    "Modern interface": "واجهة عصرية",
    "Glass/neon design (Glassmorphism + Neon), full support for all devices.":
      "تصميم زجاجي/نيون (Glassmorphism + Neon)، دعم كامل لكل الأجهزة.",
    "Exclusive Features": "ميزات حصرية",
    "Edit clothes, backgrounds, elements... with just a text command!":
      "عدّل ملابس، خلفيات، عناصر... بأمر نصي فقط!",
    "Instant preview and save in Ultra HD quality.":
      "معاينة فورية وحفظ بجودة Ultra HD.",
    "Bilingual support with simplified explanations for beginners.":
      "دعم لغتين وشرح مبسط للمبتدئين.",
    "VIP Premium Service (Magic Morph):": "خدمة بريميوم VIP (Magic Morph):",
    "Sequential commands with creative results — available only to the project owner (Sadek Elgazar)!":
      "أوامر متسلسلة مع نتائج إبداعية — متاحة فقط لصاحب المشروع (صادق الجزار)!",
    "Back to Transform Images": "العودة لتحويل الصور",

    // Footer
    "Crafted with creativity by": "صُنع بإبداع بواسطة",
    "© 2025 KNOUX VERSA — Where imagination meets artificial intelligence.":
      "© 2025 KNOUX VERSA — حيث يلتقي الخيال بالذكاء الاصطناعي.",
    "Support the creator on": "ادعم المطور على",

    // New AI Tools Translations (Arabic)
    "Face Swap": "تبديل الوجوه",
    "Seamlessly swap faces with ultra-realistic results":
      "تبديل الوجوه بسلاسة مع نتائج فائقة الواقعية",
    "AI Beauty Filter": "فلتر الجمال الذكي",
    "Enhance facial features naturally with smart retouching":
      "تحسين ملامح الوجه طبيعياً بالتنقيح الذكي",
    "Body Reshape": "إعادة تشكيل الجسم",
    "Intelligently resize and reshape body parts":
      "تغيير حجم وشكل أجزاء الجسم بذكاء",
    "Age Transform": "تحويل العمر",
    "Make people look younger or older realistically":
      "جعل الأشخاص يبدون أصغر أو أكبر سناً بواقعية",
    "Gender Swap": "تبديل الجنس",
    "Transform gender while preserving identity":
      "تحويل الجنس مع الحفاظ على الهوية",
    "Expression Change": "تغيير التعبير",
    "Modify facial expressions (smile, surprise, etc.)":
      "تعديل تعبيرات الوجه (ابتسامة، مفاجأة، إلخ)",
    "Virtual Try-On": "التجربة الافتراضية",
    "Try different clothes virtually on your body":
      "جرب ملابس مختلفة افتراضياً على جسمك",
    "Clothing Removal": "إزالة الملابس",
    "Remove or modify clothing items": "إزالة أو تعديل قطع الملابس",
    "Makeup Editor": "محرر المكياج",
    "Add or remove makeup with precision": "إضافة أو إزالة المكياج بدقة",
    "Tattoo Designer": "مصمم الوشوم",
    "Add realistic tattoos and accessories": "إضافة وشوم وإكسسوارات واقعية",
    "Hair Transformation": "تحويل الشعر",
    "Change hairstyle, length, and color": "تغيير تسريحة وطول ولون الشعر",
    "Eye Color Change": "تغيير لون العيون",
    "Modify eye and skin colors naturally":
      "تعديل ألوان العيون والبشرة طبيعياً",
    "Smart Background Removal": "إزالة الخلفية الذكية",
    "Remove backgrounds with AI precision":
      "إزالة الخلفيات بدقة الذكاء الاصطناعي",
    "Smart Lighting": "الإضاءة الذكية",
    "Automatically adjust lighting and shadows": "ضبط الإضاءة والظلال تلقائياً",
    "Scene Compositing": "تركيب المشاهد",
    "Blend multiple photos into one scene": "مزج عدة صور في مشهد واحد",
    "Object Removal": "إزالة العناصر",
    "Intelligently remove unwanted objects": "إزالة العناصر غير المرغوبة بذكاء",
    "Object Recoloring": "إعادة تلوين العناصر",
    "Change colors of any object seamlessly": "تغيير ألوان أي عنصر بسلاسة",
    "Text to Object": "نص إلى عنصر",
    "Add new objects using text descriptions": "إضافة عناصر جديدة بالوصف النصي",
    Cartoonize: "تحويل كرتوني",
    "Convert realistic photos to cartoon style":
      "تحويل الصور الواقعية إلى أسلوب كرتوني",
    "Colorize B&W": "تلوين الأبيض والأسود",
    "Add realistic colors to black & white photos":
      "إضافة ألوان واقعية للصور بالأبيض والأسود",
    "Super Resolution": "الدقة الفائقة",
    "Upscale images to Ultra HD quality": "تكبير الصور لجودة فائقة الوضوح",
    "Noise Removal": "إزالة الضوضاء",
    "Remove noise and enhance image clarity":
      "إزالة الضوضاء وتحسين وضوح الصورة",
    "Red Eye Fix": "إصلاح العيون الحمراء",
    "Automatically correct red eye effects":
      "تصحيح تأثير العيون الحمراء تلقائياً",
    "Smart Crop": "القص الذكي",
    "AI-powered intelligent cropping": "قص ذكي بقوة الذكاء الاصطناعي",
    "Smart Photo Blending": "المزج الذكي للصور",
    "Seamlessly blend multiple photos": "مزج عدة صور بسلاسة",
    "Interactive Filters": "الفلاتر التفاعلية",
    "Real-time filters with AI animations": "فلاتر فورية مع رسوم متحركة ذكية",
    "3D Depth Effects": "تأثيرات العمق ثلاثية الأبعاد",
    "Generate depth maps for 3D effects":
      "توليد خرائط العمق للتأثيرات ثلاثية ا��أبعاد",
    "VIP Uncensored Suite": "مجموعة VIP بلا قيود",
    "Access to all uncensored AI transformations":
      "الوصول لجميع تحويلات الذكاء الاصطناعي بلا قيود",

    // Categories and UI (Arabic)
    "All Tools": "جميع الأدوات",
    "Face & Body": "الوجه والجسم",
    Fashion: "الأزياء",
    Style: "الأسلوب",
    Background: "الخلفية",
    Objects: "العناصر",
    Artistic: "فني",
    Enhancement: "التحسين",
    Creative: "إبداعي",
    "VIP Exclusive": "VIP حصري",
    "AI Tools Available": "أداة ذكاء اصطناعي متاحة",
    Category: "فئة",
    "Adult Content Warning": "تحذير محتوى للبالغين",
    "This tool contains adult content (18+). By proceeding, you acknowledge that you are of legal age and accept full responsibility for your use of this content.":
      "تحتوي هذه الأداة على محتوى لل��الغين (+18). بالمتابعة، تقر أنك في السن القانونية وتتحمل المسؤولية الكاملة عن استخدام هذا المحتوى.",
    "I Accept (18+)": "أوافق (+18)",

    // About Page New Sections (Arabic)
    "Freedom Without Limits - Local AI Image Editor":
      "حرية بلا حدود - محرر الصور بالذكاء الاصطناعي المحلي",
    "30+ Powerful AI Tools • Complete Privacy • No Censorship • Fully Local Processing":
      "30+ أداة ذكاء اصطناعي قوية • خصوصية كاملة • بلا رقابة • معالجة محلية كاملة",
    "30 AI Tools": "30 أداة ذكاء اصطناعي",
    "AI Models": "نماذج الذكاء الاصطناعي",
    "Privacy & Freedom": "الخصوصية والحرية",
    "Technical Details": "التفاصيل التقنية",
    'Our Vision: "Freedom Without Limits with KnouxAI"':
      'رؤيتنا: "حرية بلا حدود مع KnouxAI"',
    "Our vision is to build an AI image editor that surpasses any existing solutions by providing tremendous image processing power, but most importantly, ensuring absolute privacy and complete freedom.":
      "رؤيتنا هي بناء محرر صور بالذكاء الاصطناعي يتفوق على أي حلول موجودة من خلال توفير قوة هائلة لمعالجة الصور، لكن الأهم، ضمان خصوصية مطلقة وحرية كاملة.",
    "Users won't need any internet connection or external subscriptions - all operations happen on their device. This means every image they edit remains theirs alone, never leaves their device, and cannot be tracked or used in any way.":
      "لن يحتاج المستخدمون لأي اتصال إنترنت أو اشتراكات خارجية - جميع العمليات تتم على أجهزتهم. هذا يعني أن كل صورة يعدلونها تبقى ملكهم وحدهم، لا تغادر أجهزتهم أبداً، ولا يمكن تتبعها أو استخدامها بأي شكل.",
    "We integrate the most powerful open-source AI models to work locally, with a modern and attractive user interface supporting both Arabic and English.":
      "ندمج أقوى نماذج الذكاء الاصطناعي مفتوحة المصدر للعمل محلياً، مع واجهة مستخدم عصرية وجذابة تدعم العربية والإنجليزية.",
    "Core Principles": "المبادئ الأساسية",
    "100% Local Processing": "معالجة محلية 100%",
    "No internet, no external APIs. Every tool, every AI model, every operation happens exclusively on the user's device.":
      "لا إنترنت، لا APIs خارجية. كل أداة، كل نموذج ذكاء اصطناعي، كل عملية تحدث حصرياً على جهاز المستخدم.",
    "100% Complete Privacy": "خصوصية كاملة 100%",
    "No images or data are uploaded to any external server, ensuring absolute security and privacy of user images.":
      "لا يتم رفع أي صور أو بيانات لأي خادم خارجي، مما يضمن الأمان والخصوصية المطلقة لصور المستخدم.",
    "Speed & Performance": "السرعة والأداء",
    "Optimized to leverage local CPU and GPU resources for maximum performance and smooth editing experience.":
      "محسن للاستفادة من موارد المعالج ووحدة الرسومات المحلية للحصول على أقصى أداء وتجربة تحرير سلسة.",
    "No Restrictions or Censorship": "لا قيود أو رقابة",
    "Complete freedom to use all tools without limitations, including adult content tools (with user responsibility).":
      "حرية كاملة لاستخدام جميع الأدوات بلا قيود، بما في ذلك أدوات المحتوى للبالغين (مع مسؤولية المستخدم).",
    "Created by Sadek Elgazar (KNOUX)": "أنشأه صادق الجزار (KNOUX)",
    "30 Supercharged AI Tools": "30 أداة ذكاء اصطناعي خارقة",
    "Each tool leverages the most powerful open-source AI models for unprecedented image transformation capabilities":
      "كل أداة تستفيد من أقوى نماذج الذكاء الاصطناعي مفتوحة المصدر لقدرات تحويل صور لا مثيل لها",
    "Face & Body Transformation": "تحويل الوجه والجسم",
    "Fashion & Style": "الأزياء والأسلوب",
    "Background & Environment": "الخلفية والبيئة",
    "Object Manipulation": "معالجة العناصر",
    "Artistic & Creative": "فني وإبداعي",
    "Enhancement & Quality": "التحس��ن والجودة",
    "VIP Exclusive Tools": "أدوات VIP حصرية",
    "Sequential AI commands with unlimited complexity - exclusive to Sadek Elgazar":
      "أوامر ذكاء اصطناعي متسلسلة بتعقيد لامحدود - حصرية لصادق الجزار",
    "Access to all uncensored AI transformations with full creative freedom":
      "وصول لجميع تحويلات الذكاء الاصطناعي بلا قيود مع حرية إبداعية كاملة",
    "Integrated AI Models": "نماذج الذكاء الاصطناعي المدمجة",
    "We integrate only the most powerful open-source AI models, all running locally on your device":
      "ندمج فقط أقوى نماذج الذكاء الاصطناعي مفتوحة المصدر، جميعها تعمل محلياً على جهازك",
    "Your Digital Fortress": "قلعتك الرقمية",
    "Everything Works Offline": "كل شيء يعمل بدون إنترنت",
    "All AI models and their massive data weights are loaded on the user's device. No internet required for any functionality.":
      "جميع نماذج الذكاء الاصطناعي وأوزان بياناتها الضخمة محملة على جهاز المستخدم. لا حاجة للإنترنت لأي وظيفة.",
    "Complete User Control": "تحكم كامل للمستخدم",
    "Clear deletion options, optional encryption for work folders, and ability to permanently remove any files from your device.":
      "خيارات حذف واضحة، تشفير اختياري لمجلدات العمل، وقدرة على إزالة أي ملفات نهائياً من جهازك.",
    "Open Source Transparency": "شفافية مفتوحة المصدر",
    "All application code is open source and auditable. Complete transparency in how data is handled and privacy is protected.":
      "جميع أكواد التطبيق مفتوحة المصدر وقابلة للتدقيق. شفافية كاملة في كيفية التعامل مع البيانات وحماية الخصوصية.",
    "Unrestricted Freedom": "حرية بلا قيود",
    "No content filtering or censorship. Adult tools available with clear user responsibility warnings. Complete creative freedom.":
      "لا تصفية محتوى أو رقابة. أدوات للبالغين متاحة مع تحذيرات واضحة لمسؤولية المستخدم. حرية إبداعية كاملة.",
    "User Responsibility Notice": "إشعار مسؤولية المستخدم",
    "While we provide powerful uncensored tools, users bear complete responsibility for their usage. We include clear warnings for sensitive tools and remind users that using content for illegal or harmful purposes is their personal responsibility alone.":
      "بينما نوفر أدوات قوية بلا قيود، يتحمل المستخدمون المسؤولية الكاملة عن استخدامها. نتضمن تحذيرات واضحة للأدوات الحساسة ونذكر المستخدمين أن استخدام المحتوى لأغراض غير قانونية أو ضارة هو مسؤوليتهم الشخصية وحدهم.",
    "Technical Architecture": "البنية التقنية",
    Backend: "الخلفية",
    Frontend: "الواجهة الأمامية",
    "Performance Optimization": "تحسين الأداء",
    "GPU Acceleration": "تسريع وحدة الرسومات",
    "Full CUDA/ROCm support for NVIDIA and AMD GPUs. Massive performance boost for AI inference.":
      "دعم كامل لـ CUDA/ROCm لوحدات رسومات NVIDIA و AMD. تعزيز أداء هائل لاستنتاج الذكاء الاصطناعي.",
    "Model Optimization": "تحسين النماذج",
    "ONNX conversion, quantization (FP16/INT8), and TorchScript compilation for faster inference.":
      "تحويل ONNX، التكميم (FP16/INT8)، وتجميع TorchScript لاستنتاج أسرع.",
    "Memory Management": "إدارة الذاكرة",
    "Smart model caching, lazy loading, and efficient memory usage for smooth operation.":
      "تخزين النماذج الذكي، التحميل التدريجي، واستخدام فعال للذاكرة لتشغيل سلس.",
    "Distribution & Updates": "التوزيع والتحديثات",
    "Executable Packages": "حزم تنفيذية",
    "Single executable files for Windows, macOS, and Linux with all dependencies included.":
      "ملفات تنفيذية واحدة لـ Windows و macOS و Linux مع جميع التبعيات متضمنة.",
    "Model Management": "إدارة النماذج",
    "Built-in tools for downloading, updating, and managing AI model weights locally.":
      "أدوات مدمجة لتحميل وتحديث وإدارة أوزان نماذج الذكاء الاصطناعي محلياً.",
    "Open Source": "مفتوح المصدر",
    "Full source code available on GitHub for community contribution and transparency.":
      "الكود المصدري الكامل متاح على GitHub للمساهمة المجتمعية والشفافية.",
    "Experience the Power - Start Transforming": "اختبر القوة - ابدأ التحويل",
    "Where imagination meets artificial intelligence.":
      "حيث يلتقي الخيال بالذكاء الاصطناعي.",
    Capabilities: "القدرات",
    "Local Integration": "التكامل المحلي",
    Working: "يعمل",
    "8 Working AI Tools • Complete Privacy • No Censorship • Fully Local Processing":
      "8 أدوات ذكاء اصطناعي تعمل • خصوصية كاملة • بلا رقابة • معالجة محلية كاملة",
    "Working AI Tools": "أدوات الذكاء الاصطناعي العاملة",
    "8 Working AI Tools": "8 أدوات ذكاء اصطناعي تعمل",
    "Each tool is fully implemented and leverages powerful AI models for real image transformations":
      "كل أداة مُنفّذة بالكامل وتستفيد من نماذج ذكاء اصطناعي قوية لتحويلات صور حقيقية",
    "Core AI Features": "الميزات الأساسية للذكاء الاصطناعي",
    "Core Features": "الميزات الأساسية",
    "Image Editor": "محرر الصور",
    Circle: "دائرة",
    "Click to upload an image or drag and drop": "اضغط لرفع صورة أو اسحب وأفلت",
    "Supports JPG, PNG, GIF up to 10MB": "يدعم JPG, PNG, GIF حتى 10 ميجا",
    "Select a tool above and draw on the image to mark areas for AI transformation.":
      "اختر أداة من الأعلى وارسم على الصورة لتحديد المناطق للتحويل بالذكاء الاصطناعي.",
    "Selection active - ready for AI processing":
      "التحديد نشط - جاهز لمعالجة الذكاء الاصطناعي",
    "No area selected - AI will process the entire image":
      "لم يتم تحديد منطقة - سيعالج الذكاء الاصطناعي الصورة كاملة",
    "Failed to load image. Please try again.":
      "فشل تحميل الصورة. ي��جى المحاولة مرة أخرى.",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<"en" | "ar">("en");

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem("knoux-versa-language");
    if (savedLanguage === "ar" || savedLanguage === "en") {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    // Update document direction and save preference
    document.documentElement.dir = currentLanguage === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = currentLanguage;
    localStorage.setItem("knoux-versa-language", currentLanguage);
  }, [currentLanguage]);

  const toggleLanguage = () => {
    setCurrentLanguage((prev) => (prev === "en" ? "ar" : "en"));
  };

  const t = (key: string): string => {
    return translations[currentLanguage][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export { LanguageContext };
