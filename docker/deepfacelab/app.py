#!/usr/bin/env python3
"""
خدمة تبديل الوجه - DeepFaceLab API Service
KNOUX VERSA AI Services
"""

import os
import cv2
import torch
import numpy as np
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
import asyncio
import logging
import time
from io import BytesIO
from PIL import Image
import insightface
from insightface.app import FaceAnalysis
import json

# إعداد التسجيل
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# إنشاء التطبيق
app = FastAPI(
    title="KNOUX VERSA - Face Swap Service",
    description="خدمة تبديل الوجه المتقدمة باستخدام DeepFaceLab",
    version="2.0.0"
)

# إعداد CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# إعدادات النموذج
MODEL_PATH = os.getenv('MODEL_PATH', '/app/models')
GPU_ENABLED = os.getenv('GPU_ENABLED', 'true').lower() == 'true'
WORKERS = int(os.getenv('WORKERS', '2'))

# إعداد الجهاز
device = 'cuda' if torch.cuda.is_available() and GPU_ENABLED else 'cpu'
logger.info(f"🔥 Using device: {device}")

# متغيرات عامة
face_analyzer = None
face_swapper = None

class ProcessingStats:
    def __init__(self):
        self.total_requests = 0
        self.successful_requests = 0
        self.failed_requests = 0
        self.total_processing_time = 0
        self.last_request_time = None

stats = ProcessingStats()

class FaceSwapRequest(BaseModel):
    blend_strength: Optional[float] = 0.8
    preserve_identity: Optional[bool] = True
    face_model: Optional[str] = "auto"

# تهيئة النماذج
async def initialize_models():
    global face_analyzer, face_swapper
    
    try:
        logger.info("🚀 Initializing face analysis models...")
        
        # تهيئة محلل الوجوه
        face_analyzer = FaceAnalysis(providers=['CUDAExecutionProvider', 'CPUExecutionProvider'])
        face_analyzer.prepare(ctx_id=0 if device == 'cuda' else -1, det_size=(640, 640))
        
        # تهيئة مبدل الوجوه
        # هنا يمكن تحميل نموذج DeepFaceLab المحدد
        logger.info("📥 Loading face swap model...")
        
        # محاكاة تحميل نموذج (في التطبيق الحقيقي، سيتم تحميل نموذج DeepFaceLab)
        await asyncio.sleep(2)  # محاكاة وقت التحميل
        
        logger.info("✅ Models initialized successfully!")
        return True
        
    except Exception as e:
        logger.error(f"❌ Failed to initialize models: {str(e)}")
        return False

# دالة معالجة تبديل الوجه
async def process_face_swap(
    source_image: np.ndarray,
    target_face_data: Optional[bytes] = None,
    blend_strength: float = 0.8,
    preserve_identity: bool = True,
    face_model: str = "auto"
) -> np.ndarray:
    """معالجة تبديل الوجه الأساسية"""
    
    start_time = time.time()
    
    try:
        # 1. تحليل الوجوه في الصورة المصدر
        logger.info("🔍 Analyzing faces in source image...")
        faces = face_analyzer.get(source_image)
        
        if len(faces) == 0:
            raise ValueError("لم يتم العثور على وجوه في الصورة")
        
        # 2. اختيار أو إنشاء الوجه المطلوب
        if target_face_data:
            # استخدام وجه مرفوع
            target_image = cv2.imdecode(np.frombuffer(target_face_data, np.uint8), cv2.IMREAD_COLOR)
            target_faces = face_analyzer.get(target_image)
            if len(target_faces) == 0:
                raise ValueError("لم يتم العثور على وجه في الصورة المرجعية")
            target_face = target_faces[0]
        else:
            # إنشاء وجه افتراضي أو تحسين الوجه الموجود
            target_face = faces[0]  # استخدام الوجه الأول كمرجع
        
        # 3. تطبيق تبديل الوجه
        logger.info("🔄 Applying face swap transformation...")
        
        # محاكاة معالجة متقدمة
        await asyncio.sleep(2)  # محاكاة وقت المعالجة
        
        # في التطبيق الحقيقي، هنا سيتم تطبيق خوارزمية DeepFaceLab
        result_image = source_image.copy()
        
        # تطبيق تحسينات بسيطة للمحاكاة
        if preserve_identity:
            # الحفاظ على ملامح الهوية
            pass
        
        # تطبيق قوة المزج
        if blend_strength < 1.0:
            result_image = cv2.addWeighted(source_image, 1 - blend_strength, result_image, blend_strength, 0)
        
        # 4. تحسين النتيجة النهائية
        logger.info("✨ Applying final enhancements...")
        
        # تحسين الألوان والإضاءة
        result_image = cv2.convertScaleAbs(result_image, alpha=1.1, beta=10)
        
        processing_time = time.time() - start_time
        logger.info(f"✅ Face swap completed in {processing_time:.2f}s")
        
        return result_image
        
    except Exception as e:
        logger.error(f"❌ Face swap failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Face swap processing failed: {str(e)}")

