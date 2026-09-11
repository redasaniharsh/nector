import * as THREE from 'three';
import {
  getCandyPrototypes,
  CandyPrototype,
} from './candyGeometries';

export interface ProductModelBundle {
  rootGroup: THREE.Group;
  jarGroup: THREE.Group;
  glassMesh: THREE.Mesh;
  lidMesh: THREE.Mesh;
  labelMesh: THREE.Mesh;
  candiesGroup: THREE.Group;
  pedestalGroup: THREE.Group;
  pedestalChromeMesh: THREE.Mesh;
  pedestalOrangeRing: THREE.Mesh;
  pedestalUnderglow: THREE.PointLight;
  shadowPlane: THREE.Mesh;
}

/**
 * Creates high-resolution luxury paper label texture
 * 'NÉCTAR — LUXURY FRUIT CONFECTION'
 */
function createLabelTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const x = 90;
    const y = 70;
    const w = canvas.width - 180;
    const h = canvas.height - 140;
    const r = 24;

    // Solid dark charcoal satin label background
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();

    ctx.fillStyle = 'rgba(10, 7, 5, 0.98)';
    ctx.fill();

    // Outer refined gold border
    ctx.strokeStyle = 'rgba(255, 142, 34, 0.90)';
    ctx.lineWidth = 5;
    ctx.stroke();

    // Inner delicate gold hairline frame
    ctx.beginPath();
    ctx.rect(x + 22, y + 22, w - 44, h - 44);
    ctx.strokeStyle = 'rgba(255, 142, 34, 0.38)';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Botanical gold crest dot
    ctx.fillStyle = '#ff8a1e';
    ctx.beginPath();
    ctx.arc(canvas.width / 2, y + 105, 9, 0, Math.PI * 2);
    ctx.fill();

    // Brand Title: "NÉCTAR"
    ctx.font = '900 170px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#f8f2eb';
    ctx.fillText('NÉCTAR', canvas.width / 2, y + 270);

    // Accent fruit nectar dot
    const nectarWidth = ctx.measureText('NÉCTAR').width;
    ctx.fillStyle = '#ff8a1e';
    ctx.beginPath();
    ctx.arc(canvas.width / 2 + nectarWidth / 2 + 18, y + 310, 11, 0, Math.PI * 2);
    ctx.fill();

    // Subtitle: "LUXURY FRUIT CONFECTION"
    ctx.font = '700 46px "JetBrains Mono", monospace';
    ctx.fillStyle = '#ff8a1e';
    ctx.letterSpacing = '4px';
    ctx.fillText('LUXURY FRUIT CONFECTION', canvas.width / 2, y + 430);

    // Divider Line
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 360, y + 510);
    ctx.lineTo(canvas.width / 2 + 360, y + 510);
    ctx.strokeStyle = 'rgba(200, 180, 160, 0.45)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Flavor Varieties
    ctx.font = '600 38px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#b8a898';
    ctx.fillText('MANGO • PEACH • BERRY • CITRUS • APPLE', canvas.width / 2, y + 590);

    // Weight & Pectin Certification
    ctx.font = '600 32px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(248, 242, 235, 0.82)';
    ctx.fillText('450G NET WT  //  100% ARTISANAL PECTIN', canvas.width / 2, y + 680);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

/**
 * Creates procedural fine vertical knurling bump texture for the dark ribbed metal lid
 */
