"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ZoomIn, ZoomOut, RotateCw, RefreshCw, Check, X, Move } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageFile: File | null;
  onApplyCrop: (croppedFile: File) => void;
}

export function ImageCropModal({
  isOpen,
  onClose,
  imageFile,
  onApplyCrop,
}: ImageCropModalProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0); // in degrees: 0, 90, 180, 270
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Load image when file changes
  useEffect(() => {
    if (!imageFile) {
      setImageSrc(null);
      return;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setImageSrc(objectUrl);
    setZoom(1);
    setRotation(0);
    setPan({ x: 0, y: 0 });

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [imageFile]);

  // Handle Drag / Pan Events
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    panStartRef.current = { ...pan };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPan({
      x: panStartRef.current.x + dx,
      y: panStartRef.current.y + dy,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((prev) => Math.min(3, Math.max(1, +(prev + delta).toFixed(2))));
  };

  // Rotate 90 degrees
  const handleRotate = () => {
    setRotation((r) => (r + 90) % 360);
  };

  // Reset adjustments
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setPan({ x: 0, y: 0 });
  };

  // Render crop to 500x500 off-screen canvas and export file
  const handleConfirm = useCallback(() => {
    if (!imageRef.current || !containerRef.current) return;

    const img = imageRef.current;
    const container = containerRef.current;
    const containerSize = container.clientWidth; // typically 320px

    const canvas = document.createElement("canvas");
    canvas.width = 500;
    canvas.height = 500;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Scale factor from preview container to 500px output
    const scaleFactor = 500 / containerSize;

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, 500, 500);

    // Save context and apply center-based transforms
    ctx.save();
    ctx.translate(250, 250);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);
    ctx.translate(pan.x * scaleFactor, pan.y * scaleFactor);

    // Calculate dimensions maintaining aspect ratio to fit the container
    const isSideways = rotation === 90 || rotation === 270;
    const naturalWidth = isSideways ? img.naturalHeight : img.naturalWidth;
    const naturalHeight = isSideways ? img.naturalWidth : img.naturalHeight;

    const ratio = Math.max(containerSize / naturalWidth, containerSize / naturalHeight);
    const drawWidth = img.naturalWidth * ratio * scaleFactor;
    const drawHeight = img.naturalHeight * ratio * scaleFactor;

    ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    ctx.restore();

    // Export to File
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const croppedFile = new File([blob], imageFile?.name || "avatar.jpg", {
          type: "image/jpeg",
          lastModified: Date.now(),
        });
        onApplyCrop(croppedFile);
        onClose();
      },
      "image/jpeg",
      0.92
    );
  }, [imageFile, onApplyCrop, onClose, pan, rotation, zoom]);

  if (!isOpen || !imageSrc) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="bg-[#070a10]/95 border border-white/15 max-w-md p-6 shadow-[0_0_50px_rgba(0,0,0,0.95)] backdrop-blur-2xl rounded-sm select-none"
      >
        {/* Top Accent Stripe */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#FF4655]" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF4655] font-bold">
              CROP & POSITION
            </span>
            <h3 className="font-valorant text-base tracking-wider text-white">
              CUSTOMIZE AVATAR
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded text-white/50 hover:text-white transition cursor-pointer"
            title="Cancel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Viewport Area */}
        <div className="flex flex-col items-center gap-4 py-4">
          <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onWheel={handleWheel}
            className={cn(
              "relative w-72 h-72 sm:w-80 sm:h-80 bg-black rounded-sm overflow-hidden border border-white/15 touch-none",
              isDragging ? "cursor-grabbing" : "cursor-grab"
            )}
          >
            {/* The Image being transformed */}
            {imageSrc && (
              <img
                ref={imageRef}
                src={imageSrc}
                alt="Source Crop"
                draggable={false}
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                  transformOrigin: "center center",
                }}
                className="absolute inset-0 m-auto max-w-none max-h-none object-contain w-full h-full pointer-events-none transition-transform duration-75"
              />
            )}

            {/* Circular Crop Guide Mask */}
            <div className="absolute inset-0 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <defs>
                  <mask id="cropMask">
                    <rect width="100" height="100" fill="white" />
                    <circle cx="50" cy="50" r="46" fill="black" />
                  </mask>
                </defs>
                <rect
                  width="100"
                  height="100"
                  fill="rgba(0, 0, 0, 0.65)"
                  mask="url(#cropMask)"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="46"
                  fill="none"
                  stroke="#FF4655"
                  strokeWidth="0.8"
                  strokeDasharray="3 3"
                />
              </svg>
            </div>

            {/* Corner Bracket Accents */}
            <div className="absolute top-2 left-2 h-4 w-4 border-t-2 border-l-2 border-white/40 pointer-events-none" />
            <div className="absolute top-2 right-2 h-4 w-4 border-t-2 border-r-2 border-white/40 pointer-events-none" />
            <div className="absolute bottom-2 left-2 h-4 w-4 border-b-2 border-l-2 border-white/40 pointer-events-none" />
            <div className="absolute bottom-2 right-2 h-4 w-4 border-b-2 border-r-2 border-white/40 pointer-events-none" />

            {/* Drag hint */}
            <div className="absolute bottom-2 inset-x-0 flex justify-center pointer-events-none">
              <span className="text-[9px] font-mono bg-black/70 px-2 py-0.5 rounded text-white/60 flex items-center gap-1 border border-white/10">
                <Move className="h-2.5 w-2.5" /> Drag to pan
              </span>
            </div>
          </div>

          {/* Controls Bar: Zoom Slider + Rotate + Reset */}
          <div className="w-full space-y-3 px-2">
            {/* Zoom Slider */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(1, +(z - 0.2).toFixed(2)))}
                className="p-1 hover:bg-white/10 text-white/60 hover:text-white rounded transition cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </button>

              <input
                type="range"
                min="1"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="flex-1 accent-[#FF4655] h-1.5 bg-white/10 rounded-lg cursor-pointer"
              />

              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(3, +(z + 0.2).toFixed(2)))}
                className="p-1 hover:bg-white/10 text-white/60 hover:text-white rounded transition cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </button>

              <span className="text-[10px] font-mono text-zinc-400 w-10 text-right">
                {zoom.toFixed(1)}x
              </span>
            </div>

            {/* Action Tools: Rotate & Reset */}
            <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
              <button
                type="button"
                onClick={handleRotate}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-white/5 hover:bg-white/10 hover:text-white border border-white/10 transition cursor-pointer text-[10px] font-display font-bold uppercase tracking-wider"
              >
                <RotateCw className="h-3.5 w-3.5 text-accent" />
                <span>ROTATE 90°</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-white/5 hover:bg-white/10 hover:text-white border border-white/10 transition cursor-pointer text-[10px] font-display font-bold uppercase tracking-wider"
              >
                <RefreshCw className="h-3.5 w-3.5 text-white/50" />
                <span>RESET</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-3 pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/15 text-white/80 hover:text-white font-display text-xs font-bold uppercase tracking-wider rounded-sm transition cursor-pointer"
          >
            CANCEL
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 py-2.5 px-4 bg-[#FF4655] hover:bg-[#FF4655]/90 text-white font-display text-xs font-bold uppercase tracking-wider rounded-sm shadow-[0_0_15px_rgba(255,70,85,0.4)] transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-98"
          >
            <Check className="h-4 w-4" />
            <span>APPLY & SAVE</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
