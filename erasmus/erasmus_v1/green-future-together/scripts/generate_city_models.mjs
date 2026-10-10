import fs from 'fs';
import path from 'path';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

// Polyfill FileReader for Node.js GLTFExporter binary export
global.FileReader = class FileReader {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then(buf => {
      this.result = buf;
      if (this.onload) this.onload({ target: this });
      if (this.onloadend) this.onloadend({ target: this });
    });
  }
};

const FONT_5X7 = {
  'A': [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1]
  ],
  'B': [
    [1,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,0]
  ],
  'C': [
    [0,1,1,1,1],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [0,1,1,1,1]
  ],
  'Ç': [
    [0,1,1,1,1],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [0,1,1,1,1],
    [0,0,1,0,0],
    [0,1,0,0,0]
  ],
  'D': [
    [1,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,0]
  ],
  'E': [
    [1,1,1,1,1],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,1]
  ],
  'F': [
    [1,1,1,1,1],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0]
  ],
  'G': [
    [0,1,1,1,1],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,1,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,1]
  ],
  'Ğ': [
    [0,1,0,1,0],
    [0,1,1,1,1],
    [1,0,0,0,0],
    [1,0,1,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,1]
  ],
  'H': [
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1]
  ],
  'I': [
    [1,1,1,1,1],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [1,1,1,1,1]
  ],
  'İ': [
    [0,0,1,0,0],
    [0,0,0,0,0],
    [0,1,1,1,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,1,1,1,0]
  ],
  'J': [
    [0,0,0,0,1],
    [0,0,0,0,1],
    [0,0,0,0,1],
    [0,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0]
  ],
  'K': [
    [1,0,0,0,1],
    [1,0,0,1,0],
    [1,0,1,0,0],
    [1,1,0,0,0],
    [1,0,1,0,0],
    [1,0,0,1,0],
    [1,0,0,0,1]
  ],
  'L': [
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,1]
  ],
  'M': [
    [1,0,0,0,1],
    [1,1,0,1,1],
    [1,0,1,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1]
  ],
  'N': [
    [1,0,0,0,1],
    [1,1,0,0,1],
    [1,0,1,0,1],
    [1,0,0,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1]
  ],
  'O': [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0]
  ],
  'Ö': [
    [1,0,0,0,1],
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0]
  ],
  'P': [
    [1,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0]
  ],
  'R': [
    [1,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,0],
    [1,0,1,0,0],
    [1,0,0,1,0],
    [1,0,0,0,1]
  ],
  'S': [
    [0,1,1,1,1],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [0,1,1,1,0],
    [0,0,0,0,1],
    [0,0,0,0,1],
    [1,1,1,1,0]
  ],
  'Ş': [
    [0,1,1,1,1],
    [1,0,0,0,0],
    [0,1,1,1,0],
    [0,0,0,0,1],
    [1,1,1,1,0],
    [0,0,1,0,0],
    [0,1,0,0,0]
  ],
  'T': [
    [1,1,1,1,1],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0]
  ],
  'U': [
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0]
  ],
  'Ü': [
    [1,0,0,0,1],
    [0,0,0,0,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0]
  ],
  'V': [
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,0,1,0],
    [0,1,0,1,0],
    [0,0,1,0,0]
  ],
  'Y': [
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,0,1,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0]
  ],
  'Z': [
    [1,1,1,1,1],
    [0,0,0,0,1],
    [0,0,0,1,0],
    [0,0,1,0,0],
    [0,1,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,1]
  ],
  ' ': [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0]
  ],
  '-': [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [1,1,1,1,1],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0]
  ],
  '+': [
    [0,0,0,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [1,1,1,1,1],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,0,0,0]
  ],
  '.': [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,1,1,0,0],
    [0,1,1,0,0]
  ],
  '·': [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,1,1,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0]
  ]
};

// Generate merged 3D text geometry from 5x7 bitfont
function create3DTextMesh(text, pixelSize = 0.08, depth = 0.14, material) {
  const chars = text.toUpperCase().split('');
  const letterSpacing = pixelSize * 1.5;
  const charWidth = pixelSize * 5;
  const totalWidth = chars.length * charWidth + (chars.length - 1) * letterSpacing;
  
  const geometries = [];
  let currentX = -totalWidth / 2;

  chars.forEach(char => {
    const grid = FONT_5X7[char] || FONT_5X7[' '];
    for (let r = 0; r < 7; r++) {
      let c = 0;
      while (c < 5) {
        if (grid[r][c] === 1) {
          let run = 1;
          while (c + run < 5 && grid[r][c + run] === 1) {
            run++;
          }
          const boxWidth = run * pixelSize;
          const boxHeight = pixelSize;
          const boxGeom = new THREE.BoxGeometry(boxWidth, boxHeight, depth);
          
          const posX = currentX + (c + run / 2) * pixelSize;
          const posY = (6 - r + 0.5) * pixelSize; // invert rows so 0 is top
          boxGeom.translate(posX, posY, 0);
          geometries.push(boxGeom);
          c += run;
        } else {
          c++;
        }
      }
    }
    currentX += charWidth + letterSpacing;
  });

  if (geometries.length === 0) return new THREE.Group();

  const merged = mergeGeometries(geometries);
  return new THREE.Mesh(merged, material);
}

