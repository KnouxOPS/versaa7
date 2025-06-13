const { parentPort, workerData } = require("worker_threads");
const { spawn } = require("child_process");
const fs = require("fs").promises;
const path = require("path");
const { performance } = require("perf_hooks");

// معلومات Worker
const { serviceId, config, workerId } = workerData;

console.log(`🚀 Worker ${workerId} لخدمة ${serviceId} جاهز`);

// حالة Worker
let isProcessing = false;
let modelLoaded = false;
let dockerContainer = null;

// تحميل النموذج أو تشغيل Container
async function initializeService() {
  try {
    console.log(`📥 تهيئة خدمة ${config.name}...`);

    if (config.dockerImage) {
      // تشغيل Docker Container
      await startDockerContainer();
    } else {
      // تحميل النموذج محلياً
      await loadLocalModel();
    }

    modelLoaded = true;
    console.log(`✅ تم تهيئة خدمة ${config.name} بنجاح`);
  } catch (error) {
    console.error(`❌ فشل في تهيئة خدمة ${serviceId}:`, error);
    process.exit(1);
  }
}

// تشغيل Docker Container
async function startDockerContainer() {
  return new Promise((resolve, reject) => {
    const dockerCmd = [
      "run",
      "-d",
      "--name",
      `${serviceId}-worker-${workerId}`,
      "--rm",
      "--memory",
      config.memoryLimit,
      config.gpuRequired ? "--gpus all" : "",
      "-p",
      `${8000 + parseInt(workerId)}:8000`,
      config.dockerImage,
    ].filter((arg) => arg !== "");

    const docker = spawn("docker", dockerCmd);

    docker.on("close", (code) => {
      if (code === 0) {
        dockerContainer = `${serviceId}-worker-${workerId}`;
        console.log(`🐳 Docker Container ${dockerContainer} جاهز`);
        resolve();
      } else {
        reject(new Error(`Docker Container فشل: exit code ${code}`));
      }
    });

    docker.stderr.on("data", (data) => {
      console.error(`Docker stderr: ${data}`);
    });
  });
}

// تح��يل النموذج محلياً
async function loadLocalModel() {
  // محاكاة تحميل النموذج
  console.log(`📥 تحميل نموذج ${config.model}...`);

  // في التطبيق الحقيقي، سيتم تحميل النموذج من ملف
  await new Promise((resolve) => setTimeout(resolve, 2000));

  console.log(`✅ تم تحميل نموذج ${config.model}`);
}

