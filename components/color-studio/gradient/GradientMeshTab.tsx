'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { useGradientStudioStore } from '@/lib/stores/gradientStudio';
import { Plus, Trash2 } from 'lucide-react';
import { ColorPicker } from '../shared/ColorPicker';
import { DEFAULT_AURORA_STYLES } from '@/lib/color-studio/gradientTypes';
import type { MeshPoint } from '@/lib/color-studio/gradientTypes';

const DEFAULT_COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a'];

function renderMesh(canvas: HTMLCanvasElement, points: MeshPoint[], mousePos?: { x: number; y: number }) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  if (points.length === 0) return;

  // Draw each point as a radial gradient
  for (const p of points) {
    const cx = p.x * w;
    const cy = p.y * h;
    const radius = Math.max(10, (p.radius / 100) * Math.min(w, h) * 0.5);

    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    const alpha = p.opacity ?? 0.8;
    grad.addColorStop(0, hexToRGBA(p.color, alpha));
    grad.addColorStop(1, hexToRGBA(p.color, 0));

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
  }

  // Draw connection lines between nearby points (mesh)
  if (points.length > 1) {
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        ctx.beginPath();
        ctx.moveTo(points[i].x * w, points[i].y * h);
        ctx.lineTo(points[j].x * w, points[j].y * h);
        ctx.stroke();
      }
    }
  }

  // Draw point indicators
  for (const p of points) {
    const cx = p.x * w;
    const cy = p.y * h;

    // Outer glow
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 20);
    glow.addColorStop(0, 'rgba(255,255,255,0.3)');
    glow.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.beginPath();
    ctx.arc(cx, cy, 20, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();

    // Circle
    ctx.beginPath();
    ctx.arc(cx, cy, 8, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Mouse follower indicator
  if (mousePos) {
    ctx.beginPath();
    ctx.arc(mousePos.x, mousePos.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

function hexToRGBA(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16) || 0;
  const g = parseInt(hex.slice(3, 5), 16) || 0;
  const b = parseInt(hex.slice(5, 7), 16) || 0;
  return `rgba(${r},${g},${b},${alpha})`;
}

export function GradientMeshTab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [points, setPoints] = useState<MeshPoint[]>(() =>
    DEFAULT_COLORS.slice(0, 4).map((color, i) => ({
      id: `mesh-${i}`,
      color,
      x: [0.2, 0.8, 0.3, 0.7][i],
      y: [0.3, 0.3, 0.7, 0.7][i],
      radius: 50 + i * 5,
      intensity: 80 - i * 5,
      opacity: 0.6,
    })),
  );
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [canvasSize, setCanvasSize] = useState({ w: 600, h: 340 });
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);

  // Handle resize
  useEffect(() => {
    const obs = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        setCanvasSize({ w: Math.floor(width), h: Math.floor(width * 0.56) });
      }
    });
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  // Render on changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvasSize.w;
    canvas.height = canvasSize.h;
    renderMesh(canvas, points);
  }, [canvasSize, points]);

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / canvasSize.w;
    const y = (e.clientY - rect.top) / canvasSize.h;

    // Check if clicking an existing point
    const idx = points.findIndex((p) => {
      const dx = p.x - x;
      const dy = p.y - y;
      return Math.sqrt(dx * dx + dy * dy) < 0.05;
    });

    if (idx >= 0) {
      setSelectedIdx(idx);
    } else {
      // Add new point
      const newPoint: MeshPoint = {
        id: `mesh-${Date.now()}`,
        color: DEFAULT_COLORS[points.length % DEFAULT_COLORS.length],
        x,
        y,
        radius: 50,
        intensity: 70,
        opacity: 0.6,
      };
      setPoints((prev) => [...prev, newPoint]);
      setSelectedIdx(points.length);
    }
  }, [points, canvasSize]);

  const handleMouseDown = useCallback(() => {
    isDraggingRef.current = true;
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / canvasSize.w;
    const y = (e.clientY - rect.top) / canvasSize.h;

    if (isDraggingRef.current && selectedIdx !== null && points[selectedIdx]) {
      setPoints((prev) =>
        prev.map((p, i) =>
          i === selectedIdx
            ? { ...p, x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) }
            : p,
        ),
      );
    }
  }, [selectedIdx, points, canvasSize]);

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    setIsDragging(false);
  }, []);

  const handleRemovePoint = (idx: number) => {
    if (points.length <= 2) return;
    setPoints((prev) => prev.filter((_, i) => i !== idx));
    setSelectedIdx(null);
  };

  const handleUpdatePoint = (idx: number, partial: Partial<MeshPoint>) => {
    setPoints((prev) => prev.map((p, i) => (i === idx ? { ...p, ...partial } : p)));
  };

  const handleAddPoint = () => {
    const newPoint: MeshPoint = {
      id: `mesh-${Date.now()}`,
      color: DEFAULT_COLORS[points.length % DEFAULT_COLORS.length],
      x: 0.3 + Math.random() * 0.4,
      y: 0.3 + Math.random() * 0.4,
      radius: 50,
      intensity: 70,
      opacity: 0.6,
    };
    setPoints((prev) => [...prev, newPoint]);
  };

  return (
    <div className="space-y-4">
      {/* Canvas mesh editor */}
      <div
        ref={containerRef}
        className="rounded-xl border border-border/50 overflow-hidden bg-card"
      >
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="w-full cursor-crosshair"
          style={{ touchAction: 'none' }}
        />
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {points.length} points · Click to add · Drag to move
        </p>
        <button
          type="button"
          onClick={handleAddPoint}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border/50 bg-card hover:bg-muted transition-colors"
        >
          <Plus size={14} />
          Add Point
        </button>
      </div>

      {/* Selected point controls */}
      {selectedIdx !== null && points[selectedIdx] && (
        <div className="p-4 rounded-xl border border-border/50 bg-card space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-foreground">Point {selectedIdx + 1}</h4>
            <button
              type="button"
              onClick={() => handleRemovePoint(selectedIdx)}
              className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
              disabled={points.length <= 2}
            >
              <Trash2 size={14} />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[10px] font-medium text-muted-foreground uppercase">Color</label>
              <ColorPicker
                hex={points[selectedIdx].color}
                onChange={(hex: string) => handleUpdatePoint(selectedIdx, { color: hex })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-medium text-muted-foreground uppercase">
                Radius: {points[selectedIdx].radius}%
              </label>
              <input
                type="range"
                min={10}
                max={100}
                value={points[selectedIdx].radius}
                onChange={(e) => handleUpdatePoint(selectedIdx, { radius: parseInt(e.target.value) })}
                className="w-full h-1.5 accent-primary mt-2"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-medium text-muted-foreground uppercase">
                Opacity: {Math.round(points[selectedIdx].opacity * 100)}%
              </label>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(points[selectedIdx].opacity * 100)}
                onChange={(e) => handleUpdatePoint(selectedIdx, { opacity: parseInt(e.target.value) / 100 })}
                className="w-full h-1.5 accent-primary mt-2"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-medium text-muted-foreground uppercase">
                Intensity: {points[selectedIdx].intensity}%
              </label>
              <input
                type="range"
                min={0}
                max={100}
                value={points[selectedIdx].intensity}
                onChange={(e) => handleUpdatePoint(selectedIdx, { intensity: parseInt(e.target.value) })}
                className="w-full h-1.5 accent-primary mt-2"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