// Helper to make building
function createBuilding({ width = 1.2, depth = 1.2, height = 2, wallColor = 0xd1d5db, roofColor = 0x1e3a8a, hasSolar = true, hasGarden = false, x = 0, z = 0, y = 0 }) {
  const group = new THREE.Group();
  group.position.set(x, y, z);

  // Main body
  const bodyGeom = new THREE.BoxGeometry(width, height, depth);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: wallColor,
    roughness: 0.6,
    metalness: 0.2
  });
  const body = new THREE.Mesh(bodyGeom, bodyMat);
  body.position.y = height / 2;
  group.add(body);

  // Window bands
  const numFloors = Math.max(2, Math.floor(height / 0.5));
  const winGeoms = [];
  for (let f = 1; f < numFloors; f++) {
    const wy = (f / numFloors) * height;
    const band1 = new THREE.BoxGeometry(width * 1.01, 0.12, depth * 0.9);
    band1.translate(0, wy, 0);
    winGeoms.push(band1);
    const band2 = new THREE.BoxGeometry(width * 0.9, 0.12, depth * 1.01);
    band2.translate(0, wy, 0);
    winGeoms.push(band2);
  }
  if (winGeoms.length > 0) {
    const mergedWin = mergeGeometries(winGeoms);
    const winMat = new THREE.MeshStandardMaterial({
      color: 0x93c5fd,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0x1e3a8a,
      emissiveIntensity: 0.25
    });
    group.add(new THREE.Mesh(mergedWin, winMat));
  }

  // Roof structure
  const roofH = 0.15;
  const roofGeom = new THREE.BoxGeometry(width * 1.04, roofH, depth * 1.04);
  const roofMat = new THREE.MeshStandardMaterial({
    color: hasGarden ? 0x2d6a4f : 0x334155,
    roughness: 0.7
  });
  const roof = new THREE.Mesh(roofGeom, roofMat);
  roof.position.y = height + roofH / 2;
  group.add(roof);

  // Solar panels on roof
  if (hasSolar) {
    const panelCols = Math.max(1, Math.floor(width / 0.45));
    const panelRows = Math.max(1, Math.floor(depth / 0.45));
    const panelGeoms = [];
    for (let r = 0; r < panelRows; r++) {
      for (let c = 0; c < panelCols; c++) {
        const px = (c - (panelCols - 1) / 2) * 0.38;
        const pz = (r - (panelRows - 1) / 2) * 0.38;
        const panel = new THREE.BoxGeometry(0.32, 0.04, 0.32);
        panel.rotateX(-0.15); // tilted towards sun
        panel.translate(px, height + roofH + 0.04, pz);
        panelGeoms.push(panel);
      }
    }
    if (panelGeoms.length > 0) {
      const mergedPanels = mergeGeometries(panelGeoms);
      const solarMat = new THREE.MeshStandardMaterial({
        color: 0x1d4ed8,
        metalness: 0.85,
        roughness: 0.15,
        emissive: 0x1e40af,
        emissiveIntensity: 0.3
      });
      group.add(new THREE.Mesh(mergedPanels, solarMat));
    }
  }

  return group;
}

// Helper for trees
function createTree(x, z, scale = 1, type = 'pine') {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  group.scale.set(scale, scale, scale);

  // Trunk
  const trunkGeom = new THREE.CylinderGeometry(0.06, 0.09, 0.5, 6);
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.9 });
  const trunk = new THREE.Mesh(trunkGeom, trunkMat);
  trunk.position.y = 0.25;
  group.add(trunk);

  // Crown
  if (type === 'pine') {
    const crownMat = new THREE.MeshStandardMaterial({ color: 0x1b4332, roughness: 0.7 });
    for (let i = 0; i < 3; i++) {
      const cone = new THREE.Mesh(
        new THREE.ConeGeometry(0.35 - i * 0.08, 0.45, 6),
        crownMat
      );
      cone.position.y = 0.55 + i * 0.25;
      group.add(cone);
    }
  } else if (type === 'palm') {
    const crownMat = new THREE.MeshStandardMaterial({ color: 0x2d6a4f, roughness: 0.6 });
    for (let a = 0; a < 6; a++) {
      const leaf = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.02, 0.5), crownMat);
      leaf.rotation.y = (a * Math.PI) / 3;
      leaf.rotation.x = 0.35;
      leaf.position.set(0, 0.7, 0);
      group.add(leaf);
    }
  } else {
    // Deciduous round crown
    const crownMat = new THREE.MeshStandardMaterial({ color: 0x40916c, roughness: 0.7 });
    const crown = new THREE.Mesh(new THREE.DodecahedronGeometry(0.38), crownMat);
    crown.position.y = 0.65;
    group.add(crown);
  }

  return group;
}