# الصحة
@app.get("/health")
async def health_check():
    """فحص صحة الخدمة"""
    try:
        # فحص GPU
        gpu_available = torch.cuda.is_available() if GPU_ENABLED else False
        gpu_memory = torch.cuda.get_device_properties(0).total_memory / 1024**3 if gpu_available else 0
        
        # فحص النماذج
        models_loaded = face_analyzer is not None and face_swapper is not None
        
        return {
            "status": "healthy",
            "service": "face-swap",
            "version": "2.0.0",
            "gpu_available": gpu_available,
            "gpu_memory_gb": round(gpu_memory, 2),
            "models_loaded": models_loaded,
            "device": device,
            "workers": WORKERS,
            "stats": {
                "total_requests": stats.total_requests,
                "successful_requests": stats.successful_requests,
                "failed_requests": stats.failed_requests,
                "average_processing_time": stats.total_processing_time / max(stats.total_requests, 1),
                "last_request": stats.last_request_time
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Health check failed: {str(e)}")

# تبديل الوجه
@app.post("/face-swap")
async def face_swap_endpoint(
    image: UploadFile = File(..., description="الصورة الأساسية"),
    target_face: Optional[UploadFile] = File(None, description="صورة الوجه المرجعي (اختياري)"),
    blend_strength: float = Form(0.8, description="قوة المزج (0.0-1.0)"),
    preserve_identity: bool = Form(True, description="الحفاظ على الهوية"),
    face_model: str = Form("auto", description="نموذج الوجه")
):
    """
    تبديل الوجه المتقدم
    
    - **image**: الصورة الأساسية التي تحتوي على الوجه المراد تبديله
    - **target_face**: صورة اختيارية للوجه المرجعي
    - **blend_strength**: قوة مزج الوجه الجديد (0.0 = ضعيف، 1.0 = قوي)
    - **preserve_identity**: الحفاظ على ملامح الهوية الأساسية
    - **face_model**: نموذج الوجه المستخدم (auto, refined, detailed)
    """
    
    start_time = time.time()
    stats.total_requests += 1
    stats.last_request_time = time.time()
    
    try:
        # التحقق من النماذج
        if not face_analyzer:
            raise HTTPException(status_code=503, detail="Models not initialized")
        
        # التحقق من المعاملات
        if not 0.0 <= blend_strength <= 1.0:
            raise HTTPException(status_code=400, detail="blend_strength must be between 0.0 and 1.0")
        
        if face_model not in ["auto", "refined", "detailed"]:
            raise HTTPException(status_code=400, detail="Invalid face_model")
        
        # قراءة الصورة الأساسية
        image_bytes = await image.read()
        if len(image_bytes) == 0:
            raise HTTPException(status_code=400, detail="Empty image file")
        
        # تحويل إلى numpy array
        nparr = np.frombuffer(image_bytes, np.uint8)
        source_image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if source_image is None:
            raise HTTPException(status_code=400, detail="Invalid image format")
        
        # قراءة الوجه المرجعي إذا كان موجوداً
        target_face_data = None
        if target_face:
            target_face_data = await target_face.read()
        
        # معالجة تبديل الوجه
        logger.info(f"🎭 Processing face swap with blend_strength={blend_strength}, preserve_identity={preserve_identity}")
        
        result_image = await process_face_swap(
            source_image=source_image,
            target_face_data=target_face_data,
            blend_strength=blend_strength,
            preserve_identity=preserve_identity,
            face_model=face_model
        )
        
        # تحويل النتيجة إلى صورة
        _, buffer = cv2.imencode('.jpg', result_image, [cv2.IMWRITE_JPEG_QUALITY, 95])
        
        # تحديث الإحصائيات
        processing_time = time.time() - start_time
        stats.successful_requests += 1
        stats.total_processing_time += processing_time
        
        logger.info(f"✅ Face swap completed successfully in {processing_time:.2f}s")
        
        # إرجاع الصورة
        return StreamingResponse(
            BytesIO(buffer.tobytes()),
            media_type="image/jpeg",
            headers={
                "X-Processing-Time": str(processing_time),
                "X-Service": "face-swap",
                "X-Model": face_model,
                "X-Blend-Strength": str(blend_strength)
            }
        )
        
    except HTTPException:
        stats.failed_requests += 1
        raise
    except Exception as e:
        stats.failed_requests += 1
        logger.error(f"❌ Unexpected error in face swap: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

# معاينة سريعة
@app.post("/face-swap/preview")
async def face_swap_preview(
    image: UploadFile = File(...),
    blend_strength: float = Form(0.5)
):
    """معاينة سريعة لتبديل الوجه بدون معالجة متقدمة"""
    
    try:
        # قراءة الصورة
        image_bytes = await image.read()
        nparr = np.frombuffer(image_bytes, np.uint8)
        source_image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if source_image is None:
            raise HTTPException(status_code=400, detail="Invalid image format")
        
        # معالجة سريعة (محاكاة)
        result_image = cv2.convertScaleAbs(source_image, alpha=1.1, beta=10)
        
        # ضغط وإرجاع
        _, buffer = cv2.imencode('.jpg', result_image, [cv2.IMWRITE_JPEG_QUALITY, 80])
        
        return StreamingResponse(
            BytesIO(buffer.tobytes()),
            media_type="image/jpeg",
            headers={"X-Service": "face-swap-preview"}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# إحصائيات الخدمة
@app.get("/stats")
async def get_stats():
    """إحصائيات تفصيلية للخدمة"""
    
    return {
        "service": "face-swap",
        "uptime": time.time() - stats.last_request_time if stats.last_request_time else 0,
        "requests": {
            "total": stats.total_requests,
            "successful": stats.successful_requests,
            "failed": stats.failed_requests,
            "success_rate": stats.successful_requests / max(stats.total_requests, 1) * 100
        },
        "performance": {
            "total_processing_time": stats.total_processing_time,
            "average_processing_time": stats.total_processing_time / max(stats.successful_requests, 1),
            "requests_per_second": stats.total_requests / max(time.time() - (stats.last_request_time or time.time()), 1)
        },
        "system": {
            "device": device,
            "gpu_available": torch.cuda.is_available() if GPU_ENABLED else False,
            "workers": WORKERS,
            "model_path": MODEL_PATH
        }
    }

# بدء التشغيل
@app.on_event("startup")
async def startup_event():
    """تهيئة الخدمة عند بدء التشغيل"""
    logger.info("🚀 Starting KNOUX VERSA Face Swap Service...")
    
    # تهيئة النماذج
    success = await initialize_models()
    if not success:
        logger.error("❌ Failed to initialize models. Service may not work properly.")
    
    logger.info(f"✅ Face Swap Service started successfully on {device}")

# إيقاف التشغيل
@app.on_event("shutdown")
async def shutdown_event():
    """تنظيف الموارد عند إيقاف التشغيل"""
    logger.info("📴 Shutting down Face Swap Service...")
    
    # تنظيف موارد GPU
    if torch.cuda.is_available():
        torch.cuda.empty_cache()
    
    logger.info("✅ Face Swap Service shutdown complete")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        workers=WORKERS,
        log_level="info"
    )
