import * as THREE from 'three';

/**
 * 8 High-Fidelity Artisanal Fruit Candy Prototypes for NÉCTAR
 * 
 * Saturated, premium translucent glossy gummy confections with
 * sculpted organic silhouettes, crisp edges, and depth-tuned gelatin materials:
 * 1. Alphonso Mango: Curved teardrop cheek with spine ridge and beak
 * 2. White Peach: Plump dual-lobed heart with vertical cleft furrow and top stem dip
 * 3. Wild Strawberry: Conical gumdrop with rounded shoulders and spiral seed dimples
 * 4. Ruby Raspberry: Sculpted jewel dome with distinct rounded drupelet clusters
 * 5. Sicilian Citrus: Crescent wedge with outer rind arc, converging faces & filleted rim
 * 6. Green Apple: Classic apple silhouette with top stem dip & subtle bottom lobes
 * 7. Blackberry Purple: Multi-faceted berry dome catching royal violet specular glints
 * 8. Tropical Nectar: Curved organic teardrop gem with filleted facets
 */

export interface CandyPrototype {
  id: string;
  name: string;
  geometry: THREE.BufferGeometry;
  material: THREE.MeshPhysicalMaterial;
  frontMaterial: THREE.MeshPhysicalMaterial;
  middleMaterial: THREE.MeshPhysicalMaterial;
  backMaterial: THREE.MeshPhysicalMaterial;
}

/**
 * 1. Alphonso Mango: Sculpted mango cheek with organic curved kidney silhouette,
 * spine ridge along outer curve, rounded base, and tapered beak.
 */
function createMangoGeometry(): THREE.BufferGeometry {
  const geom = new THREE.SphereGeometry(0.17, 36, 26);
  const pos = geom.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);

    // Elongated mango form
    x *= 1.42;

    // Asymmetrical cheek curvature: fuller on one side
    const cheek = 1.0 + (x > 0 ? 0.22 * Math.cos((y / 0.17) * Math.PI * 0.5) : -0.15);
    z *= cheek * 0.88;

    // Organic kidney taper towards beak at +X and +Y
    const taperY = 1.0 - (x + 0.18) * 0.32;
    y *= Math.max(0.48, taperY);

    // Spine crease along upper curve
    if (y > 0.02 && Math.abs(z) < 0.08) {
      y += 0.015 * (1.0 - Math.abs(z) / 0.08);
    }

    pos.setXYZ(i, x, y, z);
  }

  geom.computeVertexNormals();
  return geom;
}

/**
 * 2. White Peach: Plump dual-lobed heart with distinct vertical cleft furrow,
 * top stem bowl depression, and rounded base.
 */
function createPeachGeometry(): THREE.BufferGeometry {
  const geom = new THREE.SphereGeometry(0.17, 36, 26);
  const pos = geom.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);

    // Top stem indentation
    if (y > 0.08) {
      const distFromCenter = Math.sqrt(x * x + z * z);
      if (distFromCenter < 0.10) {
        y -= 0.038 * (1.0 - distFromCenter / 0.10);
      }
    }

    // Prominent vertical cleft furrow running down the front (z > 0)
    if (z > -0.02 && Math.abs(x) < 0.075) {
      const cleftDepth = 0.035 * (1.0 - Math.abs(x) / 0.075);
      z -= cleftDepth;
    }

    // Dual-lobed plump cheeks on left and right
    const lobeBulge = 1.0 + 0.18 * (Math.abs(x) / 0.17);
    z *= lobeBulge;

    // Gentle heart taper towards base
    if (y < 0) {
      const bottomTaper = 1.0 + y * 0.38;
      x *= bottomTaper;
      z *= bottomTaper;
    }

    pos.setXYZ(i, x * 1.08, y * 0.94, z);
  }

  geom.computeVertexNormals();
  return geom;
}

/**
 * 3. Wild Strawberry: Conical gumdrop with rounded shoulders, rounded apex,
 * and subtle spiral seed dimples that sparkle under specular light.
 */
