import * as THREE from 'three';
import { ProductModelBundle } from './productModel';

export interface SceneLightingBundle {
  ambientLight: THREE.AmbientLight;
  keyLight: THREE.DirectionalLight;
  fillLight: THREE.DirectionalLight;
  rimLightRight: THREE.PointLight;
  rimLightLeft: THREE.PointLight;
  topRimLight: THREE.PointLight;
}

export interface CameraFitParams {
  baseDistance: number;
  offsetX: number;
  offsetY: number;
  targetHeightFraction: number;
  isMobile: boolean;
  isTablet: boolean;
}

/**
 * Calculates camera distance and horizontal/vertical offsets so that:
 * 1. Product size is maintained at 1.5x scale
 *    (Desktop: ~48% of viewport height; Tablet: ~43.5%; Mobile: ~39%).
 * 2. Positioned in the central-right negative space with generous empty margins.
 * 3. Never touches or gets cropped by navbar, edges, or bottom scrub bar.
 */
export function fitProductToViewport(
  width: number,
  height: number,
  camera: THREE.PerspectiveCamera,
  model?: ProductModelBundle
): CameraFitParams {
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;

  let productHeight = 2.85;
  let productWidth = 2.45;

  if (model) {
    const bbox = new THREE.Box3().setFromObject(model.rootGroup);
    const size = new THREE.Vector3();
    bbox.getSize(size);
    if (size.y > 1.0) {
      productHeight = size.y;
      productWidth = size.x;
    }
  }

  // 1.5x scale target:
  const targetHeightFraction = isMobile ? 0.39 : isTablet ? 0.435 : 0.48;

  const vFovRad = (camera.fov * Math.PI) / 180;
  const tanHalfFov = Math.tan(vFovRad / 2);

  const distFromHeight = productHeight / (2 * targetHeightFraction * tanHalfFov);

  const aspect = width / height;
  const visibleWidthAtDist = 2 * distFromHeight * tanHalfFov * aspect;
  let baseDistance = distFromHeight;

  if (productWidth / visibleWidthAtDist > 0.68) {
    const distFromWidth = productWidth / (2 * 0.68 * tanHalfFov * aspect);
    baseDistance = Math.max(distFromHeight, distFromWidth);
  }

  // Horizontal offset: places the jar between the left content and right specification
  const offsetX = isMobile ? 0.0 : isTablet ? 0.16 : 0.28;
  const offsetY = 0.0;

  return {
    baseDistance,
    offsetX,
    offsetY,
    targetHeightFraction,
    isMobile,
    isTablet,
  };
}

/**
 * Creates dramatic professional studio lighting on a black background:
 * - Sharp bright specular key light (tight hotspots)
 * - Dual rear orange rim lights grazing the crystal glass edges
 * - Top rim light illuminating the glass lip rim and ribbed metal lid
 * - Soft warm ambient base for deep black contrast
 */
export function createSceneLighting(): SceneLightingBundle {
  // Deep warm black studio ambient
  const ambientLight = new THREE.AmbientLight(0x160f0a, 1.2);

  // Front-right key directional light for razor-sharp specular hotspot highlights
  const keyLight = new THREE.DirectionalLight(0xffffff, 4.4);
  keyLight.position.set(3.8, 4.5, 6.2);

  // Front-left soft fill light
  const fillLight = new THREE.DirectionalLight(0xffeedb, 1.0);
  fillLight.position.set(-3.8, 2.5, 4.0);

  // Intense rear-right orange rim light grazing the curved glass boundary
  const rimLightRight = new THREE.PointLight(0xff6600, 6.8, 18, 1.4);
  rimLightRight.position.set(3.2, 1.8, -3.2);

  // Complementary rear-left warm amber rim light grazing the left glass edge
  const rimLightLeft = new THREE.PointLight(0xff8811, 5.2, 18, 1.4);
  rimLightLeft.position.set(-3.2, 1.6, -3.0);

  // Top rim light grazing the glass lip opening and the ribbed metal lid
  const topRimLight = new THREE.PointLight(0xff9922, 3.2, 10, 1.5);
  topRimLight.position.set(0, 3.5, 0.5);

  return {
    ambientLight,
    keyLight,
    fillLight,
    rimLightRight,
    rimLightLeft,
    topRimLight,
  };
}