// Helper for wind turbines
function createWindTurbine(x, z, height = 3.2, rotationAngle = 0.3) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);

  const mat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.3, roughness: 0.4 });

  // Mast
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.09, height, 8), mat);
  mast.position.y = height / 2;
  group.add(mast);

  // Nacelle
  const nacelle = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.12, 0.26), mat);
  nacelle.position.set(0, height, 0.05);
  group.add(nacelle);

  // Hub & 3 blades
  const hub = new THREE.Group();
  hub.position.set(0, height, 0.18);
  hub.rotation.z = rotationAngle;

  const bladeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.2, roughness: 0.3 });
  for (let b = 0; b < 3; b++) {
    const bladeGeom = new THREE.BoxGeometry(0.05, 1.1, 0.015);
    bladeGeom.translate(0, 0.55, 0);
    const blade = new THREE.Mesh(bladeGeom, bladeMat);
    blade.rotation.z = (b * 2 * Math.PI) / 3;
    hub.add(blade);
  }
  group.add(hub);

  return group;
}

// Helper for IoT climate sensor tower
function createSensorTower(x, z, height = 2.4, ringColor = 0x10b981) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);

  const towerMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.7, roughness: 0.3 });
  const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.08, height, 6), towerMat);
  tower.position.y = height / 2;
  group.add(tower);

  // Glowing status ring
  const ringMat = new THREE.MeshStandardMaterial({
    color: ringColor,
    emissive: ringColor,
    emissiveIntensity: 0.9,
    roughness: 0.2
  });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.03, 8, 16), ringMat);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = height * 0.75;
  group.add(ring);

  // Top radar dish / sensor ball
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), ringMat);
  head.position.y = height;
  group.add(head);

  return group;
}

// Build standard modern digital twin base plinth
function createBasePlinth(radius = 5.2, themeColor = 0x10b981) {
  const group = new THREE.Group();

  // Dark slate base cylinder
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0x161b22,
    metalness: 0.4,
    roughness: 0.6
  });
  const baseGeom = new THREE.CylinderGeometry(radius, radius * 1.03, 0.4, 48);
  const base = new THREE.Mesh(baseGeom, baseMat);
  base.position.y = -0.2;
  group.add(base);

  // Glowing neon rim
  const rimMat = new THREE.MeshStandardMaterial({
    color: themeColor,
    emissive: themeColor,
    emissiveIntensity: 0.7,
    roughness: 0.2
  });
  const rim = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.04, 8, 48), rimMat);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.01;
  group.add(rim);

  // Ground layer (turf / terrain)
  const turfMat = new THREE.MeshStandardMaterial({
    color: 0x1f2937,
    roughness: 0.85
  });
  const turf = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.98, radius * 0.98, 0.04, 48), turfMat);
  turf.position.y = 0.02;
  group.add(turf);

  return group;
}

// Build 3D City Name Monument at the front
function createCityMonument(cityName, subtitleText, glowColor = 0x10b981) {
  const group = new THREE.Group();
  group.position.set(0, 0, 4.3); // front position

  // Pedestal base
  const pedMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    metalness: 0.8,
    roughness: 0.2
  });
  const ped = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.25, 0.7), pedMat);
  ped.position.y = 0.125;
  group.add(ped);

  // Underglow bar
  const underglowMat = new THREE.MeshStandardMaterial({
    color: glowColor,
    emissive: glowColor,
    emissiveIntensity: 0.9
  });
  const underglow = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.05, 0.72), underglowMat);
  underglow.position.y = 0.26;
  group.add(underglow);

  // 3D City Name in bold extruded letters
  const textMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: glowColor,
    emissiveIntensity: 0.6,
    metalness: 0.3,
    roughness: 0.2
  });
  const textMesh = create3DTextMesh(cityName, 0.1, 0.18, textMat);
  textMesh.position.set(0, 0.3, 0.05);
  group.add(textMesh);

  // Subtitle / tag
  if (subtitleText) {
    const subMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      emissive: glowColor,
      emissiveIntensity: 0.3,
      roughness: 0.5
    });
    const subMesh = create3DTextMesh(subtitleText, 0.04, 0.06, subMat);
    subMesh.position.set(0, 0.08, 0.36);
    subMesh.rotation.x = -Math.PI / 4; // angled face plate
    group.add(subMesh);
  }

  return group;
}