function createStrawberryGeometry(): THREE.BufferGeometry {
  const geom = new THREE.SphereGeometry(0.17, 36, 26);
  const pos = geom.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);

    const normY = y / 0.17; // -1 to +1

    // Strawberry conical taper: broad shoulders around normY = 0.2, tapering down to bottom
    const coneRadius = normY > 0.2
      ? 1.0 - (normY - 0.2) * 0.65 // taper to rounded apex
      : 0.65 + (normY + 1.0) * 0.35; // gentle rounded base

    x *= Math.max(0.2, coneRadius);
    z *= Math.max(0.2, coneRadius);

    // Subtle spiral seed dimples (achene pockets)
    const angle = Math.atan2(z, x);
    const dimpleWave = Math.sin(angle * 7 + y * 24) * Math.cos(angle * 5 - y * 20);
    if (dimpleWave > 0.55) {
      const indent = (dimpleWave - 0.55) * 0.024;
      x *= (1.0 - indent);
      z *= (1.0 - indent);
    }

    pos.setXYZ(i, x * 1.05, y * 1.08, z * 1.05);
  }

  geom.computeVertexNormals();
  return geom;
}

/**
 * 4. Ruby Raspberry: Sculpted molded jewel composed of distinct rounded
 * drupelet clusters (pearls) over a rounded dome.
 */
function createRaspberryGeometry(): THREE.BufferGeometry {
  const geom = new THREE.SphereGeometry(0.165, 40, 28);
  const pos = geom.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);

    const r = Math.sqrt(x * x + y * y + z * z);
    if (r > 0.0001) {
      const nx = x / r;
      const ny = y / r;
      const nz = z / r;

      // Spherical harmonic drupelet clustering
      const theta = Math.atan2(nz, nx);
      const phi = Math.acos(Math.max(-1, Math.min(1, ny)));

      // Tight, distinct drupelet bumps
      const bump1 = Math.sin(theta * 8) * Math.sin(phi * 7);
      const bump2 = Math.cos(theta * 6 + 0.5) * Math.cos(phi * 6);
      const combined = Math.max(0, bump1 * 0.7 + bump2 * 0.3);

      const displacement = combined * 0.032;

      // Hollow/indented stem base at bottom (y < -0.12)
      let baseIndent = 0;
      if (y < -0.08) {
        baseIndent = (-y - 0.08) * 0.28;
      }

      const newR = r + displacement - baseIndent;
      pos.setXYZ(i, nx * newR, ny * newR * 1.06, nz * newR);
    }
  }

  geom.computeVertexNormals();
  return geom;
}

/**
 * 5. Sicilian Citrus: Realistic crescent segment with curved outer rind,
 * two convergent flat sides, filleted outer corners, and subtle segment lines.
 */
function createCitrusGeometry(): THREE.BufferGeometry {
  const geom = new THREE.CylinderGeometry(0.18, 0.18, 0.10, 32, 4, false, -Math.PI * 0.35, Math.PI * 0.70);
  const pos = geom.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);

    const r = Math.sqrt(x * x + z * z);
    const angle = Math.atan2(z, x);

    // Rounding the sharp edges of the wedge
    const normalizedAngle = (angle + Math.PI * 0.35) / (Math.PI * 0.70); // 0 to 1
    const edgeDist = Math.min(normalizedAngle, 1.0 - normalizedAngle);

    // Plump pillowing in the center of the segment
    const pillow = Math.sin(edgeDist * Math.PI) * Math.sin((r / 0.18) * Math.PI);
    y += (y > 0 ? 0.022 : -0.022) * pillow;

    // Smooth outer rind curve
    if (r > 0.16) {
      const rindBulge = Math.sin((y / 0.05) * Math.PI * 0.5);
      x *= 1.0 + (1.0 - Math.abs(rindBulge)) * 0.04;
      z *= 1.0 + (1.0 - Math.abs(rindBulge)) * 0.04;
    }

    pos.setXYZ(i, x * 1.04, y * 0.95, z * 0.96);
  }

  geom.computeVertexNormals();
  return geom;
}

