"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { X, ZoomIn, ZoomOut, RotateCw, Check, Move, RefreshCw } from "lucide-react";

interface ImageCropModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  onClose: () => void;
  onCropComplete: (croppedFile: File, previewUrl: string) => void;
  cropShape?: "circle" | "rect";
  aspectRatio?: number; // width / height, e.g. 1 for circle, 1.6 for division photo
  title?: string;
}

export default function ImageCropModal({
  isOpen,
  imageSrc,
  onClose,
  onCropComplete,
  cropShape = "circle",
  aspectRatio = 1,
  title = "Sesuaikan Foto",
}: ImageCropModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Viewfinder dimensions
  const isRect = cropShape === "rect";
  const boxWidth = isRect ? 340 : 250;
  const boxHeight = isRect ? Math.round(340 / (aspectRatio || 1.6)) : 250;

  // Reset controls when opened or imageSrc changed
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.setAttribute("data-lenis-prevent", "true");
      setZoom(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
    } else {
      document.body.style.overflow = "";
      document.body.removeAttribute("data-lenis-prevent");
    }
    return () => {
      document.body.style.overflow = "";
      document.body.removeAttribute("data-lenis-prevent");
    };
  }, [isOpen, imageSrc]);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    },
    [isDragging, dragStart]
  );

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch drag handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y,
      });
    }
  };

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const touch = e.touches[0];
      setPosition({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y,
      });
    },
    [isDragging, dragStart]
  );

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.0015;
    setZoom((prev) => Math.min(Math.max(0.4, prev + delta), 6));
  };

  // Rotate 90 degrees clockwise
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Reset position & zoom
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  // Crop & Export via HTML5 Canvas
  const handleApply = async () => {
    if (!imageRef.current) return;

    const img = imageRef.current;
    const canvas = document.createElement("canvas");
    
    // High-resolution output canvas
    const outputWidth = isRect ? 960 : 600;
    const outputHeight = isRect ? Math.round(960 / (aspectRatio || 1.5)) : 600;
    canvas.width = outputWidth;
    canvas.height = outputHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const scaleFactor = outputWidth / boxWidth;

    ctx.save();
    // 1. Move canvas origin to translated center in canvas coordinates
    ctx.translate(
      outputWidth / 2 + position.x * scaleFactor,
      outputHeight / 2 + position.y * scaleFactor
    );
    // 2. Rotate around the image center
    ctx.rotate((rotation * Math.PI) / 180);
    // 3. Scale by zoom factor and resolution scale
    ctx.scale(zoom * scaleFactor, zoom * scaleFactor);

    // 4. Base dimension matches exact DOM rendered dimensions
    const imgNaturalAspect = (img.naturalWidth || 1) / (img.naturalHeight || 1);
    const drawW = boxWidth;
    const drawH = boxWidth / imgNaturalAspect;

    // 5. Draw image centered at (0, 0)
    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);

    ctx.restore();

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const filename = `cropped_${Date.now()}.webp`;
        const croppedFile = new File([blob], filename, { type: "image/webp" });
        const previewUrl = URL.createObjectURL(blob);
        onCropComplete(croppedFile, previewUrl);
        onClose();
      },
      "image/webp",
      0.95
    );
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <div
      data-lenis-prevent="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn font-plusJakarta"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div
        data-lenis-prevent="true"
        className={`relative flex flex-col items-center w-full ${isRect ? "max-w-xl" : "max-w-md"} bg-slate-900 text-white rounded-[32px] border border-slate-800 shadow-2xl overflow-hidden p-6 sm:p-7 gap-5 animate-scaleUp`}
      >
        {/* Header */}
        <div className="flex items-center justify-between w-full border-b border-slate-800 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary/20 text-secondary flex items-center justify-center text-sm font-bold">
              <Move size={16} />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white tracking-tight">
                {title}
              </h3>
              <p className="text-[11px] text-slate-400">
                {isRect 
                  ? "Geser dan zoom gambar di dalam bingkai persegi panjang" 
                  : "Geser dan zoom foto di dalam lingkaran (ala foto profil WhatsApp)"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Viewfinder Area */}
        <div
          ref={containerRef}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            width: isRect ? "100%" : "280px",
            height: isRect ? `${boxHeight + 40}px` : "280px",
            maxWidth: isRect ? "460px" : "280px",
          }}
          className="relative bg-slate-950 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing flex items-center justify-center select-none shadow-inner border border-slate-800"
        >
          {/* Target Image with interactive transform */}
          <div
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
              transition: isDragging ? "none" : "transform 0.05s ease-out",
            }}
            className="pointer-events-none flex items-center justify-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Crop target"
              className="max-w-none h-auto object-contain"
              style={{
                width: isRect ? `${boxWidth}px` : "250px",
              }}
              draggable={false}
            />
          </div>

          {/* Mask Overlay */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {cropShape === "circle" ? (
              <div
                style={{
                  boxShadow: "0 0 0 9999px rgba(10, 15, 30, 0.78)",
                  borderRadius: "50%",
                  width: `${boxWidth}px`,
                  height: `${boxHeight}px`,
                  border: "2px solid rgba(255, 255, 255, 0.95)",
                }}
              />
            ) : (
              <div
                style={{
                  boxShadow: "0 0 0 9999px rgba(10, 15, 30, 0.78)",
                  borderRadius: "16px",
                  width: `${boxWidth}px`,
                  height: `${boxHeight}px`,
                  border: "2px solid rgba(255, 255, 255, 0.95)",
                }}
              />
            )}
          </div>
        </div>

        {/* Controls: Zoom Slider & Rotate */}
        <div className="flex flex-col gap-3 w-full px-2">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.4, z - 0.25))}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              title="Perkecil"
            >
              <ZoomOut size={16} />
            </button>

            <input
              type="range"
              min="0.4"
              max="6"
              step="0.01"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-secondary"
            />

            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(6, z + 0.25))}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              title="Perbesar"
            >
              <ZoomIn size={16} />
            </button>

            <button
              type="button"
              onClick={handleRotate}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors ml-1"
              title="Putar 90°"
            >
              <RotateCw size={16} />
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              title="Reset Posisi"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between w-full pt-3 border-t border-slate-800">
          <span className="text-[11px] text-slate-400">
            {isRect ? "Rasio Persegi Panjang (16:10)" : "Rasio Lingkaran (1:1)"}
          </span>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-extrabold text-xs shadow-lg shadow-primary/30 hover:opacity-95 transition-all flex items-center gap-2"
            >
              <Check size={16} />
              <span>Terapkan Foto</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
