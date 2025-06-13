import { useRef, useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, Download, RotateCcw, Square, Circle, Edit3, MousePointer, Trash2 } from 'lucide-react';
import { fabric } from 'fabric/fabric-impl';
import { useLanguage } from '@/hooks/useLanguage';

interface AdvancedImageCanvasProps {
  onImageUpload: (imageUrl: string) => void;
  onSelectionChange: (selectionData: string) => void;
  uploadedImage: string | null;
}

interface SelectionData {
  type: 'rectangle' | 'circle' | 'polygon' | 'freehand';
  coordinates: any;
  bounds: { x: number; y: number; width: number; height: number };
  canvasWidth: number;
  canvasHeight: number;
}

export function AdvancedImageCanvas({ onImageUpload, onSelectionChange, uploadedImage }: AdvancedImageCanvasProps) {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectionTool, setSelectionTool] = useState<'select' | 'rectangle' | 'circle' | 'freehand'>('select');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentSelection, setCurrentSelection] = useState<fabric.Object | null>(null);
  const [isDrawingMode, setIsDrawingMode] = useState(false);

  // Initialize fabric canvas
  useEffect(() => {
    if (canvasRef.current && !fabricCanvasRef.current) {
      const canvas = new fabric.Canvas(canvasRef.current, {
        width: 800,
        height: 600,
        backgroundColor: '#f8f9fa',
        selection: selectionTool === 'select'
      });

      // Configure drawing settings
      canvas.freeDrawingBrush.width = 3;
      canvas.freeDrawingBrush.color = '#3b82f6';

      fabricCanvasRef.current = canvas;

      // Handle selection events
      canvas.on('selection:created', (e) => {
        setCurrentSelection(e.selected?.[0] || null);
        updateSelectionData(e.selected?.[0]);
      });

      canvas.on('selection:updated', (e) => {
        setCurrentSelection(e.selected?.[0] || null);
        updateSelectionData(e.selected?.[0]);
      });

      canvas.on('selection:cleared', () => {
        setCurrentSelection(null);
        onSelectionChange('');
      });

      canvas.on('path:created', (e) => {
        if (selectionTool === 'freehand') {
          updateSelectionData(e.path);
        }
      });
    }

    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, []);

  // Update canvas mode based on selected tool
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.selection = selectionTool === 'select';
    canvas.isDrawingMode = selectionTool === 'freehand';
    setIsDrawingMode(selectionTool === 'freehand');

    // Remove event listeners first
    canvas.off('mouse:down');
    canvas.off('mouse:move');
    canvas.off('mouse:up');

    if (selectionTool === 'rectangle') {
      setupRectangleDrawing(canvas);
    } else if (selectionTool === 'circle') {
      setupCircleDrawing(canvas);
    }
  }, [selectionTool]);

  const setupRectangleDrawing = (canvas: fabric.Canvas) => {
    let isDown = false;
    let origX = 0;
    let origY = 0;
    let rectangle: fabric.Rect | null = null;

    canvas.on('mouse:down', (o) => {
      if (selectionTool !== 'rectangle') return;
      isDown = true;
      const pointer = canvas.getPointer(o.e);
      origX = pointer.x;
      origY = pointer.y;
      
      rectangle = new fabric.Rect({
        left: origX,
        top: origY,
        originX: 'left',
        originY: 'top',
        width: 0,
        height: 0,
        fill: 'rgba(59, 130, 246, 0.3)',
        stroke: '#3b82f6',
        strokeWidth: 2,
        selectable: true,
        evented: true,
      });
      
      canvas.add(rectangle);
    });

    canvas.on('mouse:move', (o) => {
      if (!isDown || !rectangle || selectionTool !== 'rectangle') return;
      const pointer = canvas.getPointer(o.e);
      
      const width = Math.abs(pointer.x - origX);
      const height = Math.abs(pointer.y - origY);
      
      rectangle.set({
        width: width,
        height: height,
        left: pointer.x < origX ? pointer.x : origX,
        top: pointer.y < origY ? pointer.y : origY
      });
      
      canvas.renderAll();
    });

    canvas.on('mouse:up', () => {
      if (rectangle && selectionTool === 'rectangle') {
        isDown = false;
        canvas.setActiveObject(rectangle);
        updateSelectionData(rectangle);
        setCurrentSelection(rectangle);
      }
    });
  };

  const setupCircleDrawing = (canvas: fabric.Canvas) => {
    let isDown = false;
    let origX = 0;
    let origY = 0;
    let circle: fabric.Circle | null = null;

    canvas.on('mouse:down', (o) => {
      if (selectionTool !== 'circle') return;
      isDown = true;
      const pointer = canvas.getPointer(o.e);
      origX = pointer.x;
      origY = pointer.y;
      
      circle = new fabric.Circle({
        left: origX,
        top: origY,
        originX: 'center',
        originY: 'center',
        radius: 0,
        fill: 'rgba(59, 130, 246, 0.3)',
        stroke: '#3b82f6',
        strokeWidth: 2,
        selectable: true,
        evented: true,
      });
      
      canvas.add(circle);
    });

    canvas.on('mouse:move', (o) => {
      if (!isDown || !circle || selectionTool !== 'circle') return;
      const pointer = canvas.getPointer(o.e);
      
      const radius = Math.sqrt(Math.pow(pointer.x - origX, 2) + Math.pow(pointer.y - origY, 2)) / 2;
      circle.set({ radius: radius });
      canvas.renderAll();
    });

    canvas.on('mouse:up', () => {
      if (circle && selectionTool === 'circle') {
        isDown = false;
        canvas.setActiveObject(circle);
        updateSelectionData(circle);
        setCurrentSelection(circle);
      }
    });
  };

  const updateSelectionData = (object: fabric.Object | undefined) => {
    if (!object || !fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const bounds = object.getBoundingRect();
    
    let selectionData: SelectionData;

    if (object instanceof fabric.Rect) {
      selectionData = {
        type: 'rectangle',
        coordinates: {
          x: bounds.left,
          y: bounds.top,
          width: bounds.width,
          height: bounds.height
        },
        bounds,
        canvasWidth: canvas.width || 800,
        canvasHeight: canvas.height || 600
      };
    } else if (object instanceof fabric.Circle) {
      selectionData = {
        type: 'circle',
        coordinates: {
          centerX: object.left || 0,
          centerY: object.top || 0,
          radius: object.radius || 0
        },
        bounds,
        canvasWidth: canvas.width || 800,
        canvasHeight: canvas.height || 600
      };
    } else if (object instanceof fabric.Path) {
      selectionData = {
        type: 'freehand',
        coordinates: {
          path: object.path,
          pathString: object.toSVG()
        },
        bounds,
        canvasWidth: canvas.width || 800,
        canvasHeight: canvas.height || 600
      };
    } else {
      selectionData = {
        type: 'polygon',
        coordinates: bounds,
        bounds,
        canvasWidth: canvas.width || 800,
        canvasHeight: canvas.height || 600
      };
    }

    onSelectionChange(JSON.stringify(selectionData));
  };

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert(t('Please select a valid image file'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      onImageUpload(imageUrl);
      loadImageToCanvas(imageUrl);
    };
    reader.readAsDataURL(file);
  };

  const loadImageToCanvas = (imageUrl: string) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    fabric.Image.fromURL(imageUrl, (img) => {
      // Clear canvas
      canvas.clear();
      
      // Scale image to fit canvas while maintaining aspect ratio
      const canvasWidth = 800;
      const canvasHeight = 600;
      const imgWidth = img.width || 1;
      const imgHeight = img.height || 1;
      
      const scale = Math.min(canvasWidth / imgWidth, canvasHeight / imgHeight);
      
      img.set({
        scaleX: scale,
        scaleY: scale,
        left: (canvasWidth - imgWidth * scale) / 2,
        top: (canvasHeight - imgHeight * scale) / 2,
        selectable: false,
        evented: false,
      });
      
      canvas.add(img);
      canvas.sendToBack(img);
      canvas.renderAll();
      setImageLoaded(true);
    });
  };

  const clearSelection = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.remove(activeObject);
      canvas.discardActiveObject();
      canvas.renderAll();
      setCurrentSelection(null);
      onSelectionChange('');
    }
  };

  const clearAllSelections = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const objects = canvas.getObjects().filter(obj => !(obj instanceof fabric.Image));
    objects.forEach(obj => canvas.remove(obj));
    canvas.discardActiveObject();
    canvas.renderAll();
    setCurrentSelection(null);
    onSelectionChange('');
  };

  // Load uploaded image when prop changes
  useEffect(() => {
    if (uploadedImage) {
      loadImageToCanvas(uploadedImage);
    }
  }, [uploadedImage]);

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{t('Image Editor')}</h3>
        <div className="flex gap-2">
          <Button
            variant={selectionTool === 'select' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectionTool('select')}
          >
            <MousePointer className="w-4 h-4" />
          </Button>
          <Button
            variant={selectionTool === 'rectangle' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectionTool('rectangle')}
          >
            <Square className="w-4 h-4" />
          </Button>
          <Button
            variant={selectionTool === 'circle' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectionTool('circle')}
          >
            <Circle className="w-4 h-4" />
          </Button>
          <Button
            variant={selectionTool === 'freehand' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectionTool('freehand')}
          >
            <Edit3 className="w-4 h-4" />
          </Button>
          {currentSelection && (
            <Button variant="outline" size="sm" onClick={clearSelection}>
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={clearAllSelections}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
        {!imageLoaded && (
          <div 
            className="w-full h-96 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-600 text-center">
              {t('Click to upload an image or drag and drop')}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {t('Supports JPG, PNG, GIF up to 10MB')}
            </p>
          </div>
        )}
        
        <canvas
          ref={canvasRef}
          className={`${imageLoaded ? 'block' : 'hidden'} max-w-full`}
          style={{ cursor: isDrawingMode ? 'crosshair' : 'default' }}
        />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
        className="hidden"
      />

      {imageLoaded && (
        <div className="text-sm text-gray-600">
          <p>
            {t('Select a tool above and draw on the image to mark areas for AI transformation.')}
          </p>
          {currentSelection && (
            <p className="text-blue-600 mt-1">
              {t('Selection active - ready for AI processing')}
            </p>
          )}
        </div>
      )}
    </Card>
  );
}