// معالجة الطلب
async function processRequest(request) {
  if (isProcessing) {
    throw new Error("Worker مشغول بطلب آخر");
  }

  isProcessing = true;
  const startTime = performance.now();

  try {
    console.log(`🔄 بدء معالجة ${request.id} بواسطة Worker ${workerId}`);

    // تحضير البيانات
    const imageBuffer = Buffer.from(request.imageData);
    const tempImagePath = path.join(
      __dirname,
      "../../temp",
      `${request.id}_input.jpg`,
    );
    const outputImagePath = path.join(
      __dirname,
      "../../temp",
      `${request.id}_output.jpg`,
    );

    // إنشاء مجلد temp إذا لم يكن موجوداً
    await fs.mkdir(path.dirname(tempImagePath), { recursive: true });

    // حفظ الصورة المدخلة
    await fs.writeFile(tempImagePath, imageBuffer);

    let processedImageBuffer;

    // معالجة حسب نوع الخدمة
    switch (serviceId) {
      case "face_swap":
        processedImageBuffer = await processFaceSwap(
          tempImagePath,
          outputImagePath,
          request.settings,
        );
        break;
      case "beauty_filter":
        processedImageBuffer = await processBeautyFilter(
          tempImagePath,
          outputImagePath,
          request.settings,
        );
        break;
      case "face_expression":
        processedImageBuffer = await processFaceExpression(
          tempImagePath,
          outputImagePath,
          request.settings,
        );
        break;
      case "age_transform":
        processedImageBuffer = await processAgeTransform(
          tempImagePath,
          outputImagePath,
          request.settings,
        );
        break;
      case "gender_swap":
        processedImageBuffer = await processGenderSwap(
          tempImagePath,
          outputImagePath,
          request.settings,
        );
        break;
      case "makeup_artist":
        processedImageBuffer = await processMakeupArtist(
          tempImagePath,
          outputImagePath,
          request.settings,
        );
        break;
      case "body_reshape":
        processedImageBuffer = await processBodyReshape(
          tempImagePath,
          outputImagePath,
          request.settings,
        );
        break;
      case "clothing_swap":
        processedImageBuffer = await processClothingSwap(
          tempImagePath,
          outputImagePath,
          request.settings,
        );
        break;
      case "tattoo_artist":
        processedImageBuffer = await processTattooArtist(
          tempImagePath,
          outputImagePath,
          request.settings,
        );
        break;
      case "muscle_enhancer":
        processedImageBuffer = await processMuscleEnhancer(
          tempImagePath,
          outputImagePath,
          request.settings,
        );
        break;
      case "bg_remover":
        processedImageBuffer = await processBackgroundRemover(
          tempImagePath,
          outputImagePath,
          request.settings,
        );
        break;
      case "bg_replacer":
        processedImageBuffer = await processBackgroundReplacer(
          tempImagePath,
          outputImagePath,
          request.settings,
        );
        break;
      case "lighting_master":
        processedImageBuffer = await processLightingMaster(
          tempImagePath,
          outputImagePath,
          request.settings,
        );
        break;
      case "style_transfer":
        processedImageBuffer = await processStyleTransfer(
          tempImagePath,
          outputImagePath,
          request.settings,
        );
        break;
      case "cartoonizer":
        processedImageBuffer = await processCartoonizer(
          tempImagePath,
          outputImagePath,
          request.settings,
        );
        break;
      case "colorizer":
        processedImageBuffer = await processColorizer(
          tempImagePath,
          outputImagePath,
          request.settings,
        );
        break;
      case "super_resolution":
        processedImageBuffer = await processSuperResolution(
          tempImagePath,
          outputImagePath,
          request.settings,
        );
        break;
      case "denoiser":
        processedImageBuffer = await processDenoiser(
          tempImagePath,
          outputImagePath,
          request.settings,
        );
        break;
      case "sharpener":
        processedImageBuffer = await processSharpener(
          tempImagePath,
          outputImagePath,
          request.settings,
        );
        break;
      case "object_remover":
        processedImageBuffer = await processObjectRemover(
          tempImagePath,
          outputImagePath,
          request.settings,
        );
        break;
      case "pose_editor":
        processedImageBuffer = await processPoseEditor(
          tempImagePath,
          outputImagePath,
          request.settings,
        );
        break;
      case "vip_magic_morph":
        processedImageBuffer = await processVIPMagicMorph(
          tempImagePath,
          outputImagePath,
          request.settings,
        );
        break;
      default:
        throw new Error(`خدمة غير مدعومة: ${serviceId}`);
    }

    const processingTime = performance.now() - startTime;

    // تنظيف الملفات المؤقتة
    await fs.unlink(tempImagePath).catch(() => {});
    await fs.unlink(outputImagePath).catch(() => {});

    console.log(
      `✅ تمت معالجة ${request.id} في ${processingTime.toFixed(2)}ms`,
    );

    return {
      id: request.id,
      success: true,
      processedImage: processedImageBuffer,
      processingTime,
      metadata: {
        model: config.model,
        settings: request.settings,
        cacheHit: false,
        queueTime: request.queueTime,
        processingTime,
        workerId,
      },
    };
  } catch (error) {
    console.error(`❌ خطأ في معالجة ${request.id}:`, error);

    return {
      id: request.id,
      success: false,
      error: error.message,
      processingTime: performance.now() - startTime,
      metadata: {
        model: config.model,
        settings: request.settings,
        workerId,
      },
    };
  } finally {
    isProcessing = false;
  }
}

