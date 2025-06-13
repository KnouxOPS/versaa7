# Dockerfile لخدمة تبديل الوجه - DeepFaceLab
FROM nvidia/cuda:11.8-devel-ubuntu20.04

# إعداد المتغيرات
ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1
ENV CUDA_VISIBLE_DEVICES=0

# تثبيت النظام الأساسي
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-dev \
    git \
    wget \
    curl \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    libgoogle-perftools4 \
    libtcmalloc-minimal4 \
    && rm -rf /var/lib/apt/lists/*

# إعداد Python
RUN python3 -m pip install --upgrade pip setuptools wheel

# تثبيت PyTorch مع CUDA
RUN pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118

# تثبيت مكتبات الذكاء الاصطناعي
RUN pip3 install \
    opencv-python \
    numpy \
    pillow \
    scikit-image \
    scipy \
    matplotlib \
    tqdm \
    tensorboard \
    onnx \
    onnxruntime-gpu \
    insightface \
    facexlib \
    realesrgan

# تثبيت FastAPI للخدمة
RUN pip3 install \
    fastapi \
    uvicorn \
    python-multipart \
    pydantic \
    aiofiles

# تثبيت DeepFaceLab
WORKDIR /app
RUN git clone https://github.com/iperov/DeepFaceLab.git deepfacelab
WORKDIR /app/deepfacelab

# نسخ ملفات التطبيق
COPY app.py /app/
COPY requirements.txt /app/
COPY models/ /app/models/

# إعداد المجلدات
RUN mkdir -p /app/temp /app/workspace

# تعيين الملكية والصلاحيات
RUN chmod +x /app/app.py

# بورت الخدمة
EXPOSE 8000

# الصحة
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# تشغيل الخدمة
WORKDIR /app
CMD ["python3", "-m", "uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