function createLidRibbedBumpMap(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const ribs = 64;
    const ribWidth = canvas.width / ribs;

    for (let i = 0; i < ribs; i++) {
      const startX = i * ribWidth;
      const grad = ctx.createLinearGradient(startX, 0, startX + ribWidth, 0);
      grad.addColorStop(0, '#222222');
      grad.addColorStop(0.35, '#ffffff');
      grad.addColorStop(0.65, '#ffffff');
      grad.addColorStop(1, '#222222');

      ctx.fillStyle = grad;
      ctx.fillRect(startX, 0, ribWidth, canvas.height);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Creates soft radial contact shadow texture for the chrome platform on the dark floor
 */
function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.clearRect(0, 0, 512, 512);

    const grad = ctx.createRadialGradient(256, 256, 40, 256, 256, 250);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.98)');
    grad.addColorStop(0.35, 'rgba(0, 0, 0, 0.85)');
    grad.addColorStop(0.65, 'rgba(12, 7, 3, 0.45)');
    grad.addColorStop(0.85, 'rgba(255, 110, 20, 0.08)'); // Subtle warm amber floor bounce
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

/**
 * Procedural lathe profile for a fully solid, watertight apothecary glass jar:
 * - Continuous, smooth, unbroken cylindrical body with no gaps or holes
 * - Solid crystal glass base puck (0.32 units thick)
 * - Tapered shoulder curving into a defined neck
 * - Visible, smooth, thick rounded rim collar at the top opening
 * - Continuous inner wall forming a spacious cavity filled with gummies
 */
function createJarLatheGeometry(): THREE.BufferGeometry {
  const points: THREE.Vector2[] = [];

  // 1. Solid crystal bottom base (center to outer edge)
  points.push(new THREE.Vector2(0.0, -1.20));
  points.push(new THREE.Vector2(0.88, -1.20)); // Flat base
  points.push(new THREE.Vector2(0.97, -1.17)); // Soft lower chamfer
  points.push(new THREE.Vector2(1.02, -1.10)); // Rounded heel
  points.push(new THREE.Vector2(1.03, -1.00)); // Base transition

  // 2. Continuous, smooth cylindrical outer wall
  points.push(new THREE.Vector2(1.03, -0.40));
  points.push(new THREE.Vector2(1.03, 0.20));
  points.push(new THREE.Vector2(1.03, 0.60));

  // 3. Elegant apothecary shoulder curve
  points.push(new THREE.Vector2(1.02, 0.74));
  points.push(new THREE.Vector2(0.98, 0.88));
  points.push(new THREE.Vector2(0.90, 1.00));
  points.push(new THREE.Vector2(0.80, 1.09));
  points.push(new THREE.Vector2(0.74, 1.14));

  // 4. Vertical neck
  points.push(new THREE.Vector2(0.73, 1.16));
  points.push(new THREE.Vector2(0.73, 1.24));

  // 5. Visible thick glass rim at the top opening (smooth rounded glass bead collar)
  points.push(new THREE.Vector2(0.76, 1.26));
  points.push(new THREE.Vector2(0.77, 1.29));
  points.push(new THREE.Vector2(0.74, 1.31)); // Top rim outer crown
  points.push(new THREE.Vector2(0.68, 1.32)); // Top rim apex
  points.push(new THREE.Vector2(0.62, 1.31)); // Top rim inner crown
  points.push(new THREE.Vector2(0.59, 1.28)); // Inner rim lip
  points.push(new THREE.Vector2(0.58, 1.24));

  // 6. Inner neck wall
  points.push(new THREE.Vector2(0.58, 1.15));

  // 7. Inner shoulder (thick glass corner)
  points.push(new THREE.Vector2(0.66, 1.04));
  points.push(new THREE.Vector2(0.76, 0.90));
  points.push(new THREE.Vector2(0.85, 0.74));
  points.push(new THREE.Vector2(0.90, 0.58));

  // 8. Inner cylinder cavity wall (thickness ~0.13 units)
  points.push(new THREE.Vector2(0.90, 0.0));
  points.push(new THREE.Vector2(0.90, -0.72));

  // 9. Thick crystal glass bottom floor inside cavity
  points.push(new THREE.Vector2(0.85, -0.82));
  points.push(new THREE.Vector2(0.68, -0.88));
  points.push(new THREE.Vector2(0.0, -0.88)); // Solid interior base

  const geometry = new THREE.LatheGeometry(points, 72);
  geometry.computeVertexNormals();
  return geometry;
}

/**
 * Creates dark brown/black ribbed metal lid geometry
 * Sits securely over the neck & rim, sealing the top opening completely
 */
function createLidGeometry(): THREE.BufferGeometry {
  const points: THREE.Vector2[] = [];

  // Sits over the neck from y = 1.22 to 1.46
  points.push(new THREE.Vector2(0.0, 1.46)); // Top center
  points.push(new THREE.Vector2(0.76, 1.46));
  points.push(new THREE.Vector2(0.80, 1.43)); // Soft top bevel
  points.push(new THREE.Vector2(0.80, 1.21)); // Ribbed side skirt
  points.push(new THREE.Vector2(0.78, 1.19)); // Bottom bevel
  points.push(new THREE.Vector2(0.75, 1.21)); // Inner skirt
  points.push(new THREE.Vector2(0.75, 1.42)); // Underside
  points.push(new THREE.Vector2(0.0, 1.42));

  const geometry = new THREE.LatheGeometry(points, 64);
  geometry.computeVertexNormals();
  return geometry;
}

/**
 * Constructs the complete 3D product model:
 * - Photorealistic clear apothecary glass jar
 * - Sharp bright specular highlights & edge refraction
 * - Watertight continuous geometry with no gaps
 * - Translucent glossy fruit candies filled fully to the top
 * - Metallic chrome base platform with soft shadow and warm orange under-glow
 */
export function createProductModel(isMobile: boolean = false): ProductModelBundle {
  const rootGroup = new THREE.Group();
  rootGroup.name = 'product-root';

  const jarGroup = new THREE.Group();
  jarGroup.name = 'jar-assembly';
  rootGroup.add(jarGroup);

  // =========================================================================
  // 1. CANDIES GROUP: FRUIT_CANDY_CONTENT
  // Physically placed inside the glass container, filling bottom 60-70%
  // Leaves transparent empty space above the candies in upper jar
  // Reuses 8 sculpted organic prototypes: mango, peach, strawberry, raspberry,
  // citrus, green apple, purple berry, mixed fruit gem
  // =========================================================================
  const candiesGroup = new THREE.Group();
  candiesGroup.name = 'FRUIT_CANDY_CONTENT';
  candiesGroup.renderOrder = 0; // Opaque pass rendered cleanly into transmission target
  jarGroup.add(candiesGroup);

  const prototypes = getCandyPrototypes();

  // -------------------------------------------------------------------------
  // DEDICATED LIGHTING FOR TRANSLUCENT GUMMY FORMS
  // Parented directly inside jarGroup so they rotate and move in lockstep with the jar:
  // 1. Front Specular Highlight Light (crisp pinpoint glints on gelatin glaze)
  // 2. Internal Amber Subsurface Scatter Light (soft translucent core glow)
  // 3. Left Flank Rim Separator (defines outer silhouettes against dark interior)
  // 4-6. Added to match the now fully-volumetric candy spread (previously the
  //    candies only occupied a thin front z-band, so 3 front-biased lights
  //    were enough; now candies fill front, sides, back and top, so extra
  //    coverage lights were added — all still candy-only lights parented to
  //    jarGroup, no scene lighting or camera code touched).
  // -------------------------------------------------------------------------
  const gummyFrontSpecularLight = new THREE.PointLight(0xfff7ee, 1.9, 5.2, 1.5);
  gummyFrontSpecularLight.name = 'gummy-specular-light';
  gummyFrontSpecularLight.position.set(0.45, 0.65, 1.60);
  jarGroup.add(gummyFrontSpecularLight);

  const gummySubsurfaceGlow = new THREE.PointLight(0xff8a10, 1.5, 3.6, 1.4);
  gummySubsurfaceGlow.name = 'gummy-subsurface-glow';
  gummySubsurfaceGlow.position.set(0.0, -0.08, 0.08);
  jarGroup.add(gummySubsurfaceGlow);

  const gummyFlankAccent = new THREE.PointLight(0xffeedd, 1.2, 4.2, 1.7);
  gummyFlankAccent.name = 'gummy-flank-accent';
  gummyFlankAccent.position.set(-0.75, 0.25, 1.10);
  jarGroup.add(gummyFlankAccent);

  const gummyRightFlankAccent = new THREE.PointLight(0xffeedd, 1.1, 4.0, 1.7);
  gummyRightFlankAccent.name = 'gummy-right-flank-accent';
  gummyRightFlankAccent.position.set(0.75, 0.15, 0.8);
  jarGroup.add(gummyRightFlankAccent);

  const gummyBackRimLight = new THREE.PointLight(0xffd9b0, 1.3, 4.4, 1.6);
  gummyBackRimLight.name = 'gummy-back-rim-light';
  gummyBackRimLight.position.set(0, 0.35, -1.1);
  jarGroup.add(gummyBackRimLight);

  const gummyTopDownFill = new THREE.PointLight(0xfff2e0, 1.2, 3.8, 1.6);
  gummyTopDownFill.name = 'gummy-top-down-fill';
  gummyTopDownFill.position.set(0, 1.0, 0.2);
  jarGroup.add(gummyTopDownFill);

  const gummyLowerFill = new THREE.PointLight(0xff9a3d, 1.0, 3.2, 1.6);
  gummyLowerFill.name = 'gummy-lower-fill';
  gummyLowerFill.position.set(0, -0.65, 0.3);
  jarGroup.add(gummyLowerFill);

  // -------------------------------------------------------------------------
  // DEPTH LAYER 1: FRONT-FACING HERO CANDIES (Ultra-sharp, high specular)
  // Continuous volumetric fill nearest the front glass, generated with wider
  // (0.29-unit) minimum center-to-center spacing so each piece keeps a visible
  // crevice/highlight around it instead of fusing into neighbors.
  // -------------------------------------------------------------------------
  const heroFrontCandies: {
    type: keyof typeof prototypes;
    pos: [number, number, number];
    rot: [number, number, number];
    scale: number;
  }[] = [
    { type: 'raspberry', pos: [0.03, -0.22, 0.70], rot: [0.25, 2.41, 0.20], scale: 0.95 },
    { type: 'mixedFruit', pos: [0.10, 0.05, 0.70], rot: [-0.23, 5.85, -0.33], scale: 0.91 },
    { type: 'purpleBerry', pos: [0.19, -0.45, 0.65], rot: [0.40, 0.76, 0.24], scale: 1.05 },
    { type: 'strawberry', pos: [-0.24, -0.71, 0.63], rot: [0.01, 0.81, 0.22], scale: 0.94 },
    { type: 'peach', pos: [0.29, 0.33, 0.63], rot: [0.05, 3.64, 0.02], scale: 0.92 },
    { type: 'greenApple', pos: [-0.39, 0.24, 0.59], rot: [-0.33, 5.53, -0.08], scale: 1.04 },
    { type: 'greenApple', pos: [0.00, 0.44, 0.59], rot: [-0.30, 1.72, 0.23], scale: 1.06 },
    { type: 'purpleBerry', pos: [0.02, -0.64, 0.54], rot: [-0.05, 0.03, -0.14], scale: 1.03 },
    { type: 'mixedFruit', pos: [-0.26, -0.46, 0.53], rot: [-0.35, 5.39, 0.10], scale: 0.99 },
    { type: 'purpleBerry', pos: [0.48, -0.71, 0.51], rot: [-0.14, 2.09, -0.27], scale: 0.92 },
    { type: 'citrus', pos: [-0.22, -0.19, 0.50], rot: [0.00, 2.95, 0.21], scale: 0.91 },
    { type: 'citrus', pos: [0.50, -0.12, 0.48], rot: [0.29, 3.10, 0.12], scale: 1.01 },
    { type: 'peach', pos: [-0.08, 0.04, 0.47], rot: [-0.03, 4.25, 0.24], scale: 1.04 },
    { type: 'greenApple', pos: [0.31, 0.11, 0.47], rot: [-0.40, 2.56, -0.24], scale: 0.94 },
    { type: 'purpleBerry', pos: [-0.46, -0.68, 0.45], rot: [0.38, 0.30, -0.07], scale: 1.04 },
    { type: 'strawberry', pos: [0.41, -0.45, 0.45], rot: [-0.28, 0.51, 0.37], scale: 1.00 },
    { type: 'citrus', pos: [-0.26, 0.50, 0.43], rot: [-0.29, 0.54, -0.22], scale: 1.01 },
    { type: 'mango', pos: [-0.49, -0.33, 0.43], rot: [-0.35, 0.53, -0.25], scale: 0.92 },
    { type: 'mixedFruit', pos: [0.37, 0.49, 0.39], rot: [0.09, 4.82, -0.07], scale: 1.00 },
    { type: 'strawberry', pos: [-0.48, -0.03, 0.38], rot: [0.22, 0.11, 0.27], scale: 1.05 },
    { type: 'strawberry', pos: [0.14, -0.08, 0.37], rot: [0.09, 1.47, 0.04], scale: 0.91 },
    { type: 'purpleBerry', pos: [0.21, -0.71, 0.36], rot: [0.03, 4.10, -0.28], scale: 0.97 },
    { type: 'raspberry', pos: [0.58, 0.25, 0.35], rot: [0.01, 2.58, 0.17], scale: 0.93 },
    { type: 'peach', pos: [0.63, -0.30, 0.32], rot: [0.30, 2.21, 0.14], scale: 0.92 },
    { type: 'mango', pos: [-0.53, 0.43, 0.30], rot: [-0.08, 3.01, 0.01], scale: 1.02 },
    { type: 'mixedFruit', pos: [-0.06, -0.47, 0.30], rot: [0.07, 3.60, 0.15], scale: 1.00 },
    { type: 'strawberry', pos: [0.22, -0.33, 0.30], rot: [0.28, 1.61, -0.34], scale: 1.04 },
    { type: 'raspberry', pos: [0.06, 0.60, 0.30], rot: [0.24, 5.71, -0.06], scale: 1.00 },
    { type: 'mango', pos: [0.21, 0.27, 0.28], rot: [0.12, 4.19, -0.36], scale: 1.04 },
    { type: 'greenApple', pos: [-0.36, -0.46, 0.22], rot: [0.13, 0.09, -0.27], scale: 0.90 },
  ];

  heroFrontCandies.forEach((cfg) => {
    const proto = prototypes[cfg.type];
    const mesh = new THREE.Mesh(proto.geometry, proto.frontMaterial);
    mesh.position.set(...cfg.pos);
    mesh.rotation.set(...cfg.rot);
    mesh.scale.set(cfg.scale, cfg.scale, cfg.scale);
    candiesGroup.add(mesh);
  });

  // -------------------------------------------------------------------------
  // DEPTH LAYER 2: MIDDLE-LAYER CANDIES (Saturated fruit core)
  // Same continuous volumetric point set, next tier by depth, using the
  // mid-tone material for natural falloff through the glass.
  // -------------------------------------------------------------------------
  const middleLayerCandies: {
    type: keyof typeof prototypes;
    pos: [number, number, number];
    rot: [number, number, number];
    scale: number;
  }[] = [
    { type: 'citrus', pos: [-0.07, 0.25, 0.21], rot: [0.13, 2.26, 0.08], scale: 0.98 },
    { type: 'raspberry', pos: [-0.68, -0.18, 0.20], rot: [-0.34, 1.02, 0.02], scale: 0.92 },
    { type: 'mango', pos: [-0.17, -0.05, 0.20], rot: [0.25, 0.45, 0.12], scale: 0.99 },
    { type: 'mango', pos: [0.48, -0.71, 0.19], rot: [0.20, 5.56, 0.16], scale: 0.92 },
    { type: 'citrus', pos: [0.68, -0.53, 0.18], rot: [0.32, 1.35, 0.00], scale: 1.00 },
    { type: 'mango', pos: [-0.02, -0.71, 0.17], rot: [-0.20, 0.24, -0.17], scale: 0.98 },
    { type: 'mango', pos: [-0.65, -0.71, 0.17], rot: [0.28, 1.22, -0.10], scale: 0.92 },
    { type: 'raspberry', pos: [-0.28, 0.58, 0.13], rot: [-0.05, 3.57, 0.26], scale: 0.95 },
    { type: 'mixedFruit', pos: [-0.67, -0.44, 0.13], rot: [-0.35, 1.69, 0.31], scale: 1.03 },
    { type: 'strawberry', pos: [-0.35, -0.71, 0.12], rot: [-0.05, 3.95, -0.14], scale: 1.04 },
    { type: 'raspberry', pos: [0.54, -0.12, 0.10], rot: [-0.17, 4.14, 0.24], scale: 1.06 },
    { type: 'purpleBerry', pos: [0.69, 0.11, 0.09], rot: [0.31, 0.86, 0.03], scale: 0.96 },
    { type: 'mixedFruit', pos: [-0.40, 0.20, 0.08], rot: [0.13, 0.49, 0.31], scale: 1.05 },
    { type: 'peach', pos: [-0.19, -0.29, 0.07], rot: [0.15, 2.24, 0.16], scale: 1.06 },
    { type: 'citrus', pos: [0.34, -0.49, 0.07], rot: [0.16, 2.46, 0.06], scale: 1.01 },
    { type: 'peach', pos: [0.43, 0.21, 0.05], rot: [0.15, 1.29, -0.18], scale: 0.92 },
    { type: 'purpleBerry', pos: [0.19, -0.26, 0.04], rot: [0.12, 1.33, 0.37], scale: 0.90 },
    { type: 'greenApple', pos: [-0.69, 0.21, 0.03], rot: [-0.20, 5.75, -0.20], scale: 0.99 },
    { type: 'citrus', pos: [0.00, 0.51, 0.01], rot: [-0.32, 5.76, -0.13], scale: 0.98 },
    { type: 'mixedFruit', pos: [0.56, 0.53, 0.00], rot: [-0.12, 4.12, -0.26], scale: 1.01 },
    { type: 'strawberry', pos: [-0.57, -0.03, 0.00], rot: [-0.08, 4.66, 0.19], scale: 1.01 },
    { type: 'mixedFruit', pos: [0.22, 0.06, -0.02], rot: [-0.17, 1.55, -0.28], scale: 1.02 },
    { type: 'purpleBerry', pos: [-0.63, 0.47, -0.02], rot: [0.20, 3.15, -0.09], scale: 1.04 },
    { type: 'strawberry', pos: [0.61, -0.36, -0.02], rot: [0.13, 0.09, -0.16], scale: 1.04 },
    { type: 'strawberry', pos: [-0.32, -0.48, -0.07], rot: [-0.10, 3.06, -0.01], scale: 1.00 },
    { type: 'strawberry', pos: [0.31, -0.71, -0.08], rot: [0.17, 0.27, 0.22], scale: 1.02 },
    { type: 'peach', pos: [0.70, -0.11, -0.14], rot: [0.03, 1.11, -0.02], scale: 0.97 },
    { type: 'peach', pos: [0.29, 0.60, -0.15], rot: [-0.29, 3.17, -0.17], scale: 0.93 },
    { type: 'strawberry', pos: [-0.13, 0.04, -0.15], rot: [0.35, 1.18, -0.11], scale: 0.90 },
    { type: 'mango', pos: [0.69, -0.69, -0.15], rot: [0.34, 0.41, 0.04], scale: 0.98 },
    { type: 'raspberry', pos: [0.05, -0.60, -0.17], rot: [-0.02, 2.29, -0.02], scale: 0.97 },
    { type: 'peach', pos: [-0.25, 0.28, -0.17], rot: [-0.07, 5.05, -0.13], scale: 1.01 },
    { type: 'raspberry', pos: [-0.63, -0.71, -0.17], rot: [0.11, 1.98, -0.29], scale: 1.02 },
    { type: 'mixedFruit', pos: [0.02, -0.33, -0.19], rot: [-0.29, 2.21, -0.26], scale: 1.03 },
    { type: 'greenApple', pos: [-0.38, 0.53, -0.19], rot: [0.15, 1.41, 0.07], scale: 1.01 },
    { type: 'raspberry', pos: [-0.64, -0.44, -0.21], rot: [0.39, 0.13, -0.05], scale: 0.96 },
    { type: 'mango', pos: [-0.33, -0.71, -0.22], rot: [-0.38, 5.44, 0.00], scale: 0.91 },
  ];

  middleLayerCandies.forEach((cfg) => {
    const proto = prototypes[cfg.type];
    const mesh = new THREE.Mesh(proto.geometry, proto.middleMaterial);
    mesh.position.set(...cfg.pos);
    mesh.rotation.set(...cfg.rot);
    mesh.scale.set(cfg.scale, cfg.scale, cfg.scale);
    candiesGroup.add(mesh);
  });

  // -------------------------------------------------------------------------
  // DEPTH LAYER 3: BACK & REAR CANDIES (Natural atmospheric glass depth)
  // The remaining candies furthest from the viewer within the same
  // volumetric point set, completing the full 360-degree cylindrical fill.
  // Mobile uses a reduced count for performance.
  // -------------------------------------------------------------------------
  const backLayerCandies: {
    type: keyof typeof prototypes;
    pos: [number, number, number];
    rot: [number, number, number];
    scale: number;
  }[] = isMobile
    ? [
    { type: 'peach', pos: [0.47, -0.26, -0.24], rot: [-0.25, 2.96, 0.25], scale: 1.05 },
    { type: 'purpleBerry', pos: [0.14, -0.07, -0.25], rot: [0.20, 2.35, -0.06], scale: 0.92 },
    { type: 'peach', pos: [0.29, 0.27, -0.26], rot: [-0.27, 6.16, 0.29], scale: 0.96 },
    { type: 'citrus', pos: [0.60, 0.13, -0.26], rot: [0.06, 5.64, -0.17], scale: 0.96 },
    { type: 'peach', pos: [-0.43, -0.24, -0.26], rot: [-0.24, 0.54, -0.35], scale: 1.02 },
    { type: 'mango', pos: [-0.59, 0.25, -0.29], rot: [0.25, 3.82, 0.10], scale: 0.99 },
    { type: 'greenApple', pos: [0.53, 0.45, -0.32], rot: [-0.07, 0.50, -0.38], scale: 0.97 },
    { type: 'mixedFruit', pos: [-0.62, -0.05, -0.33], rot: [-0.01, 3.44, -0.36], scale: 0.97 },
    { type: 'citrus', pos: [-0.01, 0.30, -0.33], rot: [0.08, 6.02, -0.16], scale: 0.93 },
    { type: 'greenApple', pos: [0.57, -0.50, -0.34], rot: [-0.11, 1.79, -0.03], scale: 1.00 },
    { type: 'citrus', pos: [-0.10, -0.15, -0.35], rot: [-0.09, 4.66, -0.24], scale: 0.98 },
    { type: 'raspberry', pos: [0.27, -0.48, -0.35], rot: [-0.04, 1.03, -0.38], scale: 1.00 },
    { type: 'purpleBerry', pos: [-0.35, -0.48, -0.37], rot: [-0.13, 2.40, 0.37], scale: 0.94 },
    { type: 'purpleBerry', pos: [-0.08, -0.71, -0.38], rot: [-0.27, 0.09, 0.23], scale: 1.01 },
    { type: 'strawberry', pos: [-0.36, 0.06, -0.39], rot: [-0.34, 2.66, 0.27], scale: 1.06 },
    { type: 'strawberry', pos: [-0.52, -0.71, -0.44], rot: [-0.02, 3.89, 0.25], scale: 0.97 },
    { type: 'citrus', pos: [0.31, 0.60, -0.48], rot: [0.23, 1.02, -0.37], scale: 0.96 },
    { type: 'greenApple', pos: [-0.06, 0.08, -0.49], rot: [-0.16, 3.08, -0.25], scale: 0.99 },
    { type: 'mixedFruit', pos: [0.33, -0.71, -0.49], rot: [-0.08, 4.46, -0.04], scale: 1.01 },
    { type: 'citrus', pos: [0.38, -0.21, -0.53], rot: [0.08, 0.44, 0.26], scale: 0.92 },
      ]
    : [
    { type: 'peach', pos: [0.47, -0.26, -0.24], rot: [-0.25, 2.96, 0.25], scale: 1.05 },
    { type: 'purpleBerry', pos: [0.14, -0.07, -0.25], rot: [0.20, 2.35, -0.06], scale: 0.92 },
    { type: 'peach', pos: [0.29, 0.27, -0.26], rot: [-0.27, 6.16, 0.29], scale: 0.96 },
    { type: 'citrus', pos: [0.60, 0.13, -0.26], rot: [0.06, 5.64, -0.17], scale: 0.96 },
    { type: 'peach', pos: [-0.43, -0.24, -0.26], rot: [-0.24, 0.54, -0.35], scale: 1.02 },
    { type: 'mango', pos: [-0.59, 0.25, -0.29], rot: [0.25, 3.82, 0.10], scale: 0.99 },
    { type: 'greenApple', pos: [0.53, 0.45, -0.32], rot: [-0.07, 0.50, -0.38], scale: 0.97 },
    { type: 'mixedFruit', pos: [-0.62, -0.05, -0.33], rot: [-0.01, 3.44, -0.36], scale: 0.97 },
    { type: 'citrus', pos: [-0.01, 0.30, -0.33], rot: [0.08, 6.02, -0.16], scale: 0.93 },
    { type: 'greenApple', pos: [0.57, -0.50, -0.34], rot: [-0.11, 1.79, -0.03], scale: 1.00 },
    { type: 'citrus', pos: [-0.10, -0.15, -0.35], rot: [-0.09, 4.66, -0.24], scale: 0.98 },
    { type: 'raspberry', pos: [0.27, -0.48, -0.35], rot: [-0.04, 1.03, -0.38], scale: 1.00 },
    { type: 'purpleBerry', pos: [-0.35, -0.48, -0.37], rot: [-0.13, 2.40, 0.37], scale: 0.94 },
    { type: 'purpleBerry', pos: [-0.08, -0.71, -0.38], rot: [-0.27, 0.09, 0.23], scale: 1.01 },
    { type: 'strawberry', pos: [-0.36, 0.06, -0.39], rot: [-0.34, 2.66, 0.27], scale: 1.06 },
    { type: 'strawberry', pos: [-0.52, -0.71, -0.44], rot: [-0.02, 3.89, 0.25], scale: 0.97 },
    { type: 'citrus', pos: [0.31, 0.60, -0.48], rot: [0.23, 1.02, -0.37], scale: 0.96 },
    { type: 'greenApple', pos: [-0.06, 0.08, -0.49], rot: [-0.16, 3.08, -0.25], scale: 0.99 },
    { type: 'mixedFruit', pos: [0.33, -0.71, -0.49], rot: [-0.08, 4.46, -0.04], scale: 1.01 },
    { type: 'citrus', pos: [0.38, -0.21, -0.53], rot: [0.08, 0.44, 0.26], scale: 0.92 },
    { type: 'mango', pos: [-0.07, 0.59, -0.53], rot: [-0.35, 3.49, 0.09], scale: 1.01 },
    { type: 'peach', pos: [-0.36, 0.41, -0.55], rot: [0.37, 5.76, 0.02], scale: 0.92 },
    { type: 'greenApple', pos: [-0.44, -0.30, -0.55], rot: [-0.36, 3.22, 0.16], scale: 0.91 },
    { type: 'peach', pos: [0.37, 0.29, -0.57], rot: [0.20, 5.02, 0.26], scale: 1.03 },
    { type: 'greenApple', pos: [-0.22, -0.63, -0.60], rot: [0.21, 2.58, 0.31], scale: 1.04 },
    { type: 'purpleBerry', pos: [0.08, -0.71, -0.62], rot: [-0.16, 0.90, -0.39], scale: 0.93 },
    { type: 'raspberry', pos: [-0.31, -0.03, -0.64], rot: [0.01, 0.15, 0.31], scale: 0.97 },
    { type: 'mixedFruit', pos: [-0.10, -0.21, -0.64], rot: [0.08, 5.51, 0.31], scale: 0.98 },
    { type: 'mango', pos: [0.07, 0.27, -0.64], rot: [0.40, 5.34, -0.06], scale: 0.90 },
    { type: 'greenApple', pos: [0.30, -0.45, -0.64], rot: [-0.26, 3.26, 0.05], scale: 0.99 },
    { type: 'raspberry', pos: [0.24, 0.01, -0.66], rot: [-0.38, 4.93, -0.24], scale: 1.01 },
    { type: 'mango', pos: [-0.02, -0.46, -0.68], rot: [-0.21, 1.85, -0.07], scale: 0.99 },
      ];

  backLayerCandies.forEach((cfg) => {
    const proto = prototypes[cfg.type];
    const mesh = new THREE.Mesh(proto.geometry, proto.backMaterial);
    mesh.position.set(...cfg.pos);
    mesh.rotation.set(...cfg.rot);
    mesh.scale.set(cfg.scale, cfg.scale, cfg.scale);
    candiesGroup.add(mesh);
  });

  // =========================================================================
  // 2. CURVED LUXURY LABEL BAND ('NÉCTAR — LUXURY FRUIT CONFECTION')
  // Kept intact, sharp, and curved snugly on the glass
  // =========================================================================
  const labelRadius = 1.036;
  const labelHeight = 0.92;
  const labelArc = Math.PI * 0.54; // ~97 degrees, centered to front
  const labelGeom = new THREE.CylinderGeometry(
    labelRadius,
    labelRadius,
    labelHeight,
    48,
    1,
    true,
    -labelArc / 2 + Math.PI / 2,
    labelArc
  );

  const labelTexture = createLabelTexture();
  const labelMaterial = new THREE.MeshStandardMaterial({
    map: labelTexture,
    transparent: true,
    roughness: 0.32,
    metalness: 0.08,
    side: THREE.DoubleSide,
    depthWrite: true,
  });

  const labelMesh = new THREE.Mesh(labelGeom, labelMaterial);
  labelMesh.name = 'jar-label';
  labelMesh.position.y = -0.06;
  labelMesh.renderOrder = 2;
  jarGroup.add(labelMesh);

  // =========================================================================
  // 3. PHOTOREALISTIC CLEAR APOTHECARY GLASS JAR
  // Watertight lathe geometry, optical crown glass refraction, sharp speculars
  // Refraction thickness calibrated to 0.18 (matching actual 0.13 wall thickness)
  // for razor-sharp optical clarity of gummies through the crystal glass
  // =========================================================================
  const jarGeometry = createJarLatheGeometry();

  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0xf6fbfe), // Very subtle crisp cool glass tint
    transmission: 0.992, // Optical clarity — clear transparent glass
    opacity: 1.0,
    transparent: true,
    roughness: 0.01, // Flawless crystal polish for razor-sharp specular glints
    metalness: 0.0,
    ior: 1.54, // Crown glass refractive index
    thickness: 0.18, // Calibrated to 0.13 wall thickness for crystal-clear gummy sharpness
    attenuationColor: new THREE.Color(0xdef2f6),
    attenuationDistance: 5.0,
    specularIntensity: 2.6, // Sharp tight white & orange hotspots
    specularColor: new THREE.Color(0xffffff),
    clearcoat: 1.0,
    clearcoatRoughness: 0.01,
    depthWrite: true, // Prevents rim see-through gaps or sorting glitches
    side: THREE.FrontSide,
  });

  const glassMesh = new THREE.Mesh(jarGeometry, glassMaterial);
  glassMesh.name = 'jar-glass';
  glassMesh.renderOrder = 3;
  jarGroup.add(glassMesh);

  // =========================================================================
  // 4. DARK BROWN/BLACK RIBBED METAL LID
  // =========================================================================
  const lidGeometry = createLidGeometry();
  const lidBumpMap = createLidRibbedBumpMap();

  const lidMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x16120e), // Dark espresso / bronze-black
    roughness: 0.50,
    metalness: 0.82,
    bumpMap: lidBumpMap,
    bumpScale: 0.05, // Crisp vertical knurl ridges
  });

  const lidMesh = new THREE.Mesh(lidGeometry, lidMaterial);
  lidMesh.name = 'jar-lid';
  lidMesh.renderOrder = 4;
  jarGroup.add(lidMesh);

  // =========================================================================
  // 5. PROPER METALLIC CHROME BASE PLATFORM UNDERNEATH
  // Stepped polished chrome pedestal with chamfers, warm orange under-glow ring
  // =========================================================================
  const pedestalGroup = new THREE.Group();
  pedestalGroup.name = 'product-pedestal';
  pedestalGroup.position.y = -1.20;
  rootGroup.add(pedestalGroup);

  // Top beveled chrome disc
  const topPlateGeom = new THREE.CylinderGeometry(1.16, 1.22, 0.05, 64);
  const chromeMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0xf2f4f8), // Bright polished chrome
    metalness: 0.98,
    roughness: 0.09, // High specular gloss reflecting the jar & orange glow
  });
  const pedestalChromeMesh = new THREE.Mesh(topPlateGeom, chromeMaterial);
  pedestalChromeMesh.position.y = -0.025;
  pedestalGroup.add(pedestalChromeMesh);

  // Lower stepped chrome plinth
  const basePlinthGeom = new THREE.CylinderGeometry(1.24, 1.28, 0.05, 64);
  const lowerChromeMesh = new THREE.Mesh(basePlinthGeom, chromeMaterial);
  lowerChromeMesh.position.y = -0.075;
  pedestalGroup.add(lowerChromeMesh);

  // Embedded circular warm orange glowing ring directly at the jar-chrome seam
  const orangeRingGeom = new THREE.TorusGeometry(1.04, 0.025, 16, 64);
  const orangeRingMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0xff6600),
    transparent: true,
    opacity: 0.95,
  });
  const pedestalOrangeRing = new THREE.Mesh(orangeRingGeom, orangeRingMat);
  pedestalOrangeRing.rotation.x = Math.PI / 2;
  pedestalOrangeRing.position.y = 0.005;
  pedestalGroup.add(pedestalOrangeRing);

  // Soft warm orange upward/under-glow light projecting through the glass base puck
  const pedestalUnderglow = new THREE.PointLight(0xff6600, 3.6, 6, 1.6);
  pedestalUnderglow.position.set(0, 0.08, 0);
  pedestalGroup.add(pedestalUnderglow);

  // =========================================================================
  // 6. SOFT REALISTIC SHADOW BENEATH ON SOLID DARK FLOOR
  // =========================================================================
  const shadowGeo = new THREE.PlaneGeometry(3.8, 3.8);
  const shadowTexture = createContactShadowTexture();
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTexture,
    transparent: true,
    opacity: 0.92,
    depthWrite: false,
  });
  const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.y = -0.105;
  pedestalGroup.add(shadowPlane);

  return {
    rootGroup,
    jarGroup,
    glassMesh,
    lidMesh,
    labelMesh,
    candiesGroup,
    pedestalGroup,
    pedestalChromeMesh,
    pedestalOrangeRing,
    pedestalUnderglow,
    shadowPlane,
  };
}