"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { X, ZoomIn, ZoomOut, RotateCw, Check, Move } from "lucide-react";

interface ImageCropModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  onClose: () => void;
  onCropComplete: (croppedFile: File, previewUrl: string) => void;
  cropShape?: "circle" | "rect";
  aspectRatio?: number; // width / height, default 1
  title?: string;
}

export default function ImageCropModal({
  isOpen,
  imageSrc,
  onClose,
  onCropComplete,
  cropShape = "circle",
  aspectRatio = 1,
  title = "Sesuaikan Foto Profil",
}: ImageCropModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  // Lock background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.setAttribute("data-lenis-prevent", "true");
      // Reset controls
      setZoom(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
      setImageLoaded(false);
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
    const delta = e.deltaY * -0.001;
    setZoom((prev) => Math.min(Math.max(0.8, prev + delta), 3));
  };

  // Rotate 90 degrees clockwise
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Crop & Export
  const handleApply = async () => {
    if (!imageRef.current) return;

    const img = imageRef.current;
    const canvas = document.createElement("canvas");
    const outputSize = 600; // High resolution square/rect
    canvas.width = outputSize;
    canvas.height = Math.round(outputSize / aspectRatio);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Crop box dimension in container (assume 260px viewfinder)
    const cropBoxSize = 260;
    const cropBoxHeight = cropBoxSize / aspectRatio;

    // Calculate scale factor between canvas output and viewfinder display
    const scaleFactor = canvas.width / cropBoxSize;

    ctx.save();
    // Center point of canvas
    ctx.translate(canvas.width / 2, canvas.height / 2);
    // Apply rotation
    ctx.rotate((rotation * Math.PI) / 180);
    // Apply zoom and pan
    ctx.scale(zoom * scaleFactor, zoom * scaleFactor);

    // Draw the image centered
    const imgAspect = img.naturalWidth / img.naturalHeight;
    let drawWidth = cropBoxSize;
    let drawHeight = cropBoxSize / imgAspect;

    if (imgAspect < 1) {
      drawHeight = cropBoxHeight;
      drawWidth = cropBoxHeight * imgAspect;
    }

    ctx.drawImage(
      img,
      -drawWidth / 2 + (position.x / zoom),
      -drawHeight / 2 + (position.y / zoom),
      drawWidth,
      drawHeight
    );

    ctx.restore();

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const filename = `avatar_${Date.now()}.webp`;
        const croppedFile = new File([blob], filename, { type: "image/webp" });
        const previewUrl = URL.createObjectURL(blob);
        onCropComplete(croppedFile, previewUrl);
        onClose();
      },
      "image/webp",
      0.92
    );
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <div
      data-lenis-prevent="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn font-plusJakarta"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div
        data-lenis-prevent="true"
        className="relative flex flex-col items-center w-full max-w-md bg-slate-900 text-white rounded-[32px] border border-slate-800 shadow-2xl overflow-hidden p-6 sm:p-7 gap-5 animate-scaleUp"
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
                Geser dan sesuaikan zoom foto profil
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

        {/* Viewfinder Area (WhatsApp Style) */}
        <div
          ref={containerRef}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative w-[280px] h-[280px] sm:w-[300px] sm:h-[300px] bg-slate-950 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing flex items-center justify-center select-none shadow-inner border border-slate-800"
        >
          {/* Target Image */}
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
              onLoad={() => setImageLoaded(true)}
              className="max-w-none w-[260px] h-auto object-contain"
              draggable={false}
            />
          </div>

          {/* Mask Overlay (Dark outside circular/rect viewfinder) */}
          <div className="absolute inset-0 pointer-events-none">
            {cropShape === "circle" ? (
              <div
                className="w-full h-full"
                style={{
                  boxShadow: "0 0 0 9999px rgba(10, 15, 30, 0.75)",
                  borderRadius: "50%",
                  width: "240px",
                  height: "240px",
                  margin: "auto",
                  position: "absolute",
                  top: "0",
                  bottom: "0",
                  left: "0",
                  right: "0",
                  border: "2px solid rgba(255, 255, 255, 0.9)",
                }}
              />
            ) : (
              <div
                className="w-full h-full"
                style={{
                  boxShadow: "0 0 0 9999px rgba(10, 15, 30, 0.75)",
                  borderRadius: "16px",
                  width: "250px",
                  height: `${250 / aspectRatio}px`,
                  margin: "auto",
                  position: "absolute",
                  top: "0",
                  bottom: "0",
                  left: "0",
                  right: "0",
                  border: "2px solid rgba(255, 255, 255, 0.9)",
                }}
              />
            )}
          </div>

          {/* Hint Overlay */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950 text-xs text-slate-400">
              Memuat gambar...
            </div>
          )}
        </div>

        {/* Controls: Zoom Slider & Rotate */}
        <div className="flex flex-col gap-3 w-full px-2">
          {/* Zoom Slider */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.8, z - 0.15))}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              title="Perkecil"
            >
              <ZoomOut size={16} />
            </button>

            <input
              type="range"
              min="0.8"
              max="3"
              step="0.01"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-secondary"
            />

            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(3, z + 0.15))}
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
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 w-full pt-3 border-t border-slate-800">
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
  );
}