// Definition of each city and unique elements
const CITY_SPECS = [
  {
    id: 'trabzon',
    name: 'TRABZON',
    subtitle: 'KARADENIZ TASKIN IKIZI',
    themeColor: 0x10b981, // Emerald Green
    buildScene: (scene) => {
      // Steep coastal terrain / tea garden hills
      const hillMat = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.8 });
      const hill = new THREE.Mesh(new THREE.ConeGeometry(2.8, 1.2, 8), hillMat);
      hill.position.set(-1.8, 0.6, -1.2);
      scene.add(hill);

      // Black Sea coast (water)
      const seaMat = new THREE.MeshStandardMaterial({ color: 0x0369a1, roughness: 0.15, metalness: 0.7 });
      const sea = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 0.06, 24, 1, false, 0, Math.PI), seaMat);
      sea.position.set(1.5, 0.03, -1.8);
      scene.add(sea);

      // Hydrological Flood Barrier & Radar
      const barrierMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.6, roughness: 0.4 });
      const barrier = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.6, 2.4), barrierMat);
      barrier.position.set(0.6, 0.3, -0.6);
      scene.add(barrier);

      // Research Campus & Buildings
      scene.add(createBuilding({ width: 1.6, depth: 1.2, height: 1.4, wallColor: 0xe2e8f0, hasSolar: true, hasGarden: true, x: -0.6, z: 1.0 }));
      scene.add(createBuilding({ width: 1.2, depth: 1.0, height: 2.1, wallColor: 0xcfd8dc, hasSolar: true, x: 1.4, z: 0.8 }));
      scene.add(createBuilding({ width: 1.0, depth: 0.9, height: 1.0, wallColor: 0xf1f5f9, hasSolar: false, hasGarden: true, x: -1.8, z: 0.4 }));

      // Sensors & Trees
      scene.add(createSensorTower(0.6, -1.6, 2.8, 0xef4444)); // Taşkın Erken Uyarı Radarı
      scene.add(createSensorTower(-1.8, -1.2, 2.2, 0x10b981));
      scene.add(createWindTurbine(-2.5, 1.8, 2.8, 0.5));
      scene.add(createTree(-1.2, 2.2, 1.2, 'pine'));
      scene.add(createTree(-2.2, 0.8, 1.1, 'pine'));
      scene.add(createTree(-0.2, 2.4, 0.9, 'pine'));
      scene.add(createTree(2.2, 1.8, 1.0, 'deciduous'));
    }
  },
  {
    id: 'istanbul',
    name: 'ISTANBUL',
    subtitle: 'MEGAKENT IKLIM IKIZI',
    themeColor: 0x06b6d4, // Cyan
    buildScene: (scene) => {
      // Bosphorus strait water channel
      const waterMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.1, metalness: 0.8 });
      const bosphorus = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.05, 7.5), waterMat);
      bosphorus.rotation.y = 0.25;
      bosphorus.position.set(0, 0.02, 0);
      scene.add(bosphorus);

      // Suspension Bridge Tower & Cables
      const bridgeMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, metalness: 0.5, roughness: 0.3 });
      const tower1 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 3.4, 0.12), bridgeMat);
      tower1.position.set(-0.6, 1.7, -0.6);
      scene.add(tower1);
      const tower2 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 3.4, 0.12), bridgeMat);
      tower2.position.set(0.6, 1.7, -0.3);
      scene.add(tower2);

      const crossBeam = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.08, 0.1), bridgeMat);
      crossBeam.position.set(0, 2.8, -0.45);
      scene.add(crossBeam);

      const bridgeDeck = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.08, 0.35), new THREE.MeshStandardMaterial({ color: 0x475569 }));
      bridgeDeck.position.set(0, 1.2, -0.45);
      scene.add(bridgeDeck);

      // Sustainable Skyscrapers & Historical Domes
      scene.add(createBuilding({ width: 1.2, depth: 1.1, height: 3.5, wallColor: 0x94a3b8, hasSolar: true, hasGarden: true, x: 2.2, z: 0.5 }));
      scene.add(createBuilding({ width: 1.1, depth: 1.0, height: 2.6, wallColor: 0x64748b, hasSolar: true, x: 2.2, z: -1.2 }));
      scene.add(createBuilding({ width: 1.3, depth: 1.2, height: 2.2, wallColor: 0xe2e8f0, hasSolar: true, hasGarden: true, x: -2.2, z: 0.6 }));
      scene.add(createBuilding({ width: 1.0, depth: 1.0, height: 1.8, wallColor: 0xcbd5e1, hasSolar: false, x: -2.0, z: -1.4 }));

      // Historical Dome Model
      const domeMat = new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.5 });
      const dome = new THREE.Mesh(new THREE.SphereGeometry(0.65, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2), domeMat);
      dome.position.set(-2.0, 1.8, -1.4);
      scene.add(dome);

      // Sensors & Trees
      scene.add(createSensorTower(0, 0.4, 2.5, 0x06b6d4)); // Bosphorus Maritime Telemetry
      scene.add(createSensorTower(2.8, 1.8, 2.2, 0xf59e0b)); // Mecidiyeköy Isı Adası Sensörü
      scene.add(createTree(-3.0, 1.8, 1.2, 'deciduous'));
      scene.add(createTree(-2.8, -0.2, 1.0, 'deciduous'));
      scene.add(createTree(2.8, 2.2, 1.1, 'deciduous'));
    }
  },
  {
    id: 'ankara',
    name: 'ANKARA',
    subtitle: 'BASKENT GUNES AR-GE DUGUMU',
    themeColor: 0xf59e0b, // Amber Gold
    buildScene: (scene) => {
      // Stepped Plateau & Civic Architecture
      const platMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
      const plateau = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 3.0, 0.4, 8), platMat);
      plateau.position.set(-1.2, 0.2, -0.6);
      scene.add(plateau);

      // Climate Research Observatory Dome
      const obsBase = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.9, 1.2, 16), new THREE.MeshStandardMaterial({ color: 0xf8fafc }));
      obsBase.position.set(-1.2, 1.0, -0.6);
      scene.add(obsBase);
      const obsDome = new THREE.Mesh(new THREE.SphereGeometry(0.8, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.8, roughness: 0.2 }));
      obsDome.position.set(-1.2, 1.6, -0.6);
      scene.add(obsDome);

      // Large Solar Photovoltaic Farm
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          const sp = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.04, 0.4), new THREE.MeshStandardMaterial({ color: 0x1d4ed8, metalness: 0.9, roughness: 0.1 }));
          sp.rotation.x = -0.3;
          sp.position.set(1.2 + c * 0.65, 0.2, -0.8 + r * 0.65);
          scene.add(sp);
        }
      }

      // Civic Center & Tech Buildings
      scene.add(createBuilding({ width: 1.8, depth: 1.2, height: 1.6, wallColor: 0xf1f5f9, hasSolar: true, hasGarden: true, x: 0.2, z: 1.6 }));
      scene.add(createBuilding({ width: 1.1, depth: 1.0, height: 2.2, wallColor: 0xe2e8f0, hasSolar: true, x: 2.2, z: 1.4 }));

      // Renewable Wind Power on Ridge
      scene.add(createWindTurbine(-2.8, -1.8, 3.4, 0.8));
      scene.add(createWindTurbine(-3.4, 0.2, 3.0, 1.4));

      // Sensor Towers & Pine Afforestation
      scene.add(createSensorTower(0.2, 0.2, 2.6, 0xf59e0b));
      scene.add(createTree(-2.8, 1.8, 1.2, 'pine'));
      scene.add(createTree(-1.8, 2.2, 1.0, 'pine'));
      scene.add(createTree(-0.8, 2.5, 0.9, 'pine'));
      scene.add(createTree(2.8, -1.8, 1.1, 'pine'));
    }
  },
  {
    id: 'izmir',
    name: 'IZMIR',
    subtitle: 'EGE KIYI MIKRO-IKLIM DUGUMU',
    themeColor: 0x14b8a6, // Teal
    buildScene: (scene) => {
      // Aegean Sea & Coastal Marina Basin
      const seaMat = new THREE.MeshStandardMaterial({ color: 0x0891b2, roughness: 0.1, metalness: 0.7 });
      const sea = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 2.8, 0.06, 32, 1, false, -Math.PI / 4, Math.PI * 0.9), seaMat);
      sea.position.set(-1.0, 0.03, -0.8);
      scene.add(sea);

      // Coastal Promenade & Pier
      const pierMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.5 });
      const pier = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.12, 2.8), pierMat);
      pier.position.set(-0.2, 0.08, -0.8);
      scene.add(pier);

      // Coastal Wind Turbines (Alaçatı / Karaburun breeze)
      scene.add(createWindTurbine(-2.6, -1.8, 3.2, 0.2));
      scene.add(createWindTurbine(-3.2, 0.6, 2.9, 0.7));

      // Urban Heat Island Mitigation Canopies & Buildings
      scene.add(createBuilding({ width: 1.5, depth: 1.2, height: 2.2, wallColor: 0xffffff, hasSolar: true, hasGarden: true, x: 1.2, z: -0.6 }));
      scene.add(createBuilding({ width: 1.3, depth: 1.1, height: 1.7, wallColor: 0xf8fafc, hasSolar: true, hasGarden: true, x: 1.4, z: 1.2 }));
      scene.add(createBuilding({ width: 1.0, depth: 1.0, height: 1.4, wallColor: 0xe0f2fe, hasSolar: true, x: -0.2, z: 1.8 }));

      // Palm Trees & Marine Telemetry
      scene.add(createSensorTower(-0.2, -2.0, 2.6, 0x14b8a6));
      scene.add(createTree(0.2, 0.6, 1.2, 'palm'));
      scene.add(createTree(0.2, 1.4, 1.1, 'palm'));
      scene.add(createTree(0.2, -0.2, 1.3, 'palm'));
      scene.add(createTree(2.6, 0.8, 1.0, 'palm'));
      scene.add(createTree(2.5, -1.2, 1.1, 'palm'));
    }
  },
  {
    id: 'bursa',
    name: 'BURSA',
    subtitle: 'ULUDAG KARBON YUTAGI DUGUMU',
    themeColor: 0x22c55e, // Bright Green
    buildScene: (scene) => {
      // Uludağ Mountain Slope Backdrop
      const mountainMat = new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.85 });
      const mountain = new THREE.Mesh(new THREE.ConeGeometry(3.2, 2.2, 7), mountainMat);
      mountain.position.set(-1.8, 1.1, -1.6);
      scene.add(mountain);

      // Mountain Snow Cap
      const snowMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
      const snow = new THREE.Mesh(new THREE.ConeGeometry(1.2, 0.7, 7), snowMat);
      snow.position.set(-1.8, 1.85, -1.6);
      scene.add(snow);

      // Eco-Industrial Green Pods & Geothermal Stations
      scene.add(createBuilding({ width: 2.0, depth: 1.4, height: 1.3, wallColor: 0x334155, hasSolar: true, hasGarden: true, x: 1.2, z: -0.4 }));
      scene.add(createBuilding({ width: 1.4, depth: 1.2, height: 1.8, wallColor: 0xe2e8f0, hasSolar: true, hasGarden: true, x: 0.8, z: 1.4 }));
      scene.add(createBuilding({ width: 1.1, depth: 0.9, height: 1.1, wallColor: 0xf1f5f9, hasSolar: true, x: -0.6, z: 1.6 }));

      // Mountain Stream & Retention Pond
      const pondMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.2, metalness: 0.6 });
      const pond = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.05, 16), pondMat);
      pond.position.set(0.2, 0.03, 0.2);
      scene.add(pond);

      // Dense Pine Forests (Carbon Sink)
      scene.add(createTree(-0.8, -0.6, 1.4, 'pine'));
      scene.add(createTree(-1.4, 0.2, 1.3, 'pine'));
      scene.add(createTree(-2.4, 0.8, 1.2, 'pine'));
      scene.add(createTree(-0.4, 0.8, 1.1, 'pine'));
      scene.add(createTree(2.4, 1.6, 1.0, 'pine'));

      // Air Quality & Thermal Sensor
      scene.add(createSensorTower(0.2, -1.4, 2.6, 0x22c55e));
    }
  },
  {
    id: 'antalya',
    name: 'ANTALYA',
    subtitle: 'AKDENIZ TERMAL DIJITAL IKIZI',
    themeColor: 0xf97316, // Orange Coral
    buildScene: (scene) => {
      // Mediterranean Azure Sea
      const seaMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.1, metalness: 0.7 });
      const sea = new THREE.Mesh(new THREE.CylinderGeometry(3.0, 3.0, 0.06, 32, 1, false, 0, Math.PI * 0.8), seaMat);
      sea.position.set(-1.2, 0.03, -0.6);
      scene.add(sea);

      // Coastal Cliffs
      const cliffMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.9 });
      const cliff = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.7, 3.2), cliffMat);
      cliff.position.set(0.3, 0.35, -0.6);
      scene.add(cliff);

      // Concentrated Solar Thermal / PV Array
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 2; c++) {
          const sp = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.04, 0.35), new THREE.MeshStandardMaterial({ color: 0x1d4ed8, metalness: 0.9, roughness: 0.1 }));
          sp.rotation.x = -0.35;
          sp.position.set(1.2 + c * 0.65, 0.2, -1.2 + r * 0.55);
          scene.add(sp);
        }
      }

      // Shaded Bioclimatic Resort & Research Campus
      scene.add(createBuilding({ width: 1.6, depth: 1.2, height: 1.8, wallColor: 0xffedd5, hasSolar: true, hasGarden: true, x: 1.4, z: 1.2 }));
      scene.add(createBuilding({ width: 1.2, depth: 1.0, height: 1.4, wallColor: 0xffffff, hasSolar: true, x: -0.4, z: 1.6 }));

      // Cooling Mist Towers & Sensors
      scene.add(createSensorTower(0.3, -1.8, 2.7, 0xf97316)); // Aşırı Sıcaklık İzleme
      scene.add(createTree(0.6, 0.6, 1.2, 'palm'));
      scene.add(createTree(0.6, 1.4, 1.1, 'palm'));
      scene.add(createTree(-1.8, 1.6, 1.0, 'palm'));
      scene.add(createTree(2.5, 1.8, 0.9, 'palm'));
    }
  },
  {
    id: 'rome',
    name: 'ROMA',
    subtitle: 'TIBER HAVZASI DIJITAL IKIZI',
    themeColor: 0xe11d48, // Rose / Terracotta
    buildScene: (scene) => {
      // Colosseum-inspired Circular Amphitheater Pavilion
      const arenaMat = new THREE.MeshStandardMaterial({ color: 0xd6d3d1, roughness: 0.6 });
      const arenaOuter = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.7, 1.1, 24, 1, true), arenaMat);
      arenaOuter.position.set(-1.0, 0.55, -0.6);
      scene.add(arenaOuter);

      const arenaRoof = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.12, 8, 24), new THREE.MeshStandardMaterial({ color: 0x1e3a8a, metalness: 0.8 }));
      arenaRoof.rotation.x = Math.PI / 2;
      arenaRoof.position.set(-1.0, 1.1, -0.6);
      scene.add(arenaRoof);

      // Tiber River curve
      const riverMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.2, metalness: 0.7 });
      const river = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 6.5), riverMat);
      river.rotation.y = -0.35;
      river.position.set(1.4, 0.02, 0);
      scene.add(river);

      // Sustainable Buildings
      scene.add(createBuilding({ width: 1.4, depth: 1.2, height: 1.8, wallColor: 0xfef08a, hasSolar: true, hasGarden: true, x: 0.2, z: 1.6 }));
      scene.add(createBuilding({ width: 1.2, depth: 1.0, height: 2.3, wallColor: 0xf1f5f9, hasSolar: true, x: -1.8, z: 1.4 }));

      // Cypress Trees & Tiber Eco-Sensor
      scene.add(createSensorTower(1.4, -1.6, 2.6, 0xe11d48));
      scene.add(createTree(-2.8, -0.6, 1.5, 'pine'));
      scene.add(createTree(-2.8, 0.4, 1.4, 'pine'));
      scene.add(createTree(0.2, -0.8, 1.3, 'pine'));
      scene.add(createTree(2.6, 1.6, 1.1, 'deciduous'));
    }
  },
  {
    id: 'madrid',
    name: 'MADRID',
    subtitle: 'IBERIK PLATO COLLESME IZLEME',
    themeColor: 0xeab308, // Sun Yellow
    buildScene: (scene) => {
      // Retiro Botanical Biodome Greenhouse
      const domeMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        metalness: 0.8,
        roughness: 0.15,
        wireframe: true
      });
      const dome = new THREE.Mesh(new THREE.SphereGeometry(1.3, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2), domeMat);
      dome.position.set(-1.2, 0.1, -0.6);
      scene.add(dome);

      // Drought Retention Reservoir
      const resMat = new THREE.MeshStandardMaterial({ color: 0x0369a1, roughness: 0.15, metalness: 0.6 });
      const res = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 0.06, 16), resMat);
      res.position.set(1.5, 0.03, -1.0);
      scene.add(res);

      // Gran Vía Shaded Solar Avenue
      scene.add(createBuilding({ width: 1.5, depth: 1.3, height: 2.8, wallColor: 0xfef3c7, hasSolar: true, hasGarden: true, x: 1.2, z: 1.0 }));
      scene.add(createBuilding({ width: 1.2, depth: 1.1, height: 2.1, wallColor: 0xe2e8f0, hasSolar: true, x: -0.6, z: 1.7 }));
      scene.add(createBuilding({ width: 1.1, depth: 1.0, height: 1.6, wallColor: 0xffedd5, hasSolar: true, x: 2.3, z: -0.2 }));

      // Soil Moisture & Heat Sensors
      scene.add(createSensorTower(1.5, -2.0, 2.8, 0xeab308));
      scene.add(createTree(-2.6, 0.8, 1.1, 'deciduous'));
      scene.add(createTree(-1.8, 1.8, 1.0, 'deciduous'));
      scene.add(createTree(2.6, 1.8, 1.2, 'deciduous'));
    }
  },
  {
    id: 'bucharest',
    name: 'BUKRES',
    subtitle: 'TUNA HAVZASI TASKIN IKIZI',
    themeColor: 0x3b82f6, // Royal Blue
    buildScene: (scene) => {
      // Dâmbovița River corridor & flood gates
      const riverMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.1, metalness: 0.7 });
      const river = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.05, 7.0), riverMat);
      river.position.set(0, 0.02, 0);
      scene.add(river);

      // Flood Control Gate
      const gateMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.7, roughness: 0.3 });
      const gate = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.7, 0.3), gateMat);
      gate.position.set(0, 0.35, -1.0);
      scene.add(gate);

      // Grand Civic Sustainability Palace / Research Center
      scene.add(createBuilding({ width: 2.2, depth: 1.6, height: 2.4, wallColor: 0xf1f5f9, hasSolar: true, hasGarden: true, x: -1.8, z: 0.5 }));
      scene.add(createBuilding({ width: 1.6, depth: 1.2, height: 1.9, wallColor: 0xe2e8f0, hasSolar: true, hasGarden: true, x: 1.8, z: 0.6 }));
      scene.add(createBuilding({ width: 1.2, depth: 1.0, height: 1.4, wallColor: 0xcbd5e1, hasSolar: true, x: 1.7, z: -1.6 }));

      // Snowmelt Radar & Telemetry
      scene.add(createSensorTower(0, -2.0, 2.7, 0x3b82f6));
      scene.add(createTree(-2.8, -1.2, 1.3, 'deciduous'));
      scene.add(createTree(-2.8, 1.8, 1.2, 'deciduous'));
      scene.add(createTree(2.8, 1.8, 1.1, 'deciduous'));
      scene.add(createTree(2.8, -0.6, 1.0, 'deciduous'));
    }
  },
  {
    id: 'school',
    name: 'CLIMAMAP',
    subtitle: 'ERASMUS+ OKUL KAMPUSU',
    themeColor: 0x10b981, // Green
    buildScene: (scene) => {
      // Main Campus Building
      scene.add(createBuilding({ width: 2.4, depth: 1.6, height: 1.6, wallColor: 0xf8fafc, hasSolar: true, hasGarden: true, x: 0, z: -0.4 }));
      // Classrooms Wing
      scene.add(createBuilding({ width: 1.6, depth: 1.2, height: 1.2, wallColor: 0xe2e8f0, hasSolar: true, x: -1.8, z: 0.8 }));
      // Innovation Lab
      scene.add(createBuilding({ width: 1.4, depth: 1.1, height: 1.4, wallColor: 0xdcfce7, hasSolar: true, hasGarden: true, x: 1.7, z: 0.8 }));

      // Sports Court / Courtyard
      const courtMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 });
      const court = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.04, 1.2), courtMat);
      court.position.set(0, 0.03, 1.8);
      scene.add(court);

      // Campus Wind Turbine & Weather Station
      scene.add(createWindTurbine(-2.6, -1.8, 3.2, 0.4));
      scene.add(createSensorTower(2.2, -1.6, 2.4, 0x10b981));

      // Campus Trees
      scene.add(createTree(-2.8, 1.8, 1.2, 'deciduous'));
      scene.add(createTree(-1.0, 2.2, 1.0, 'deciduous'));
      scene.add(createTree(1.0, 2.2, 1.0, 'deciduous'));
      scene.add(createTree(2.6, 1.8, 1.1, 'deciduous'));
    }
  }
];