// دوال المعالجة المختصة

// معالجة تبديل الوجه
async function processFaceSwap(inputPath, outputPath, settings) {
  console.log("🔄 معالجة تبديل الوجه...");

  if (dockerContainer) {
    // استخدام Docker Container
    return await callDockerService("/face-swap", {
      image_path: inputPath,
      target_face: settings.targetFace,
      blend_strength: settings.blendStrength || 0.8,
    });
  } else {
    // معالجة محلية (محاكاة)
    await simulateProcessing(3000, 15000);
    return await fs.readFile(inputPath); // محاكاة
  }
}

// معالجة فلتر الجمال
async function processBeautyFilter(inputPath, outputPath, settings) {
  console.log("🔄 معالجة فلتر الجمال...");

  await simulateProcessing(2000, 8000);

  if (dockerContainer) {
    return await callDockerService("/beauty-filter", {
      image_path: inputPath,
      skin_smoothing: settings.skinSmoothing || 70,
      eye_enhancement: settings.eyeEnhancement || 20,
      jawline_define: settings.jawlineDefine || 30,
    });
  }

  return await fs.readFile(inputPath);
}

// معالجة تغيير التعبيرات
async function processFaceExpression(inputPath, outputPath, settings) {
  console.log("🔄 معالجة تغيير التعبيرات...");

  await simulateProcessing(1500, 6000);

  if (dockerContainer) {
    return await callDockerService("/expression-change", {
      image_path: inputPath,
      expression: settings.expression || "smile",
      intensity: settings.intensity || 0.8,
    });
  }

  return await fs.readFile(inputPath);
}

// معالجة تحويل العمر
async function processAgeTransform(inputPath, outputPath, settings) {
  console.log("🔄 معالجة تحويل العمر...");

  await simulateProcessing(4000, 12000);

  if (dockerContainer) {
    return await callDockerService("/age-transform", {
      image_path: inputPath,
      age_direction: settings.ageDirection || "younger",
      age_amount: settings.ageAmount || 10,
    });
  }

  return await fs.readFile(inputPath);
}

// معالجة تحويل الجنس
async function processGenderSwap(inputPath, outputPath, settings) {
  console.log("🔄 معالجة تحويل الجنس...");

  await simulateProcessing(6000, 18000);

  if (dockerContainer) {
    return await callDockerService("/gender-swap", {
      image_path: inputPath,
      target_gender: settings.targetGender || "female",
      preserve_identity: settings.preserveIdentity || true,
    });
  }

  return await fs.readFile(inputPath);
}

// معالجة المكياج
async function processMakeupArtist(inputPath, outputPath, settings) {
  console.log("🔄 معالجة المكياج...");

  await simulateProcessing(2000, 7000);

  if (dockerContainer) {
    return await callDockerService("/makeup-artist", {
      image_path: inputPath,
      makeup_style: settings.makeupStyle || "natural",
      intensity: settings.intensity || 0.7,
    });
  }

  return await fs.readFile(inputPath);
}

// معالجة نحت الجسم
async function processBodyReshape(inputPath, outputPath, settings) {
  console.log("🔄 معالجة نحت الجسم...");

  await simulateProcessing(8000, 25000);

  if (dockerContainer) {
    return await callDockerService("/body-reshape", {
      image_path: inputPath,
      waist_scale: settings.waistScale || 1.0,
      hip_scale: settings.hipScale || 1.0,
      chest_scale: settings.chestScale || 1.0,
    });
  }

  return await fs.readFile(inputPath);
}

// معالجة تغيير الملابس
async function processClothingSwap(inputPath, outputPath, settings) {
  console.log("🔄 معالجة تغيير الملابس...");

  await simulateProcessing(6000, 20000);

  if (dockerContainer) {
    return await callDockerService("/clothing-swap", {
      image_path: inputPath,
      clothing_type: settings.clothingType || "casual",
      color: settings.color || "blue",
    });
  }

  return await fs.readFile(inputPath);
}

