import { useRef, useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Upload,
  Square,
  Circle,
  Edit3,
  Trash2,
  MousePointer,
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface SimpleImageCanvasProps {
  onImageUpload: (imageUrl: string) => void;
  onSelectionChange: (selectionData: string) => void;
  uploadedImage: string | null;
}

interface SelectionData {
  type: "rectangle" | "circle" | "freehand";
  coordinates: any;
  bounds: { x: number; y: number; width: number; height: number };
  canvasWidth: number;
  canvasHeight: number;
}

export function SimpleImageCanvas({
  onImageUpload,
  onSelectionChange,
  uploadedImage,
}: SimpleImageCanvasProps) {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectionTool, setSelectionTool] = useState<
    "rectangle" | "circle" | "freehand"
  >("rectangle");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [currentSelection, setCurrentSelection] =
    useState<SelectionData | null>(null);
  const [freehandPath, setFreehandPath] = useState<{ x: number; y: number }[]>(
    [],
  );
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert(t("Please upload a valid image file."));
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert(t("File size must be less than 10MB."));
      return;
    }

    setIsUploading(true);

    try {
      // For local processing, always use FileReader to load image immediately
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageUrl = e.target?.result as string;
        onImageUpload(imageUrl);
        await loadImageToCanvas(imageUrl);
        setIsUploading(false);
      };
      reader.onerror = () => {
        console.error("Failed to read file");
        alert(t("Failed to load image. Please try again."));
        setIsUploading(false);
      };
      reader.readAsDataURL(file);

      // Optional: Also try to upload to server for backup/history
      try {
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          console.log("Image also saved to server:", result.imageUrl);
        }
      } catch (serverError) {
        console.log(
          "Server upload failed (continuing with local processing):",
          serverError,
        );
      }
    } catch (error) {
      console.error("File processing failed:", error);
      alert(t("Failed to process image. Please try again."));
      setIsUploading(false);
    }
  };

  const loadImageToCanvas = (imageUrl: string) => {
    const canvas = canvasRef.current;
    const overlayCanvas = overlayCanvasRef.current;
    if (!canvas || !overlayCanvas) return;

    const ctx = canvas.getContext("2d");
    const overlayCtx = overlayCanvas.getContext("2d");
    if (!ctx || !overlayCtx) return;

    const img = new Image();
    img.onload = () => {
      // Set canvas size to fit container
      const containerWidth = 800;
      const containerHeight = 600;
      const scale = Math.min(
        containerWidth / img.width,
        containerHeight / img.height,
      );

      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      overlayCanvas.width = canvas.width;
      overlayCanvas.height = canvas.height;

      // Set CSS size to match canvas
      canvas.style.width = `${canvas.width}px`;
      canvas.style.height = `${canvas.height}px`;
      overlayCanvas.style.width = `${canvas.width}px`;
      overlayCanvas.style.height = `${canvas.height}px`;

      // Draw image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      setImageLoaded(true);

      // Clear any previous selection
      overlayCtx.clearRect(0, 0, canvas.width, canvas.height);
    };

    img.onerror = () => {
      console.error("Failed to load image");
      alert(t("Failed to load image. Please try again."));
    };

    img.src = imageUrl;
  };

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = overlayCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!imageLoaded) return;

    const pos = getMousePos(e);
    setIsDrawing(true);
    setStartPoint(pos);

    if (selectionTool === "freehand") {
      setFreehandPath([pos]);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPoint || !overlayCanvasRef.current) return;

    const canvas = overlayCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pos = getMousePos(e);

    // Clear overlay
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set drawing style
    ctx.strokeStyle = "#00FFFF";
    ctx.lineWidth = 3;
    ctx.fillStyle = "rgba(0, 255, 255, 0.2)";
    ctx.setLineDash([]);
    ctx.shadowColor = "#00FFFF";
    ctx.shadowBlur = 5;

    if (selectionTool === "rectangle") {
      const width = pos.x - startPoint.x;
      const height = pos.y - startPoint.y;

      ctx.fillRect(startPoint.x, startPoint.y, width, height);
      ctx.strokeRect(startPoint.x, startPoint.y, width, height);
    } else if (selectionTool === "circle") {
      const radius = Math.sqrt(
        Math.pow(pos.x - startPoint.x, 2) + Math.pow(pos.y - startPoint.y, 2),
      );

      ctx.beginPath();
      ctx.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    } else if (selectionTool === "freehand") {
      const newPath = [...freehandPath, pos];
      setFreehandPath(newPath);

      if (newPath.length > 1) {
        ctx.beginPath();
        ctx.moveTo(newPath[0].x, newPath[0].y);
        newPath.forEach((point) => {
          ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();
      }
    }
  };

  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPoint) return;

    const pos = getMousePos(e);
    setIsDrawing(false);

    let selectionData: SelectionData;
    const canvas = overlayCanvasRef.current;

    if (selectionTool === "rectangle") {
      const width = Math.abs(pos.x - startPoint.x);
      const height = Math.abs(pos.y - startPoint.y);
      const x = Math.min(pos.x, startPoint.x);
      const y = Math.min(pos.y, startPoint.y);

      selectionData = {
        type: "rectangle",
        coordinates: { x, y, width, height },
        bounds: { x, y, width, height },
        canvasWidth: canvas?.width || 800,
        canvasHeight: canvas?.height || 600,
      };
    } else if (selectionTool === "circle") {
      const radius = Math.sqrt(
        Math.pow(pos.x - startPoint.x, 2) + Math.pow(pos.y - startPoint.y, 2),
      );

      selectionData = {
        type: "circle",
        coordinates: { centerX: startPoint.x, centerY: startPoint.y, radius },
        bounds: {
          x: startPoint.x - radius,
          y: startPoint.y - radius,
          width: radius * 2,
          height: radius * 2,
        },
        canvasWidth: canvas?.width || 800,
        canvasHeight: canvas?.height || 600,
      };
    } else {
      const allPoints = [...freehandPath, pos];
      if (allPoints.length === 0) return;

      const minX = Math.min(...allPoints.map((p) => p.x));
      const maxX = Math.max(...allPoints.map((p) => p.x));
      const minY = Math.min(...allPoints.map((p) => p.y));
      const maxY = Math.max(...allPoints.map((p) => p.y));

      selectionData = {
        type: "freehand",
        coordinates: { points: allPoints },
        bounds: { x: minX, y: minY, width: maxX - minX, height: maxY - minY },
        canvasWidth: canvas?.width || 800,
        canvasHeight: canvas?.height || 600,
      };
    }

    setCurrentSelection(selectionData);
    onSelectionChange(JSON.stringify(selectionData));
  };

  const clearSelection = () => {
    const canvas = overlayCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCurrentSelection(null);
    setFreehandPath([]);
    onSelectionChange("");
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  useEffect(() => {
    if (uploadedImage) {
      loadImageToCanvas(uploadedImage);
    }
  }, [uploadedImage]);

  return (
    <Card className="glass-strong p-6 space-y-6 rounded-2xl">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-cyan-400 neon-text">
          {t("Upload & Select Area")}
        </h3>

        {imageLoaded && (
          <div className="flex gap-2">
            <Button
              variant={selectionTool === "rectangle" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectionTool("rectangle")}
              className={
                selectionTool === "rectangle"
                  ? "bg-cyan-400/20 border-cyan-400"
                  : "glass border-cyan-400/30"
              }
            >
              <Square className="w-4 h-4 mr-2" />
              {t("Rectangle")}
            </Button>
            <Button
              variant={selectionTool === "circle" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectionTool("circle")}
              className={
                selectionTool === "circle"
                  ? "bg-purple-400/20 border-purple-400"
                  : "glass border-purple-400/30"
              }
            >
              <Circle className="w-4 h-4 mr-2" />
              {t("Circle")}
            </Button>
            <Button
              variant={selectionTool === "freehand" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectionTool("freehand")}
              className={
                selectionTool === "freehand"
                  ? "bg-green-400/20 border-green-400"
                  : "glass border-green-400/30"
              }
            >
              <Edit3 className="w-4 h-4 mr-2" />
              {t("Brush Select")}
            </Button>
            {currentSelection && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearSelection}
                className="glass border-red-400/30 hover:bg-red-400/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {t("Clear")}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Upload Area */}
      {!imageLoaded && (
        <div
          className="w-full h-96 border-2 border-dashed border-cyan-400/50 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-cyan-400 hover:bg-cyan-400/5 transition-all duration-300"
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {isUploading ? (
            <>
              <div className="w-12 h-12 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mb-4"></div>
              <p className="text-cyan-400 text-lg font-semibold">
                {t("Uploading...")}
              </p>
            </>
          ) : (
            <>
              <Upload className="w-16 h-16 text-cyan-400 mb-4 animate-bounce" />
              <p className="text-xl font-semibold text-cyan-400 neon-text mb-2">
                {t("Drop your image here or click to upload")}
              </p>
              <p className="text-gray-400 text-center mb-4">
                {t("Supports JPG, PNG, WebP - Max 10MB")}
              </p>
              <Button className="bg-cyan-400/20 border-cyan-400 hover:bg-cyan-400/30">
                <Upload className="w-4 h-4 mr-2" />
                {t("Choose Image")}
              </Button>
            </>
          )}
        </div>
      )}

      {/* Image Canvas */}
      {imageLoaded && (
        <div className="space-y-4">
          <div className="relative border-2 border-cyan-400/30 rounded-xl overflow-hidden bg-gray-900/50">
            <canvas
              ref={canvasRef}
              className="block"
              style={{ maxWidth: "100%", height: "auto" }}
            />
            <canvas
              ref={overlayCanvasRef}
              className="absolute top-0 left-0 cursor-crosshair"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={() => setIsDrawing(false)}
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </div>

          <div className="text-center space-y-2">
            <p className="text-gray-300">
              {t(
                "Select a tool above and draw on the image to mark areas for AI transformation.",
              )}
            </p>
            {currentSelection && (
              <p className="text-cyan-400 font-semibold">
                ✅ {t("Selection active - ready for AI processing")}
              </p>
            )}
            {!currentSelection && (
              <p className="text-yellow-400">
                ⚠️ {t("No area selected - AI will process the entire image")}
              </p>
            )}
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) =>
          e.target.files?.[0] && handleFileSelect(e.target.files[0])
        }
        className="hidden"
      />
    </Card>
  );
}
