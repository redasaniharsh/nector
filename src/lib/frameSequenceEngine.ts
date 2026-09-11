/**
 * Frame Sequence Engine for NÉCTAR Hero Scroll Animation
 * 
 * Implements the exact choreography from the reference video:
 * - 120 frames total (0 to 119)
 * - Phase 1 (0-25%): Jar starts elevated above glowing frosted crystal pedestal, lowers & docks into base
 * - Phase 2 (25-45%): Base flattens & recedes into floor caustics
 * - Phase 3 (45-78%): Jar rises back up and rotates 3D, revealing label, faceted glass & translucent candies
 * - Phase 4 (78-100%): Settles into dramatic 3/4 hero angle with warm amber back-glow & specular rim
 * 
 * Supports both:
 * 1. Pre-rendered static image sequence loader (/frames/frame_%03d.webp)
 * 2. High-precision in-memory compositor engine that generates all 120 frames dynamically
 * 3. Export utility to export frames as WebP
 */

import { ASSETS } from '../assets/images';

export interface FrameEngineOptions {
  totalFrames?: number;
  width?: number;
  height?: number;
  framePattern?: string;
}

export class FrameSequenceEngine {
  public readonly totalFrames: number;
  public readonly width: number;
  public readonly height: number;
  public readonly framePattern: string;

  private heroImg: HTMLImageElement | null = null;
  private angleImg: HTMLImageElement | null = null;
  private macroImg: HTMLImageElement | null = null;
  private specImg: HTMLImageElement | null = null;

  private cachedCanvases: Map<number, HTMLCanvasElement> = new Map();
  private staticFramesAvailable: boolean | null = null;
  private loadedStaticFrames: Map<number, HTMLImageElement> = new Map();
  private isGenerating: boolean = false;
  private readyPromise: Promise<void> | null = null;

  constructor(options: FrameEngineOptions = {}) {
    this.totalFrames = options.totalFrames || 120;
    this.width = options.width || 960;
    this.height = options.height || 960;
    this.framePattern = options.framePattern || '/frames/frame_%03d.webp';
  }