// معالجة الوشم
async function processTattooArtist(inputPath, outputPath, settings) {
  console.log("🔄 معالجة الوشم...");

  await simulateProcessing(3000, 10000);

  if (dockerContainer) {
    return await callDockerService("/tattoo-artist", {
      image_path: inputPath,
      tattoo_design: settings.tattooDesign || "tribal",
      position: settings.position || "arm",
    });
  }

  return await fs.readFile(inputPath);
}

// ��عالجة تقوية العضلات
async function processMuscleEnhancer(inputPath, outputPath, settings) {
  console.log("🔄 معالجة تقوية العضلات...");

  await simulateProcessing(4000, 15000);

  if (dockerContainer) {
    return await callDockerService("/muscle-enhancer", {
      image_path: inputPath,
      muscle_groups: settings.muscleGroups || ["biceps", "abs"],
      enhancement_level: settings.enhancementLevel || 0.5,
    });
  }

  return await fs.readFile(inputPath);
}

// معالجة إزالة الخلفية
async function processBackgroundRemover(inputPath, outputPath, settings) {
  console.log("🔄 معالجة إزالة الخلفية...");

  await simulateProcessing(1000, 3000);

  if (dockerContainer) {
    return await callDockerService("/bg-remover", {
      image_path: inputPath,
      edge_smoothing: settings.edgeSmoothing || 0.8,
    });
  }

  return await fs.readFile(inputPath);
}

// معالجة استبدال الخلفية
async function processBackgroundReplacer(inputPath, outputPath, settings) {
  console.log("🔄 معالجة استبدال الخلفية...");

  await simulateProcessing(4000, 12000);

  if (dockerContainer) {
    return await callDockerService("/bg-replacer", {
      image_path: inputPath,
      background_type: settings.backgroundType || "nature",
      prompt: settings.prompt || "beautiful landscape",
    });
  }

  return await fs.readFile(inputPath);
}

// معا��جة الإضاءة
async function processLightingMaster(inputPath, outputPath, settings) {
  console.log("🔄 معالجة الإضاءة...");

  await simulateProcessing(2500, 8000);

  if (dockerContainer) {
    return await callDockerService("/lighting-master", {
      image_path: inputPath,
      lighting_type: settings.lightingType || "natural",
      intensity: settings.intensity || 0.7,
    });
  }

  return await fs.readFile(inputPath);
}

// معالجة نقل الأسلوب
async function processStyleTransfer(inputPath, outputPath, settings) {
  console.log("🔄 معالجة نقل الأسلوب...");

  await simulateProcessing(5000, 15000);

  if (dockerContainer) {
    return await callDockerService("/style-transfer", {
      image_path: inputPath,
      style: settings.style || "anime",
      strength: settings.strength || 0.8,
    });
  }

  return await fs.readFile(inputPath);
}

// معالجة الكرتون
async function processCartoonizer(inputPath, outputPath, settings) {
  console.log("🔄 معالجة الكرتون...");

  await simulateProcessing(3500, 10000);

  if (dockerContainer) {
    return await callDockerService("/cartoonizer", {
      image_path: inputPath,
      cartoon_style: settings.cartoonStyle || "disney",
    });
  }

  return await fs.readFile(inputPath);
}

// معالجة التلوين
async function processColorizer(inputPath, outputPath, settings) {
  console.log("🔄 معالجة التلوين...");

  await simulateProcessing(3000, 9000);

  if (dockerContainer) {
    return await callDockerService("/colorizer", {
      image_path: inputPath,
      color_intensity: settings.colorIntensity || 0.8,
    });
  }

  return await fs.readFile(inputPath);
}

// معالجة الدقة الفائقة
async function processSuperResolution(inputPath, outputPath, settings) {
  console.log("🔄 معالجة الدقة الفائقة...");

  await simulateProcessing(2500, 8000);

  if (dockerContainer) {
    return await callDockerService("/super-resolution", {
      image_path: inputPath,
      scale_factor: settings.scaleFactor || 4,
    });
  }

  return await fs.readFile(inputPath);
}