/**
 * 6. Green Apple: Sculpted apple silhouette with top stem dip,
 * broader rounded shoulders, and subtle five-fold bottom lobes.
 */
function createGreenAppleGeometry(): THREE.BufferGeometry {
  const geom = new THREE.SphereGeometry(0.165, 36, 26);
  const pos = geom.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);

    // Apple profile: wider shoulders, subtle taper towards base
    const normY = y / 0.165; // -1 to +1

    // Top stem indentation
    if (normY > 0.6) {
      const distFromCenter = Math.sqrt(x * x + z * z);
      if (distFromCenter < 0.10) {
        y -= 0.042 * (1.0 - distFromCenter / 0.10);
      }
    }

    // Bottom calyx indentation
    if (normY < -0.7) {
      const distFromCenter = Math.sqrt(x * x + z * z);
      if (distFromCenter < 0.08) {
        y += 0.030 * (1.0 - distFromCenter / 0.08);
      }
    }

    // Five subtle organic bottom lobes
    if (normY < 0.0) {
      const angle = Math.atan2(z, x);
      const fiveLobes = Math.cos(angle * 5) * 0.016 * (-normY);
      x *= 1.0 + fiveLobes;
      z *= 1.0 + fiveLobes;
    }

    // Broad upper shoulders
    const shoulderWidth = normY > 0.1 ? 1.0 + (normY - 0.1) * 0.22 : 1.0 - (-normY) * 0.15;
    x *= shoulderWidth;
    z *= shoulderWidth;

    pos.setXYZ(i, x * 1.06, y * 0.94, z * 1.06);
  }

  geom.computeVertexNormals();
  return geom;
}

/**
 * 7. Blackberry Purple: Sculpted rounded dome with multi-faceted berry nodules
 * catching deep royal violet specular glints.
 */
function createPurpleBerryGeometry(): THREE.BufferGeometry {
  const geom = new THREE.SphereGeometry(0.165, 36, 26);
  const pos = geom.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);

    const r = Math.sqrt(x * x + y * y + z * z);
    if (r > 0.0001) {
      const nx = x / r;
      const ny = y / r;
      const nz = z / r;

      const theta = Math.atan2(nz, nx);
      const phi = Math.acos(Math.max(-1, Math.min(1, ny)));

      // Plump hexagonal berry facets
      const facet = Math.sin(theta * 7 + phi * 2) * Math.cos(phi * 6);
      const bump = Math.max(0, facet) * 0.026;

      const newR = r + bump;
      pos.setXYZ(i, nx * newR * 1.04, ny * newR * 0.96, nz * newR * 1.04);
    }
  }

  geom.computeVertexNormals();
  return geom;
}

/**
 * 8. Tropical Nectar Gem: Organic curved teardrop gem with filleted facets,
 * catching bright golden nectar glints.
 */
function createMixedFruitGeometry(): THREE.BufferGeometry {
  const geom = new THREE.SphereGeometry(0.165, 36, 26);
  const pos = geom.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);

    // Teardrop / drop jewel with curved waist
    x *= 1.38;
    const waist = Math.cos((x / 0.24) * Math.PI * 0.5);
    z = z * 0.92 - waist * 0.038;
    y = y * (1.0 + waist * 0.16) * 0.90;

    // Gentle facet along spine
    if (Math.abs(z) < 0.06 && y > 0) {
      y += 0.016 * (1.0 - Math.abs(z) / 0.06);
    }

    pos.setXYZ(i, x, y, z);
  }

  geom.computeVertexNormals();
  return geom;
}

/**
 * Helper to build translucent, glossy, gelatin-like gummy materials with
 * controlled subsurface light transmission and layer-tuned specular highlights:
 * - FRONT LAYER: Ultra-glossy, razor-sharp specular glints, pristine clarity
 * - MIDDLE LAYER: Saturated fruit core, warm subsurface transmission
 * - BACK LAYER: Deep jewel tones, natural atmospheric glass depth
 *
 * VISIBILITY PASS: roughness lowered, clearcoat/specular raised, and
 * emissiveIntensity boosted across all three depth tiers so every candy
 * (not just the frontmost ones) reads with a crisp, glossy, "lit from
 * within" pop instead of a flat/dull look — matching the brighter,
 * more saturated reference look. Geometry, colors, and the front/middle/back
 * tiering concept are unchanged; only these surface-response values shifted.
 */