// Generate GLB for a spec
async function exportSpecToGLB(spec, outDir) {
  const scene = new THREE.Scene();

  // Add Ambient & Directional Lighting
  const ambLight = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
  dirLight.position.set(6, 12, 8);
  scene.add(dirLight);

  const fillLight = new THREE.DirectionalLight(0xbbf7d0, 0.5);
  fillLight.position.set(-8, 6, -6);
  scene.add(fillLight);

  // Add Base Plinth
  const plinth = createBasePlinth(4.8, spec.themeColor);
  scene.add(plinth);

  // Add City Unique Digital Twin
  spec.buildScene(scene);

  // Add City Name Monument
  const monument = createCityMonument(spec.name, spec.subtitle, spec.themeColor);
  scene.add(monument);

  // Export to binary GLB
  const exporter = new GLTFExporter();
  return new Promise((resolve, reject) => {
    exporter.parse(
      scene,
      (gltf) => {
        try {
          const filePath = path.join(outDir, `${spec.id}.glb`);
          fs.writeFileSync(filePath, Buffer.from(gltf));
          console.log(`Saved: ${filePath} (${gltf.byteLength} bytes)`);
          resolve(filePath);
        } catch (err) {
          reject(err);
        }
      },
      (error) => {
        reject(error);
      },
      { binary: true }
    );
  });
}

