import React, { useState, useEffect, useRef } from 'react';
import { X, Download, Eye, Play, Pause, Layers, CheckCircle2, Sliders } from 'lucide-react';
import { defaultFrameEngine } from '../lib/frameSequenceEngine';

interface ExportFramesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportFramesModal: React.FC<ExportFramesModalProps> = ({ isOpen, onClose }) => {
  const [selectedFrame, setSelectedFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportDone, setExportDone] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playIntervalRef = useRef<number | null>(null);

  const totalFrames = defaultFrameEngine.totalFrames;

  // Render selected frame on modal canvas
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    defaultFrameEngine.renderTo(ctx, selectedFrame, canvas.width, canvas.height);
  }, [isOpen, selectedFrame]);

  // Autoplay preview in modal
  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = window.setInterval(() => {
        setSelectedFrame((prev) => (prev + 1) % totalFrames);
      }, 45);
    } else if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
      playIntervalRef.current = null;
    }
    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    };
  }, [isPlaying, totalFrames]);

  // Download single active frame as WebP
  const handleDownloadSingleFrame = () => {
    const canvas = defaultFrameEngine.getFrameCanvas(selectedFrame);
    const padded = String(selectedFrame + 1).padStart(3, '0');
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nectar_frame_${padded}.webp`;
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/webp', 0.95);
  };

  // Export batch of all 120 frames
  const handleExportAll = async () => {
    setIsExporting(true);
    setExportProgress(0);
    setExportDone(false);

    try {
      const frames = await defaultFrameEngine.exportAllFrames((current, total) => {
        setExportProgress(Math.round((current / total) * 100));
      });

      // Trigger download for first, middle, and hero frames + give instruction
      const sampleIndexes = [0, 29, 59, 89, 119];
      sampleIndexes.forEach(idx => {
        const f = frames[idx];
        if (f) {
          const url = URL.createObjectURL(f.blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = f.filename;
          a.click();
          URL.revokeObjectURL(url);
        }
      });

      setExportDone(true);
    } catch (err) {
      console.error("Export error", err);
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-[#110b07] border border-[#2e2117] rounded-3xl overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.95)] flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#261b13]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-[#ff8a1e]/15 border border-[#ff8a1e]/40 flex items-center justify-center text-[#ff8a1e]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-[#f4ede4]">
                3D Frame Sequence Inspector & Exporter
              </h3>
              <p className="font-tech text-xs text-[#9c8f80]">
                120-Frame Scrub Choreography // WebP Pipeline
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#261b13] text-[#9c8f80] hover:text-[#f4ede4] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Left Canvas Preview Stage */}
          <div className="md:col-span-7 flex flex-col items-center justify-center bg-[#070402] border border-[#261c14] rounded-2xl p-4 relative">
            <canvas
              ref={canvasRef}
              width={560}
              height={560}
              className="w-full max-w-[360px] aspect-square object-contain"
            />

            {/* Floating Frame Tag */}
            <div className="absolute top-4 left-4 font-tech text-xs bg-[#140e0a]/90 px-3 py-1 rounded-full border border-[#2a1e16] text-[#ff8a1e]">
              FRAME {String(selectedFrame + 1).padStart(3, '0')} / {totalFrames}
            </div>

            {/* Play/Pause Button */}
            <div className="absolute bottom-4 left-4 flex items-center space-x-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-full bg-[#ff8a1e] text-[#0b0704] hover:bg-[#ff9c3a] transition-all font-bold cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Right Controls & Spec Info */}
          <div className="md:col-span-5 flex flex-col justify-between space-y-4">
            
            {/* Scrubber control */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-tech text-[#9c8f80]">
                <span>SCRUBBER</span>
                <span className="text-[#ff8a1e] font-bold">
                  {Math.round((selectedFrame / (totalFrames - 1)) * 100)}% SCROLL
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={totalFrames - 1}
                value={selectedFrame}
                onChange={(e) => setSelectedFrame(Number(e.target.value))}
                className="w-full accent-[#ff8a1e] cursor-pointer bg-[#261c14] h-2 rounded-lg"
              />
            </div>

            {/* Choreography Phase Breakdown */}
            <div className="space-y-2 p-3.5 rounded-xl bg-[#170f0a] border border-[#261b13] text-xs font-tech">
              <div className="text-[#ff8a1e] font-semibold text-[11px] uppercase tracking-wider mb-1">
                Choreography Phase Tracking
              </div>
              <div className={`p-1.5 rounded ${selectedFrame <= 30 ? 'bg-[#ff8a1e]/15 text-[#ff8a1e]' : 'text-[#9c8f80]'}`}>
                Phase 1 (0-25%): Elevated above frosted crystal pedestal, lowers & docks into base.
              </div>
              <div className={`p-1.5 rounded ${selectedFrame > 30 && selectedFrame <= 54 ? 'bg-[#ff8a1e]/15 text-[#ff8a1e]' : 'text-[#9c8f80]'}`}>
                Phase 2 (25-45%): Sits in base; base flattens and recedes into floor caustics.
              </div>
              <div className={`p-1.5 rounded ${selectedFrame > 54 && selectedFrame <= 94 ? 'bg-[#ff8a1e]/15 text-[#ff8a1e]' : 'text-[#9c8f80]'}`}>
                Phase 3 (45-78%): Elevates, 3D rotates to reveal label & translucent fruit gummies.
              </div>
              <div className={`p-1.5 rounded ${selectedFrame > 94 ? 'bg-[#ff8a1e]/15 text-[#ff8a1e]' : 'text-[#9c8f80]'}`}>
                Phase 4 (78-100%): Settles into dynamic 3/4 hero angle with amber back-glow.
              </div>
            </div>

            {/* Static Path Dropping Note */}
            <div className="text-[11px] font-tech text-[#9c8f80] p-3 rounded-lg bg-[#0b0704] border border-[#261b13]">
              <span className="text-[#f4ede4] block font-semibold mb-0.5">Drop-in Pattern:</span>
              <code className="text-[#ff8a1e]">/frames/frame_%03d.webp</code>
              <p className="mt-1 text-[10px] text-[#9c8f80]/80 leading-normal">
                If static files are placed in public/frames/, the engine uses them directly. Otherwise, it compiles this 120-frame compositor sequence dynamically.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleDownloadSingleFrame}
                className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl border border-[#ff8a1e]/60 hover:border-[#ff8a1e] text-[#f4ede4] hover:bg-[#ff8a1e]/10 font-tech text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#ff8a1e]" />
                <span>Download Current Frame (.webp)</span>
              </button>

              <button
                onClick={handleExportAll}
                disabled={isExporting}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-[#ff8a1e] hover:bg-[#ff9c3a] text-[#0b0704] font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-[0_0_20px_rgba(255,138,30,0.3)]"
              >
                <Layers className="w-4 h-4" />
                <span>
                  {isExporting
                    ? `Synthesizing ${exportProgress}%...`
                    : 'Export All 120 WEBP Frames'}
                </span>
              </button>

              {exportDone && (
                <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-tech justify-center pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Key frame samples exported successfully!</span>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