// معالجة إزالة الضوضاء
async function processDenoiser(inputPath, outputPath, settings) {
  console.log("🔄 معالجة إزالة الضوضاء...");

  await simulateProcessing(1500, 5000);

  if (dockerContainer) {
    return await callDockerService("/denoiser", {
      image_path: inputPath,
      noise_level: settings.noiseLevel || 0.5,
    });
  }

  return await fs.readFile(inputPath);
}

// معالجة تحسين الحدة
async function processSharpener(inputPath, outputPath, settings) {
  console.log("🔄 معالجة تحسين الحدة...");

  await simulateProcessing(1000, 3000);

  if (dockerContainer) {
    return await callDockerService("/sharpener", {
      image_path: inputPath,
      sharpness_level: settings.sharpnessLevel || 0.7,
    });
  }

  return await fs.readFile(inputPath);
}

// معالجة إزالة العناصر
async function processObjectRemover(inputPath, outputPath, settings) {
  console.log("🔄 معالجة إزالة العناصر...");

  await simulateProcessing(4000, 12000);

  if (dockerContainer) {
    return await callDockerService("/object-remover", {
      image_path: inputPath,
      mask_data: settings.maskData,
    });
  }

  return await fs.readFile(inputPath);
}

// معالجة تعديل الوضعيات
async function processPoseEditor(inputPath, outputPath, settings) {
  console.log("🔄 معالجة تعديل الوضعيات...");

  await simulateProcessing(10000, 30000);

  if (dockerContainer) {
    return await callDockerService("/pose-editor", {
      image_path: inputPath,
      pose_type: settings.poseType || "standing",
      pose_data: settings.poseData,
    });
  }

  return await fs.readFile(inputPath);
}

// معالجة VIP Magic Morph
async function processVIPMagicMorph(inputPath, outputPath, settings) {
  console.log("🔄 معالجة VIP Magic Morph...");

  await simulateProcessing(15000, 45000);

  if (dockerContainer) {
    return await callDockerService("/vip-magic-morph", {
      image_path: inputPath,
      prompt: settings.prompt,
      strength: settings.strength || 0.9,
      steps: settings.steps || 50,
    });
  }

  return await fs.readFile(inputPath);
}

// استدعاء خدمة Docker
async function callDockerService(endpoint, data) {
  const fetch = require("node-fetch");
  const FormData = require("form-data");

  const form = new FormData();
  form.append("image", fs.createReadStream(data.image_path));

  Object.keys(data).forEach((key) => {
    if (key !== "image_path") {
      form.append(key, JSON.stringify(data[key]));
    }
  });

  const response = await fetch(
    `http://localhost:${8000 + parseInt(workerId)}${endpoint}`,
    {
      method: "POST",
      body: form,
    },
  );

  if (!response.ok) {
    throw new Error(`Docker service error: ${response.statusText}`);
  }

  return await response.buffer();
}

// محاكاة المعالجة
async function simulateProcessing(minTime, maxTime) {
  const processingTime = Math.random() * (maxTime - minTime) + minTime;
  await new Promise((resolve) => setTimeout(resolve, processingTime));
}

// معالجة الرسائل من Main Thread
parentPort.on("message", async (message) => {
  if (message.type === "process") {
    if (!modelLoaded) {
      await initializeService();
    }

    try {
      const result = await processRequest(message.request);
      parentPort.postMessage(result);
    } catch (error) {
      parentPort.postMessage({
        id: message.request.id,
        success: false,
        error: error.message,
        processingTime: 0,
      });
    }
  }
});

// تنظيف عند الإغلاق
process.on("exit", async () => {
  if (dockerContainer) {
    console.log(`🧹 إيقاف Docker Container ${dockerContainer}...`);
    spawn("docker", ["stop", dockerContainer]);
  }
});