async function run() {
  const modelsDir = path.resolve('public/models');
  if (!fs.existsSync(modelsDir)) {
    fs.mkdirSync(modelsDir, { recursive: true });
  }

  // Backup original trabzon.glb if exists
  const origTrabzon = path.join(modelsDir, 'trabzon.glb');
  const backupTrabzon = path.join(modelsDir, 'trabzon_original.glb');
  if (fs.existsSync(origTrabzon) && !fs.existsSync(backupTrabzon)) {
    fs.copyFileSync(origTrabzon, backupTrabzon);
    console.log('Backed up original trabzon.glb to trabzon_original.glb');
  }

  for (const spec of CITY_SPECS) {
    await exportSpecToGLB(spec, modelsDir);

    // Also create aliases / turkish names
    if (spec.id === 'rome') {
      const aliasPath = path.join(modelsDir, 'roma.glb');
      fs.copyFileSync(path.join(modelsDir, 'rome.glb'), aliasPath);
      console.log(`Created alias: ${aliasPath}`);
    }
    if (spec.id === 'bucharest') {
      const aliasPath = path.join(modelsDir, 'bukres.glb');
      fs.copyFileSync(path.join(modelsDir, 'bucharest.glb'), aliasPath);
      console.log(`Created alias: ${aliasPath}`);
    }
  }

  // Also copy to dist/models if dist exists
  const distModelsDir = path.resolve('dist/models');
  if (fs.existsSync(distModelsDir)) {
    const files = fs.readdirSync(modelsDir);
    for (const f of files) {
      if (f.endsWith('.glb')) {
        fs.copyFileSync(path.join(modelsDir, f), path.join(distModelsDir, f));
      }
    }
    console.log('Synchronized models to dist/models');
  }

  console.log('All 3D GLB models generated successfully!');
}

run().catch(console.error);