/**
 * updateProductAnimation(progress, model, lights, camera, fitParams)
 * 
 * Maps normalized scroll progress (0.0 to 1.0) directly to:
 * - jar position, rotation, subtle elevation
 * - metallic platform docking, orange glow, contact shadows
 * - camera choreography maintaining strict 1.5x luxury bounds
 * - lighting intensities
 * 
 * Completely reversible, zero timers.
 */
export function updateProductAnimation(
  progress: number,
  model: ProductModelBundle,
  lights: SceneLightingBundle,
  camera: THREE.PerspectiveCamera,
  fitParams: CameraFitParams
): void {
  // Frame 110 / 120 is the final hero product state.
  // The product freeze is complete from Frame 110 to Frame 120:
  // - No rotation
  // - No downward/upward movement
  // - No scaling
  // - No camera or lighting drift
  // The jar remains visually locked in the exact Frame 110 position and orientation.
  const FRAME_110_P = 110 / 120;
  const p = Math.max(0, Math.min(FRAME_110_P, progress));

  const baseDist = fitParams.baseDistance;
  const offsetX = fitParams.offsetX;

  let jarY = 0;
  let jarScale = 0.92;
  let jarRotationY = 0;
  let jarTiltX = 0;

  let pedestalScaleY = 1.0;
  let pedestalScaleXZ = 1.0;
  let pedestalOpacity = 1.0;
  let pedestalGlowIntensity = 3.4;

  let camOffsetX = 0;
  let camOffsetY = 0.12;
  let camDist = baseDist;

  const lookTarget = new THREE.Vector3(offsetX, 0, 0);

  // Frame 88 / 120 constants for precise rotation lock & vertical downward movement
  const FRAME_88_P = 88 / 120;
  const t88 = (FRAME_88_P - 0.70) / 0.15;
  const jarY_at_88 = 0.22 + Math.sin(t88 * Math.PI) * 0.05;
  const jarScale_at_88 = 0.98 + t88 * 0.02;

  // =========================================================================
  // SCROLL TIMELINE (0.0 to 1.0)
  // 0% - 10%: Floating jar elevated, calm, camera slightly wider
  // 10% - 25%: Descending toward glowing base, subtle forward camera
  // 25% - 40%: Descending continues, glowing base strengthens
  // 40% - 50%: Reaches and settles onto glowing base with physical easing
  // 50% - Frame 88: Product rotates smoothly with faster speed to front-facing NECTAR view
  // Frame 88: ROTATION ENDPOINT - rotation completely locked into front-facing view
  // Frame 88 - 110: Rotation remains locked, jar gently moves downward toward next section
  // Frame 110 - 120: PRODUCT COMPLETELY FROZEN in final hero position and orientation
  // =========================================================================

  if (p <= 0.10) {
    // 0% -> 10%: Start with jar slightly elevated above glowing pedestal, calm floating
    const t = p / 0.10;
    const hover = Math.sin(t * Math.PI) * 0.02;

    jarY = 0.58 + hover;
    jarScale = 0.90;
    jarRotationY = 0.0;
    jarTiltX = 0.015;

    pedestalScaleY = 1.0;
    pedestalScaleXZ = 1.0;
    pedestalOpacity = 0.78 + t * 0.07;
    pedestalGlowIntensity = 1.8 + t * 0.4;

    camOffsetX = 0;
    camOffsetY = 0.13;
    camDist = baseDist + 0.38; // Slightly wider camera
  } else if (p <= 0.25) {
    // 10% -> 25%: Jar slowly begins moving downward toward glowing base
    const t = (p - 0.10) / 0.15;
    const ease = t * t * (3 - 2 * t);

    jarY = 0.58 - ease * 0.30; // 0.58 -> 0.28
    jarScale = 0.90 + ease * 0.02;
    jarRotationY = Math.sin(t * 0.3) * 0.04;
    jarTiltX = 0.015 * (1 - ease);

    pedestalScaleY = 1.0;
    pedestalScaleXZ = 1.0;
    pedestalOpacity = 0.85 + ease * 0.08;
    pedestalGlowIntensity = 2.2 + ease * 0.5;

    camOffsetX = 0;
    camOffsetY = 0.13 - ease * 0.01;
    camDist = baseDist + 0.38 - ease * 0.18; // Very subtle forward movement
  } else if (p <= 0.40) {
    // 25% -> 40%: Jar continues moving downward, glowing base becomes stronger
    const t = (p - 0.25) / 0.15;
    const ease = t * t * (3 - 2 * t);

    jarY = 0.28 - ease * 0.23; // 0.28 -> 0.05
    jarScale = 0.92 + ease * 0.02;
    jarRotationY = 0.04 * (1 - ease * 0.5);
    jarTiltX = 0.0;

    pedestalScaleY = 1.0;
    pedestalScaleXZ = 1.0;
    pedestalOpacity = 0.93 + ease * 0.07;
    pedestalGlowIntensity = 2.7 + ease * 0.8; // Glowing base strengthens

    camOffsetX = 0;
    camOffsetY = 0.12;
    camDist = baseDist + 0.20 - ease * 0.15;
  } else if (p <= 0.50) {
    // 40% -> 50%: Reaches and settles onto glowing base with subtle physical easing
    const t = (p - 0.40) / 0.10;
    // Gentle physical cubic deceleration settling
    const ease = 1 - Math.pow(1 - t, 2.5);

    jarY = 0.05 * (1 - ease); // 0.05 -> 0.0 (docked)
    jarScale = 0.94 + ease * 0.02; // Settles at hero scale
    jarRotationY = 0.02 * (1 - ease);
    jarTiltX = 0.0;

    pedestalScaleY = 1.0;
    pedestalScaleXZ = 1.0;
    pedestalOpacity = 1.0;
    // Subtle physical contact pulse
    pedestalGlowIntensity = 3.5 + Math.sin(t * Math.PI) * 0.5;

    camOffsetX = 0;
    camOffsetY = 0.12;
    camDist = baseDist; // Settles into exact current hero camera position
  } else if (p <= 0.70) {
    // 50% -> 70%: Subtle upward movement, pedestal slowly flattens/recedes, gummies clearly visible
    const t = (p - 0.50) / 0.20;
    const ease = t * t * (3 - 2 * t);

    jarY = ease * 0.22; // subtle upward rise
    jarScale = 0.96 + ease * 0.02; // remains approximately same size, no sudden zoom
    jarTiltX = 0.0;

    pedestalScaleY = Math.max(0.04, 1.0 - ease * 0.96); // slowly flattens
    pedestalScaleXZ = 1.0 + ease * 0.15;
    pedestalOpacity = Math.max(0, 1.0 - ease * 1.15); // recedes
    pedestalGlowIntensity = Math.max(0, 4.0 * (1.0 - ease));

    camOffsetX = 0;
    camOffsetY = 0.12;
    camDist = baseDist;
  } else if (p <= FRAME_88_P) {
    // 70% -> Frame 88: Subtle float and label reveal up to Frame 88
    const t = (p - 0.70) / 0.15;

    jarY = 0.22 + Math.sin(t * Math.PI) * 0.05; // subtle float
    jarScale = 0.98 + t * 0.02; // jar stays in bounds
    jarTiltX = 0.0;

    pedestalScaleY = 0.04;
    pedestalOpacity = 0.0;
    pedestalGlowIntensity = 0.0;

    camOffsetX = 0;
    camOffsetY = 0.12;
    camDist = baseDist;
  } else {
    // Frame 88 -> 120 (p = 88/120 to 1.0):
    // Rotation is locked. ONLY animate jar's vertical position downward
    // toward next section with calm, deliberate, smooth easing.
    const v = (p - FRAME_88_P) / (1.0 - FRAME_88_P);
    const easeDown = v * v * (3 - 2 * v); // smoothstep: zero initial derivative at Frame 88 (no jump/snap)

    jarY = jarY_at_88 - easeDown * 0.48; // calm, deliberate downward descent
    jarScale = jarScale_at_88 + easeDown * (1.0 - jarScale_at_88);
    jarTiltX = 0.0; // rotationX completely constant (0.0)

    pedestalScaleY = 0.04;
    pedestalOpacity = 0.0;
    pedestalGlowIntensity = 0.0;

    camOffsetX = 0;
    camOffsetY = 0.12;
    camDist = baseDist;
  }

  // =========================================================================
  // SCROLL-DRIVEN ROTATION LOGIC:
  // - Frames 0% - 50%: Exactly unchanged (jarRotationY = 0.0)
  // - Frames 50% - Frame 88: Product rotates smoothly with faster speed already implemented
  // - At Frame 88 (88/120): ROTATION ENDPOINT - locks into exact front-facing NECTAR orientation
  // - Frames 88 - 120: rotationY, rotationX, rotationZ remain 100% constant (no drift, no wobble)
  // =========================================================================
  if (p > 0.50) {
    const rotP = Math.min(p, FRAME_88_P);
    const u = (rotP - 0.50) / 0.50;
    const rotEase = u * u * u * (u * (u * 6 - 15) + 10);
    const finalRot = 4.55 + Math.PI * 2;
    jarRotationY = rotEase * finalRot;
  }

  // Apply to Jar Group
  model.jarGroup.position.set(0, jarY, 0);
  model.jarGroup.scale.set(jarScale, jarScale, jarScale);
  model.jarGroup.rotation.y = jarRotationY;
  model.jarGroup.rotation.x = jarTiltX;

  // Position rootGroup at designated horizontal offset
  model.rootGroup.position.x = offsetX;

  // Apply to Platform & Glow
  model.pedestalGroup.scale.set(pedestalScaleXZ, pedestalScaleY, pedestalScaleXZ);

  const chromeMat = model.pedestalChromeMesh.material as THREE.MeshStandardMaterial;
  if (chromeMat) {
    chromeMat.opacity = pedestalOpacity;
  }
  const orangeRingMat = model.pedestalOrangeRing.material as THREE.MeshBasicMaterial;
  if (orangeRingMat) {
    orangeRingMat.opacity = 0.95 * pedestalOpacity;
  }
  const shadowMat = model.shadowPlane.material as THREE.MeshBasicMaterial;
  if (shadowMat) {
    shadowMat.opacity = 0.88 * pedestalOpacity;
  }
  model.pedestalUnderglow.intensity = pedestalGlowIntensity;

  // Cinematic Studio Lighting adjustments with scroll
  lights.ambientLight.intensity = 1.2 + p * 0.25;
  lights.keyLight.intensity = 4.4 + (p > 0.6 ? (p - 0.6) * 1.2 : 0);
  lights.rimLightRight.intensity = 6.8 + Math.sin(p * Math.PI) * 1.6 + (p > 0.8 ? 1.0 : 0);
  lights.rimLightLeft.intensity = 5.2 + Math.sin(p * Math.PI) * 1.2 + (p > 0.8 ? 0.8 : 0);
  lights.topRimLight.intensity = 3.2 + Math.sin(p * Math.PI) * 0.6;

  // Apply Camera Position & LookAt
  camera.position.set(offsetX + camOffsetX, camOffsetY, camDist);
  lookTarget.set(offsetX, jarY * 0.35, 0);
  camera.lookAt(lookTarget);
}
