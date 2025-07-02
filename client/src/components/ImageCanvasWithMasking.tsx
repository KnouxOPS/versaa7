import React, { useRef, useEffect, useState, useCallback } from "react";
import { BrushState, MaskData } from "@/shared/types";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface ImageCanvasWithMaskingProps {
  originalImage: string | null;
  editedImage: string | null;
  onImageUpload: (imageUrl: string) => void;
  onMaskChange: (maskData: MaskData | null) => void;
  showMaskingTools: boolean;
  isProcessing?: boolean;
  className?: string;
}

export const ImageCanvasWithMasking: React.FC<ImageCanvasWithMaskingProps> = ({
  originalImage,
  editedImage,
  onImageUpload,
  onMaskChange,
  showMaskingTools,
  isProcessing = false,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [brushState, setBrushState] = useState<BrushState>({
    isDrawing: false,
    brushSize: 20,
    brushOpacity: 0.8,
    brushHardness: 0.8,
    lastPoint: null,
  });

  const [viewMode, setViewMode] = useState<
    "original" | "edited" | "mask" | "overlay"
  >("original");
  const [imageScale, setImageScale] = useState(1);
  const [imageOffset, setImageOffset] = useState({ x: 0, y: 0 });
  const [canvasDimensions, setCanvasDimensions] = useState({
    width: 800,
    height: 600,
  });
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;

    if (canvas && maskCanvas) {
      const ctx = canvas.getContext("2d");
      const maskCtx = maskCanvas.getContext("2d");

      if (ctx && maskCtx) {
        // Set canvas dimensions
        canvas.width = canvasDimensions.width;
        canvas.height = canvasDimensions.height;
        maskCanvas.width = canvasDimensions.width;
        maskCanvas.height = canvasDimensions.height;

        // Clear canvases
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);

        // Draw background
        ctx.fillStyle = "#1a1a1a";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [canvasDimensions]);

  // Load and draw image
  useEffect(() => {
    if (!originalImage) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Calculate optimal scale and position
      const containerWidth = canvasDimensions.width;
      const containerHeight = canvasDimensions.height;

      const scaleX = (containerWidth * 0.9) / img.width;
      const scaleY = (containerHeight * 0.9) / img.height;
      const scale = Math.min(scaleX, scaleY);

      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;

      const offsetX = (containerWidth - scaledWidth) / 2;
      const offsetY = (containerHeight - scaledHeight) / 2;

      setImageScale(scale);
      setImageOffset({ x: offsetX, y: offsetY });
      setImageDimensions({ width: scaledWidth, height: scaledHeight });

      // Draw the image
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw the appropriate image based on view mode
      const imageToShow =
        viewMode === "edited" && editedImage ? editedImage : originalImage;
      const displayImg = new Image();
      displayImg.onload = () => {
        ctx.drawImage(displayImg, offsetX, offsetY, scaledWidth, scaledHeight);
      };
      displayImg.src = imageToShow;
    };

    img.src = originalImage;
  }, [originalImage, editedImage, viewMode, canvasDimensions]);

  // Handle file upload
  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          onImageUpload(result);
        };
        reader.readAsDataURL(file);
      }
    },
    [onImageUpload],
  );

  // Handle drag and drop
  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const files = Array.from(event.dataTransfer.files);
      const imageFile = files.find((file) => file.type.startsWith("image/"));

      if (imageFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          onImageUpload(result);
        };
        reader.readAsDataURL(imageFile);
      }
    },
    [onImageUpload],
  );

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
  }, []);

  // Mouse/touch drawing handlers
  const getPointFromEvent = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return null;

      const rect = canvas.getBoundingClientRect();
      let clientX, clientY;

      if ("touches" in event) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
      } else {
        clientX = event.clientX;
        clientY = event.clientY;
      }

      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    },
    [],
  );

  const drawBrushStroke = useCallback(
    (point: { x: number; y: number }) => {
      const maskCanvas = maskCanvasRef.current;
      if (!maskCanvas || !showMaskingTools) return;

      const ctx = maskCanvas.getContext("2d");
      if (!ctx) return;

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = `rgba(255, 255, 255, ${brushState.brushOpacity})`;
      ctx.beginPath();
      ctx.arc(point.x, point.y, brushState.brushSize / 2, 0, Math.PI * 2);
      ctx.fill();

      // Create a smooth line if there's a last point
      if (brushState.lastPoint) {
        ctx.lineWidth = brushState.brushSize;
        ctx.strokeStyle = `rgba(255, 255, 255, ${brushState.brushOpacity})`;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(brushState.lastPoint.x, brushState.lastPoint.y);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
      }
    },
    [brushState, showMaskingTools],
  );

  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      if (!showMaskingTools || !originalImage) return;

      const point = getPointFromEvent(event);
      if (!point) return;

      setBrushState((prev) => ({
        ...prev,
        isDrawing: true,
        lastPoint: point,
      }));

      drawBrushStroke(point);
    },
    [showMaskingTools, originalImage, getPointFromEvent, drawBrushStroke],
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (!showMaskingTools || !brushState.isDrawing) return;

      const point = getPointFromEvent(event);
      if (!point) return;

      drawBrushStroke(point);
      setBrushState((prev) => ({ ...prev, lastPoint: point }));
    },
    [
      showMaskingTools,
      brushState.isDrawing,
      getPointFromEvent,
      drawBrushStroke,
    ],
  );

  const handleMouseUp = useCallback(() => {
    if (!brushState.isDrawing) return;

    setBrushState((prev) => ({
      ...prev,
      isDrawing: false,
      lastPoint: null,
    }));

    // Generate mask data
    const maskCanvas = maskCanvasRef.current;
    if (maskCanvas) {
      const ctx = maskCanvas.getContext("2d");
      if (ctx) {
        const imageData = ctx.getImageData(
          0,
          0,
          maskCanvas.width,
          maskCanvas.height,
        );
        const base64 = maskCanvas.toDataURL("image/png");

        const maskData: MaskData = {
          imageData,
          canvas: maskCanvas,
          base64,
        };

        onMaskChange(maskData);
      }
    }
  }, [brushState.isDrawing, onMaskChange]);

  // Clear mask
  const clearMask = useCallback(() => {
    const maskCanvas = maskCanvasRef.current;
    if (maskCanvas) {
      const ctx = maskCanvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
        onMaskChange(null);
      }
    }
  }, [onMaskChange]);

  // Zoom and pan handlers
  const handleWheel = useCallback((event: React.WheelEvent) => {
    event.preventDefault();

    const zoomIntensity = 0.1;
    const wheel = event.deltaY < 0 ? 1 : -1;
    const zoom = Math.exp(wheel * zoomIntensity);

    setImageScale((prev) => Math.max(0.1, Math.min(5, prev * zoom)));
  }, []);

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Canvas Container */}
      <div
        ref={containerRef}
        className="relative flex-1 bg-gray-900 rounded-xl overflow-hidden border border-white/10"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {/* Main Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
          style={{
            cursor: showMaskingTools && originalImage ? "crosshair" : "default",
            filter: isProcessing ? "blur(2px)" : "none",
          }}
        />

        {/* Mask Canvas */}
        <canvas
          ref={maskCanvasRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: viewMode === "mask" ? 1 : viewMode === "overlay" ? 0.5 : 0,
            mixBlendMode: viewMode === "overlay" ? "multiply" : "normal",
          }}
        />

        {/* Upload Area */}
        {!originalImage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-8">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyan-400 to-purple-600 flex items-center justify-center">
                <i className="fas fa-cloud-upload-alt text-2xl text-white"></i>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Upload Image
              </h3>
              <p className="text-gray-400 mb-4">
                Drag and drop or click to select
              </p>
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
              >
                Choose File
              </Button>
            </div>
          </div>
        )}

        {/* Processing Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="animate-spin w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Processing...</p>
            </div>
          </div>
        )}

        {/* View Mode Controls */}
        {originalImage && (
          <div className="absolute top-4 left-4 flex gap-2">
            <Button
              size="sm"
              variant={viewMode === "original" ? "default" : "outline"}
              onClick={() => setViewMode("original")}
              className="text-xs"
            >
              Original
            </Button>
            {editedImage && (
              <Button
                size="sm"
                variant={viewMode === "edited" ? "default" : "outline"}
                onClick={() => setViewMode("edited")}
                className="text-xs"
              >
                Edited
              </Button>
            )}
            {showMaskingTools && (
              <>
                <Button
                  size="sm"
                  variant={viewMode === "mask" ? "default" : "outline"}
                  onClick={() => setViewMode("mask")}
                  className="text-xs"
                >
                  Mask
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === "overlay" ? "default" : "outline"}
                  onClick={() => setViewMode("overlay")}
                  className="text-xs"
                >
                  Overlay
                </Button>
              </>
            )}
          </div>
        )}

        {/* Image Info */}
        {originalImage && (
          <div className="absolute top-4 right-4">
            <Badge
              variant="outline"
              className="bg-black/50 text-white border-white/20"
            >
              {Math.round(imageDimensions.width)}×
              {Math.round(imageDimensions.height)}
            </Badge>
          </div>
        )}
      </div>

      {/* Brush Controls */}
      {showMaskingTools && originalImage && (
        <Card className="mt-4 p-4 bg-white/5 border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Brush Size */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Brush Size: {brushState.brushSize}px
              </label>
              <Slider
                value={[brushState.brushSize]}
                onValueChange={([value]) =>
                  setBrushState((prev) => ({ ...prev, brushSize: value }))
                }
                min={1}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            {/* Brush Opacity */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Opacity: {Math.round(brushState.brushOpacity * 100)}%
              </label>
              <Slider
                value={[brushState.brushOpacity]}
                onValueChange={([value]) =>
                  setBrushState((prev) => ({ ...prev, brushOpacity: value }))
                }
                min={0.1}
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Controls */}
            <div className="flex items-end gap-2">
              <Button
                onClick={clearMask}
                size="sm"
                variant="outline"
                className="border-red-400/30 text-red-400 hover:bg-red-400/10"
              >
                <i className="fas fa-eraser mr-2"></i>
                Clear Mask
              </Button>
              <Button
                onClick={() => fileInputRef.current?.click()}
                size="sm"
                variant="outline"
                className="border-blue-400/30 text-blue-400 hover:bg-blue-400/10"
              >
                <i className="fas fa-image mr-2"></i>
                New Image
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};