  /**
   * Initialize master textures and test static path availability
   */
  public async init(): Promise<void> {
    if (this.readyPromise) return this.readyPromise;

    this.readyPromise = (async () => {
      // 1. Load the master product textures
      await Promise.all([
        this.loadImage(ASSETS.heroJar).then(img => { this.heroImg = img; }),
        this.loadImage(ASSETS.jarAngle).then(img => { this.angleImg = img; }),
        this.loadImage(ASSETS.macroCandy).then(img => { this.macroImg = img; }),
        this.loadImage(ASSETS.jarSpec).then(img => { this.specImg = img; }),
      ]);

      // 2. Test if external static frames exist
      const testPath = this.getFramePath(0);
      try {
        const res = await fetch(testPath, { method: 'HEAD' });
        if (res.ok) {
          this.staticFramesAvailable = true;
          this.preloadStaticFrames();
        } else {
          this.staticFramesAvailable = false;
        }
      } catch {
        this.staticFramesAvailable = false;
      }

      // Pre-render key frames (0, 30, 60, 90, 119) immediately for instant scrub response
      this.warmupKeyFrames();
    })();

    return this.readyPromise;
  }

  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => resolve(img); // resolve gracefully
      img.src = src;
    });
  }

  public getFramePath(index: number): string {
    const padded = String(index + 1).padStart(3, '0');
    return this.framePattern.replace('%03d', padded);
  }

  private async preloadStaticFrames() {
    // Progressively preload in batches
    for (let i = 0; i < this.totalFrames; i++) {
      if (this.loadedStaticFrames.has(i)) continue;
      const img = new Image();
      img.src = this.getFramePath(i);
      img.onload = () => {
        this.loadedStaticFrames.set(i, img);
      };
    }
  }

  private warmupKeyFrames() {
    // Generate initial keyframes first
    const keyIndexes = [0, 15, 30, 50, 70, 90, 110, 119];
    keyIndexes.forEach(idx => {
      this.getFrameCanvas(idx);
    });

    // Schedule the rest via requestIdleCallback if available
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      let current = 0;
      const generateNext = () => {
        if (current < this.totalFrames) {
          if (!this.cachedCanvases.has(current)) {
            this.getFrameCanvas(current);
          }
          current++;
          window.requestIdleCallback(generateNext);
        }
      };
      window.requestIdleCallback(generateNext);
    }
  }

  /**
   * Render a specific frame index directly to a target 2D canvas context
   */
  public renderTo(
    ctx: CanvasRenderingContext2D,
    frameIndex: number,
    targetWidth: number,
    targetHeight: number
  ): void {
    const safeIndex = Math.max(0, Math.min(this.totalFrames - 1, Math.round(frameIndex)));

    // Check if static pre-rendered image is loaded
    if (this.staticFramesAvailable && this.loadedStaticFrames.has(safeIndex)) {
      const img = this.loadedStaticFrames.get(safeIndex)!;
      ctx.clearRect(0, 0, targetWidth, targetHeight);
      this.drawCover(ctx, img, targetWidth, targetHeight);
      return;
    }

    // Otherwise use high-fidelity procedural compositor frame
    const frameCanvas = this.getFrameCanvas(safeIndex);
    ctx.clearRect(0, 0, targetWidth, targetHeight);
    ctx.drawImage(frameCanvas, 0, 0, targetWidth, targetHeight);
  }

  /**
   * Get or generate the cached canvas for a given frame index
   */
  public getFrameCanvas(index: number): HTMLCanvasElement {
    if (this.cachedCanvases.has(index)) {
      return this.cachedCanvases.get(index)!;
    }

    const c = document.createElement('canvas');
    c.width = this.width;
    c.height = this.height;
    const ctx = c.getContext('2d');
    if (ctx) {
      this.drawSynthesizedFrame(ctx, index / (this.totalFrames - 1));
    }
    this.cachedCanvases.set(index, c);
    return c;
  }

  /**
   * Compositor: Generates each frame adhering strictly to the choreography
   * @param progress Normalized scroll progress 0.0 to 1.0
   */
  public drawSynthesizedFrame(ctx: CanvasRenderingContext2D, progress: number): void {
    const w = this.width;
    const h = this.height;
    const cx = w / 2;
    const cy = h / 2;

    // 1. Base dark warm charcoal background
    ctx.fillStyle = '#0b0704';
    ctx.fillRect(0, 0, w, h);

    // 2. Dynamic radial atmospheric back-glow
    // Ambient glow shifts in color/intensity as animation progresses
    const amberIntensity = 0.16 + Math.sin(progress * Math.PI) * 0.14 + (progress > 0.7 ? 0.1 : 0);
    const ambientGlow = ctx.createRadialGradient(cx, cy * 0.9, 10, cx, cy * 0.9, w * 0.65);
    ambientGlow.addColorStop(0, `rgba(255, 138, 30, ${amberIntensity})`);
    ambientGlow.addColorStop(0.45, `rgba(255, 100, 20, ${amberIntensity * 0.45})`);
    ambientGlow.addColorStop(0.8, 'rgba(25, 14, 8, 0.2)');
    ambientGlow.addColorStop(1, 'rgba(11, 7, 4, 0)');
    ctx.fillStyle = ambientGlow;
    ctx.fillRect(0, 0, w, h);

    // 3. Cool teal/cyan floor caustic glow (matches reference video's icy base glow)
    // Strongest in Phase 1 (p: 0 - 0.25), recedes in Phase 2
    let tealAlpha = 0.28;
    if (progress > 0.25 && progress <= 0.5) {
      tealAlpha = 0.28 * (1 - (progress - 0.25) / 0.25);
    } else if (progress > 0.5) {
      tealAlpha = 0.06; // faint ambient floor rim
    }

    if (tealAlpha > 0.01) {
      const tealGlow = ctx.createRadialGradient(cx, h * 0.82, 20, cx, h * 0.82, w * 0.45);
      tealGlow.addColorStop(0, `rgba(45, 212, 191, ${tealAlpha})`);
      tealGlow.addColorStop(0.5, `rgba(20, 184, 166, ${tealAlpha * 0.3})`);
      tealGlow.addColorStop(1, 'rgba(11, 7, 4, 0)');
      ctx.fillStyle = tealGlow;
      ctx.fillRect(0, h * 0.55, w, h * 0.45);
    }

    // 4. Choreography calculations:
    // Phase 1 (0 to 0.25): Jar elevated (+100px Y), lowers down to dock in base (Y = 0)
    // Phase 2 (0.25 to 0.45): Jar sits in base. Base flattens & recedes (scaleY 1 -> 0, alpha 1 -> 0)
    // Phase 3 (0.45 to 0.78): Jar lifts back up (-25px Y) and rotates (yaw 0 -> 240 deg)
    // Phase 4 (0.78 to 1.0): Settles at 3/4 hero presentation angle, scale increases slightly, light intensifies

    let jarY = 0;
    let baseOpacity = 1.0;
    let baseScaleY = 1.0;
    let jarScale = 0.88;
    let jarRotationY = 0; // simulated Y-axis yaw
    let blendToAngled = 0; // blend towards 3/4 angle texture

    if (progress <= 0.25) {
      // Phase 1: Descent
      const t = progress / 0.25;
      const ease = t * t * (3 - 2 * t); // smoothstep
      jarY = (1 - ease) * -110; // starts 110px elevated, lands at 0
      baseOpacity = 1.0;
      baseScaleY = 1.0;
      jarScale = 0.84 + ease * 0.04;
      jarRotationY = Math.sin(t * 0.5) * 5;
    } else if (progress <= 0.45) {
      // Phase 2: Base flattens & recedes
      const t = (progress - 0.25) / 0.2;
      const ease = t * t;
      jarY = 0;
      baseOpacity = Math.max(0, 1 - ease * 1.1);
      baseScaleY = Math.max(0.05, 1 - ease * 0.9);
      jarScale = 0.88;
      jarRotationY = 5 + t * 15;
    } else if (progress <= 0.78) {
      // Phase 3: Jar elevates & 3D rotates
      const t = (progress - 0.45) / 0.33;
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      jarY = -35 * Math.sin(t * Math.PI); // graceful lift and settle
      baseOpacity = 0;
      baseScaleY = 0.1;
      jarScale = 0.88 + t * 0.06;
      jarRotationY = 20 + ease * 220; // 3D rotation
      blendToAngled = Math.max(0, (t - 0.4) / 0.6);
    } else {
      // Phase 4: Settle into 3/4 Hero angle
      const t = (progress - 0.78) / 0.22;
      const ease = 1 - Math.pow(1 - t, 3);
      jarY = -5 * (1 - ease);
      baseOpacity = 0;
      baseScaleY = 0.1;
      jarScale = 0.94 + ease * 0.04; // subtle hero punch
      jarRotationY = 240 + ease * 30; // lands at ~270 / 3/4 angle
      blendToAngled = 1.0;
    }

    // 5. Draw Frosted Crystal Pedestal (when baseOpacity > 0)
    if (baseOpacity > 0.01) {
      ctx.save();
      ctx.globalAlpha = baseOpacity;
      this.drawFrostedPedestal(ctx, cx, cy + 180, baseScaleY);
      ctx.restore();
    }

    // 6. Draw Shadow / Floor Contact
    ctx.save();
    const shadowAlpha = (0.35 + (progress > 0.25 ? 0.15 : 0)) * (1 - Math.abs(jarY) / 180);
    const shadowGradient = ctx.createRadialGradient(cx, cy + 220, 10, cx, cy + 220, 240 * jarScale);
    shadowGradient.addColorStop(0, `rgba(0, 0, 0, ${Math.max(0, shadowAlpha)})`);
    shadowGradient.addColorStop(0.6, `rgba(5, 3, 2, ${Math.max(0, shadowAlpha * 0.4)})`);
    shadowGradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = shadowGradient;
    ctx.beginPath();
    ctx.ellipse(cx, cy + 220, 220 * jarScale, 45 * jarScale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 7. Draw Jar with 3D Transformation & Lighting
    ctx.save();
    ctx.translate(cx, cy + jarY);
    ctx.scale(jarScale, jarScale);

    // Subtle 3D perspective tilt
    const tilt = Math.sin((jarRotationY * Math.PI) / 180) * 0.03;
    ctx.transform(1, 0, tilt, 1, 0, 0);

    const jarW = 460;
    const jarH = 460;
    const jarX = -jarW / 2;
    const jarYPos = -jarH / 2 + 10;

    // Choose and blend textures
    if (blendToAngled < 0.05 && this.heroImg) {
      ctx.drawImage(this.heroImg, jarX, jarYPos, jarW, jarH);
    } else if (blendToAngled >= 0.95 && this.angleImg) {
      ctx.drawImage(this.angleImg, jarX, jarYPos, jarW, jarH);
    } else if (this.heroImg && this.angleImg) {
      // Cross-dissolve between front and 3/4 view
      ctx.drawImage(this.heroImg, jarX, jarYPos, jarW, jarH);
      ctx.save();
      ctx.globalAlpha = blendToAngled;
      ctx.drawImage(this.angleImg, jarX, jarYPos, jarW, jarH);
      ctx.restore();
    } else if (this.heroImg) {
      ctx.drawImage(this.heroImg, jarX, jarYPos, jarW, jarH);
    }

    // 8. Simulated Specular Sweep & Dynamic Light Reflection
    // Sweeps across the cylindrical glass contour as it rotates
    const sweepProgress = (jarRotationY % 360) / 360;
    const sweepX = jarX + jarW * (0.2 + sweepProgress * 0.6);
    const sweepGrad = ctx.createLinearGradient(sweepX - 45, 0, sweepX + 45, 0);
    sweepGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    sweepGrad.addColorStop(0.5, 'rgba(255, 230, 200, 0.16)');
    sweepGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = sweepGrad;
    ctx.fillRect(jarX + 40, jarYPos + 40, jarW - 80, jarH - 80);

    ctx.restore();

    // 9. Foreground floating fruit gem particles (subtle depth cues)
    this.drawAmbientGems(ctx, cx, cy, progress);
  }

  /**
   * Draw the frosted crystalline ice pedestal matching the reference video
   */
  private drawFrostedPedestal(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    scaleY: number
  ): void {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(1, scaleY);

    const pw = 360;
    const ph = 140;

    // Crystalline faceted pedestal outline
    ctx.beginPath();
    ctx.moveTo(-pw / 2, 0);
    ctx.lineTo(-pw * 0.42, -ph * 0.35);
    ctx.lineTo(-pw * 0.28, -ph * 0.45);
    ctx.lineTo(pw * 0.28, -ph * 0.45);
    ctx.lineTo(pw * 0.42, -ph * 0.35);
    ctx.lineTo(pw / 2, 0);
    ctx.lineTo(pw * 0.38, ph * 0.45);
    ctx.lineTo(-pw * 0.38, ph * 0.45);
    ctx.closePath();

    // Core frosted glass gradient
    const glassGrad = ctx.createRadialGradient(0, -10, 15, 0, 0, pw * 0.55);
    glassGrad.addColorStop(0, 'rgba(255, 145, 35, 0.45)'); // warm internal amber core
    glassGrad.addColorStop(0.35, 'rgba(255, 115, 20, 0.25)');
    glassGrad.addColorStop(0.7, 'rgba(45, 212, 191, 0.35)'); // cool teal ice rim
    glassGrad.addColorStop(1, 'rgba(15, 118, 110, 0.15)');
    ctx.fillStyle = glassGrad;
    ctx.fill();

    // Facet lines
    ctx.strokeStyle = 'rgba(255, 235, 215, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Internal caustic refractive rings
    ctx.beginPath();
    ctx.ellipse(0, -ph * 0.2, pw * 0.32, ph * 0.16, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Caustic floor base flare
    const flareGrad = ctx.createRadialGradient(0, ph * 0.4, 10, 0, ph * 0.4, pw * 0.6);
    flareGrad.addColorStop(0, 'rgba(45, 212, 191, 0.35)');
    flareGrad.addColorStop(0.5, 'rgba(255, 138, 30, 0.2)');
    flareGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = flareGrad;
    ctx.beginPath();
    ctx.ellipse(0, ph * 0.4, pw * 0.55, 28, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /**
   * Subtle ambient glowing fruit particles that float with scroll parallax
   */
  private drawAmbientGems(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    progress: number
  ): void {
    const gems = [
      { x: -280, y: -160, r: 6, color: 'rgba(255, 138, 30, 0.55)', speed: 1.2 },
      { x: 300, y: -120, r: 8, color: 'rgba(255, 90, 95, 0.45)', speed: 0.8 },
      { x: -240, y: 140, r: 7, color: 'rgba(52, 211, 153, 0.4)', speed: 1.5 },
      { x: 270, y: 190, r: 5, color: 'rgba(251, 191, 36, 0.6)', speed: 1.1 },
    ];

    ctx.save();
    gems.forEach(gem => {
      const floatY = Math.sin(progress * Math.PI * 3 + gem.speed) * 18;
      const gx = cx + gem.x;
      const gy = cy + gem.y + floatY;

      const grad = ctx.createRadialGradient(gx, gy, 1, gx, gy, gem.r * 2);
      grad.addColorStop(0, gem.color);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(gx, gy, gem.r * 2, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  private drawCover(
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    targetWidth: number,
    targetHeight: number
  ): void {
    const sWidth = img.naturalWidth || img.width;
    const sHeight = img.naturalHeight || img.height;
    const r = Math.max(targetWidth / sWidth, targetHeight / sHeight);
    const nw = sWidth * r;
    const nh = sHeight * r;
    const nx = (targetWidth - nw) / 2;
    const ny = (targetHeight - nh) / 2;
    ctx.drawImage(img, nx, ny, nw, nh);
  }

  /**
   * Export all 120 frames as WebP Blobs for download / delivery
   */
  public async exportAllFrames(
    onProgress?: (current: number, total: number) => void
  ): Promise<{ index: number; filename: string; blob: Blob }[]> {
    const frames: { index: number; filename: string; blob: Blob }[] = [];

    for (let i = 0; i < this.totalFrames; i++) {
      const canvas = this.getFrameCanvas(i);
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob(
          (b) => resolve(b || new Blob()),
          'image/webp',
          0.92
        );
      });

      const filename = `frame_${String(i + 1).padStart(3, '0')}.webp`;
      frames.push({ index: i, filename, blob });

      if (onProgress) {
        onProgress(i + 1, this.totalFrames);
      }
    }

    return frames;
  }
}

// Export singleton instance configured for 120 frames
export const defaultFrameEngine = new FrameSequenceEngine({
  totalFrames: 120,
  width: 960,
  height: 960,
});
