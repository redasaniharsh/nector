import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import {
  createProductModel,
  ProductModelBundle,
} from '../three/productModel';
import {
  createSceneLighting,
  updateProductAnimation,
  fitProductToViewport,
  SceneLightingBundle,
  CameraFitParams,
} from '../three/animationSystem';

interface Hero3DCanvasProps {
  progress: number;
  prefersReducedMotion?: boolean;
}

/**
 * Creates clean, solid dark gradient background texture (black to warm brown)
 * Ensures photorealistic refraction with ZERO transparent DOM bleed.
 */
function createDarkStudioBackgroundTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const grad = ctx.createRadialGradient(512, 480, 60, 512, 512, 620);
    grad.addColorStop(0, '#2b1a10'); // Warm rich espresso brown
    grad.addColorStop(0.32, '#1a100a');
    grad.addColorStop(0.68, '#0d0704');
    grad.addColorStop(1, '#030201'); // Solid obsidian black
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 1024);
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

/**
 * Creates high-dynamic-range studio environment map producing:
 * - Sharp bright specular highlights (small tight white & orange hotspots)
 * - Narrow vertical gloss reflection stripe
 * - Intense warm orange rim softboxes grazing the glass edges
 * - Overhead softbox for the lid and shoulder
 */
function createStudioEnvMap(renderer: THREE.WebGLRenderer): THREE.Texture {
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x030201);

  // Soft overhead light for lid and shoulder
  const topLight = new THREE.Mesh(
    new THREE.PlaneGeometry(12, 12),
    new THREE.MeshBasicMaterial({ color: 0xfffbee })
  );
  topLight.position.set(0, 10, 0);
  topLight.rotation.x = Math.PI / 2;
  scene.add(topLight);

  // TIGHT BRIGHT WHITE SPECULAR HOTSPOT (Small concentrated disc)
  const whiteHotspot = new THREE.Mesh(
    new THREE.CircleGeometry(0.70, 24),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  whiteHotspot.position.set(3.8, 4.8, 7.5);
  whiteHotspot.lookAt(0, 0, 0);
  scene.add(whiteHotspot);

  // TIGHT ORANGE SPECULAR HOTSPOT (Small concentrated orange gleam)
  const orangeHotspot = new THREE.Mesh(
    new THREE.CircleGeometry(0.65, 24),
    new THREE.MeshBasicMaterial({ color: 0xff7700 })
  );
  orangeHotspot.position.set(6.2, 2.8, 3.8);
  orangeHotspot.lookAt(0, 0, 0);
  scene.add(orangeHotspot);

  // Narrow razor-sharp vertical specular stripe
  const verticalSpecularStrip = new THREE.Mesh(
    new THREE.PlaneGeometry(0.65, 12),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  verticalSpecularStrip.position.set(4.4, 2.0, 8.0);
  verticalSpecularStrip.rotation.y = -0.35;
  scene.add(verticalSpecularStrip);

  // Intense warm orange rim softbox on the right
  const amberRimSoftbox = new THREE.Mesh(
    new THREE.PlaneGeometry(4.5, 14),
    new THREE.MeshBasicMaterial({ color: 0xff6600 })
  );
  amberRimSoftbox.position.set(10, 2, -3);
  amberRimSoftbox.rotation.y = -Math.PI / 2 - 0.25;
  scene.add(amberRimSoftbox);

  // Warm golden-orange rim softbox on the left
  const goldRimSoftbox = new THREE.Mesh(
    new THREE.PlaneGeometry(4.5, 14),
    new THREE.MeshBasicMaterial({ color: 0xff8811 })
  );
  goldRimSoftbox.position.set(-10, 2, -3);
  goldRimSoftbox.rotation.y = Math.PI / 2 + 0.25;
  scene.add(goldRimSoftbox);

  // Dark warm floor reflection
  const floorBounce = new THREE.Mesh(
    new THREE.PlaneGeometry(16, 16),
    new THREE.MeshBasicMaterial({ color: 0x180d05 })
  );
  floorBounce.position.set(0, -6, 0);
  floorBounce.rotation.x = -Math.PI / 2;
  scene.add(floorBounce);

  const envTexture = pmremGenerator.fromScene(scene).texture;
  pmremGenerator.dispose();
  return envTexture;
}

export const Hero3DCanvas: React.FC<Hero3DCanvasProps> = ({
  progress,
  prefersReducedMotion = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasWebGLError, setHasWebGLError] = React.useState(false);

  // Scene instances refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelBundleRef = useRef<ProductModelBundle | null>(null);
  const lightsBundleRef = useRef<SceneLightingBundle | null>(null);
  const fitParamsRef = useRef<CameraFitParams>({
    baseDistance: 10.8,
    offsetX: 0.0,
    offsetY: 0.0,
    targetHeightFraction: 0.48,
    isMobile: false,
    isTablet: false,
  });

  // Target vs current progress for fluid scrubbing
  const currentProgressRef = useRef<number>(prefersReducedMotion ? 1.0 : 0.0);
  const targetProgressRef = useRef<number>(prefersReducedMotion ? 1.0 : 0.0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    targetProgressRef.current = prefersReducedMotion ? 1.0 : progress;
  }, [progress, prefersReducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Check WebGL availability
    try {
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (!gl) {
        setHasWebGLError(true);
        return;
      }
    } catch {
      setHasWebGLError(true);
      return;
    }

    const isMobile = window.innerWidth < 768;

    // 1. Scene setup with clean, solid dark gradient background (black to warm brown)
    const scene = new THREE.Scene();
    const studioBgTexture = createDarkStudioBackgroundTexture();
    scene.background = studioBgTexture;
    sceneRef.current = scene;

    // 2. Perspective Camera (32 deg FOV for studio shot)
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 60);
    camera.position.set(0, 0.12, 10.8);
    cameraRef.current = camera;

    // 3. WebGL Renderer with solid opaque output
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: false, // Solid opaque background — zero DOM text bleed
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setHasWebGLError(true);
      return;
    }

    renderer.setClearColor(0x030201, 1.0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.30;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;

    // Studio Environment Map for photorealistic reflections & refraction
    const envMap = createStudioEnvMap(renderer);
    scene.environment = envMap;

    // 4. Dramatic Professional Studio Lighting
    const lights = createSceneLighting();
    lightsBundleRef.current = lights;
    scene.add(lights.ambientLight);
    scene.add(lights.keyLight);
    scene.add(lights.fillLight);
    scene.add(lights.rimLightRight);
    scene.add(lights.rimLightLeft);
    scene.add(lights.topRimLight);

    // 5. Product Model (photorealistic clear glass jar, packed gummy candies, chrome platform)
    const model = createProductModel(isMobile);
    modelBundleRef.current = model;
    scene.add(model.rootGroup);

    // Responsive fitting system
    const updateSize = () => {
      if (!container || !renderer || !camera || !modelBundleRef.current) return;
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;

      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.75);

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height, false);
      renderer.setPixelRatio(dpr);

      const fit = fitProductToViewport(width, height, camera, modelBundleRef.current);
      fitParamsRef.current = fit;

      if (lightsBundleRef.current) {
        updateProductAnimation(
          currentProgressRef.current,
          modelBundleRef.current,
          lightsBundleRef.current,
          camera,
          fit
        );
        renderer.render(scene, camera);
      }
    };

    updateSize();

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });
    resizeObserver.observe(container);

    // 6. Smooth interactive scrub render loop
    let lastRenderedProgress = -1;

    const renderLoop = () => {
      const target = targetProgressRef.current;
      const current = currentProgressRef.current;

      const delta = target - current;
      if (Math.abs(delta) > 0.0001) {
        currentProgressRef.current += delta * 0.16;
      } else {
        currentProgressRef.current = target;
      }

      if (
        Math.abs(currentProgressRef.current - lastRenderedProgress) > 0.00005 &&
        modelBundleRef.current &&
        lightsBundleRef.current &&
        cameraRef.current &&
        rendererRef.current &&
        sceneRef.current
      ) {
        lastRenderedProgress = currentProgressRef.current;

        updateProductAnimation(
          currentProgressRef.current,
          modelBundleRef.current,
          lightsBundleRef.current,
          cameraRef.current,
          fitParamsRef.current
        );

        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }

      rafRef.current = requestAnimationFrame(renderLoop);
    };

    rafRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      resizeObserver.disconnect();

      // Recursive disposal of 3D geometries and materials
      if (modelBundleRef.current?.rootGroup) {
        modelBundleRef.current.rootGroup.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.geometry?.dispose();
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach((m) => m.dispose());
            } else {
              mesh.material?.dispose();
            }
          }
        });
      }

      studioBgTexture.dispose();
      envMap.dispose();
      renderer.dispose();
    };
  }, [prefersReducedMotion]);

  if (hasWebGLError) {
    return (
      <div
        ref={containerRef}
        className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center"
      >
        <div className="w-24 h-24 rounded-full border border-[#ff8a1e]/40 bg-[#160e08] flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(255,138,30,0.2)]">
          <span className="font-display text-xl font-bold text-[#ff8a1e]">NÉCTAR</span>
        </div>
        <p className="font-tech text-xs tracking-widest text-[#9c8f80] uppercase">
          3D Hardware Acceleration Unavailable
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center pointer-events-none"
      style={{ minHeight: '100%' }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block pointer-events-none"
      />
    </div>
  );
};

export default Hero3DCanvas;