function createGummyMaterialVariant(
  colorHex: number,
  emissiveHex: number,
  layer: 'front' | 'middle' | 'back'
): THREE.MeshPhysicalMaterial {
  if (layer === 'front') {
    return new THREE.MeshPhysicalMaterial({
      color: colorHex,
      roughness: 0.09, // toned down from 0.07 (previous pass was too glassy/sparkly)
      metalness: 0.01,
      ior: 1.48, // Pectin / gelatin optical index
      specularIntensity: 2.5, // toned down from 3.0
      specularColor: new THREE.Color(0xffffff),
      clearcoat: 1.0, // High-gloss confectionery glaze
      clearcoatRoughness: 0.04, // toned down from 0.03
      emissive: new THREE.Color(emissiveHex),
      emissiveIntensity: 0.20, // toned down from 0.30 — less "lit up", still a soft glow
      transparent: false, // Critical for Three.js transmission pass buffer inclusion
      depthWrite: true,
    });
  }

  if (layer === 'middle') {
    return new THREE.MeshPhysicalMaterial({
      color: colorHex,
      roughness: 0.12, // toned down from 0.10
      metalness: 0.01,
      ior: 1.48,
      specularIntensity: 2.1, // toned down from 2.4
      specularColor: new THREE.Color(0xffffff),
      clearcoat: 0.92, // toned down from 0.96
      clearcoatRoughness: 0.06, // toned down from 0.05
      emissive: new THREE.Color(emissiveHex),
      emissiveIntensity: 0.16, // toned down from 0.24
      transparent: false,
      depthWrite: true,
    });
  }

  // Back Layer
  return new THREE.MeshPhysicalMaterial({
    color: colorHex,
    roughness: 0.15, // toned down from 0.13
    metalness: 0.01,
    ior: 1.48,
    specularIntensity: 1.7, // toned down from 2.0
    specularColor: new THREE.Color(0xffffff),
    clearcoat: 0.80, // toned down from 0.85
    clearcoatRoughness: 0.09, // toned down from 0.08
    emissive: new THREE.Color(emissiveHex),
    emissiveIntensity: 0.12, // toned down from 0.18
    transparent: false,
    depthWrite: true,
  });
}

/**
 * Builds and caches the 8 reusable prototypes with high-quality geometries
 * and layer-tuned materials
 */
let cachedPrototypes: Record<string, CandyPrototype> | null = null;

export function getCandyPrototypes(): Record<string, CandyPrototype> {
  if (cachedPrototypes) return cachedPrototypes;

  const mangoGeom = createMangoGeometry();
  const peachGeom = createPeachGeometry();
  const strawberryGeom = createStrawberryGeometry();
  const raspberryGeom = createRaspberryGeometry();
  const citrusGeom = createCitrusGeometry();
  const greenAppleGeom = createGreenAppleGeometry();
  const purpleBerryGeom = createPurpleBerryGeometry();
  const mixedFruitGeom = createMixedFruitGeometry();

  cachedPrototypes = {
    // 1. Mango (vibrant Alphonso mango orange)
    mango: {
      id: 'mango',
      name: 'Alphonso Mango',
      geometry: mangoGeom,
      material: createGummyMaterialVariant(0xff8a00, 0xff5500, 'front'),
      frontMaterial: createGummyMaterialVariant(0xff8a00, 0xff5500, 'front'),
      middleMaterial: createGummyMaterialVariant(0xff8400, 0xee4b00, 'middle'),
      backMaterial: createGummyMaterialVariant(0xeb7800, 0xd94000, 'back'),
    },
    // 2. Peach (juicy coral pink peach)
    peach: {
      id: 'peach',
      name: 'White Peach',
      geometry: peachGeom,
      material: createGummyMaterialVariant(0xff6e5c, 0xee3726, 'front'),
      frontMaterial: createGummyMaterialVariant(0xff6e5c, 0xee3726, 'front'),
      middleMaterial: createGummyMaterialVariant(0xf56452, 0xdb2d1c, 'middle'),
      backMaterial: createGummyMaterialVariant(0xeb5544, 0xc42010, 'back'),
    },
    // 3. Strawberry (vivid ruby red)
    strawberry: {
      id: 'strawberry',
      name: 'Wild Strawberry',
      geometry: strawberryGeom,
      material: createGummyMaterialVariant(0xdf162c, 0xb50a1e, 'front'),
      frontMaterial: createGummyMaterialVariant(0xdf162c, 0xb50a1e, 'front'),
      middleMaterial: createGummyMaterialVariant(0xd01024, 0xa30818, 'middle'),
      backMaterial: createGummyMaterialVariant(0xbd0c1e, 0x8f0614, 'back'),
    },
    // 4. Raspberry (rich royal raspberry magenta)
    raspberry: {
      id: 'raspberry',
      name: 'Ruby Raspberry',
      geometry: raspberryGeom,
      material: createGummyMaterialVariant(0xc2185b, 0x940a3f, 'front'),
      frontMaterial: createGummyMaterialVariant(0xc2185b, 0x940a3f, 'front'),
      middleMaterial: createGummyMaterialVariant(0xb21451, 0x820735, 'middle'),
      backMaterial: createGummyMaterialVariant(0xa30f48, 0x73052d, 'back'),
    },
    // 5. Citrus (sunny golden yellow-orange)
    citrus: {
      id: 'citrus',
      name: 'Sicilian Citrus',
      geometry: citrusGeom,
      material: createGummyMaterialVariant(0xffaa00, 0xff7a00, 'front'),
      frontMaterial: createGummyMaterialVariant(0xffaa00, 0xff7a00, 'front'),
      middleMaterial: createGummyMaterialVariant(0xf5a000, 0xeb6e00, 'middle'),
      backMaterial: createGummyMaterialVariant(0xe89500, 0xd46000, 'back'),
    },
    // 6. Green Apple (crisp Granny Smith apple green)
    greenApple: {
      id: 'greenApple',
      name: 'Green Apple',
      geometry: greenAppleGeom,
      material: createGummyMaterialVariant(0x38a832, 0x1f751a, 'front'),
      frontMaterial: createGummyMaterialVariant(0x38a832, 0x1f751a, 'front'),
      middleMaterial: createGummyMaterialVariant(0x32992d, 0x1a6616, 'middle'),
      backMaterial: createGummyMaterialVariant(0x2b8726, 0x155412, 'back'),
    },
    // 7. Purple Berry (royal blackberry purple)
    purpleBerry: {
      id: 'purpleBerry',
      name: 'Blackberry Purple',
      geometry: purpleBerryGeom,
      material: createGummyMaterialVariant(0x791ea0, 0x4f0f6e, 'front'),
      frontMaterial: createGummyMaterialVariant(0x791ea0, 0x4f0f6e, 'front'),
      middleMaterial: createGummyMaterialVariant(0x6e1991, 0x440b61, 'middle'),
      backMaterial: createGummyMaterialVariant(0x621582, 0x3a0854, 'back'),
    },
    // 8. Mixed Fruit (bright golden tropical nectar)
    mixedFruit: {
      id: 'mixedFruit',
      name: 'Tropical Nectar',
      geometry: mixedFruitGeom,
      material: createGummyMaterialVariant(0xffbe00, 0xff9000, 'front'),
      frontMaterial: createGummyMaterialVariant(0xffbe00, 0xff9000, 'front'),
      middleMaterial: createGummyMaterialVariant(0xf2b200, 0xe07f00, 'middle'),
      backMaterial: createGummyMaterialVariant(0xe5a600, 0xcc7200, 'back'),
    },
  };

  return cachedPrototypes;
}