// Builds simple blocky placeholder models and saves them as GLB files in
// public/models. Run with: npm run make-models
//
// Convention for every model: feet/base at y = 0, facing +Z (towards the camera).
// You never need to edit this file — replace the .glb files instead.

import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

// GLTFExporter expects the browser's FileReader. Node has Blob but not FileReader.
class NodeFileReader {
  result: ArrayBuffer | string | null = null;
  onloadend: (() => void) | null = null;
  readAsArrayBuffer(blob: Blob) {
    blob.arrayBuffer().then((buf) => {
      this.result = buf;
      this.onloadend?.();
    });
  }
  readAsDataURL(blob: Blob) {
    blob.arrayBuffer().then((buf) => {
      this.result = `data:${blob.type || "application/octet-stream"};base64,${Buffer.from(buf).toString("base64")}`;
      this.onloadend?.();
    });
  }
}
(globalThis as unknown as { FileReader: unknown }).FileReader = NodeFileReader;

const mat = (color: string) =>
  new THREE.MeshStandardMaterial({ color, roughness: 0.8, flatShading: true });

function box(w: number, h: number, d: number, color: string, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color));
  m.position.set(x, y, z);
  return m;
}

function ball(r: number, color: string, x = 0, y = 0, z = 0, detail = 1) {
  const m = new THREE.Mesh(new THREE.IcosahedronGeometry(r, detail), mat(color));
  m.position.set(x, y, z);
  return m;
}

function cat() {
  const g = new THREE.Group();
  g.name = "Cat";
  const fur = "#f0a050";
  g.add(box(0.2, 0.3, 0.2, fur, -0.15, 0.15, 0)); // legs
  g.add(box(0.2, 0.3, 0.2, fur, 0.15, 0.15, 0));
  g.add(box(0.6, 0.5, 0.45, fur, 0, 0.55, 0)); // body
  g.add(box(0.75, 0.6, 0.6, fur, 0, 1.1, 0)); // head
  const earL = box(0.18, 0.22, 0.12, fur, -0.24, 1.48, 0);
  earL.rotation.z = 0.3;
  const earR = box(0.18, 0.22, 0.12, fur, 0.24, 1.48, 0);
  earR.rotation.z = -0.3;
  g.add(earL, earR);
  g.add(box(0.1, 0.14, 0.02, "#222222", -0.17, 1.15, 0.305)); // eyes
  g.add(box(0.1, 0.14, 0.02, "#222222", 0.17, 1.15, 0.305));
  g.add(box(0.1, 0.06, 0.02, "#e86a8a", 0, 1.02, 0.305)); // nose
  const tail = box(0.1, 0.1, 0.45, fur, 0, 0.6, -0.4);
  tail.rotation.x = -0.6;
  g.add(tail);
  return g;
}

function frog() {
  const g = new THREE.Group();
  g.name = "Frog";
  const skin = "#6cc24a";
  const body = ball(0.5, skin, 0, 0.45, 0);
  body.scale.set(1, 0.8, 0.9);
  g.add(body);
  g.add(ball(0.32, "#e9f5c8", 0, 0.38, 0.22)); // belly
  g.add(ball(0.16, skin, -0.22, 0.85, 0.12)); // eye bumps
  g.add(ball(0.16, skin, 0.22, 0.85, 0.12));
  g.add(ball(0.08, "#222222", -0.22, 0.88, 0.25, 0)); // pupils
  g.add(ball(0.08, "#222222", 0.22, 0.88, 0.25, 0));
  g.add(box(0.3, 0.04, 0.02, "#2d5a1e", 0, 0.58, 0.45)); // mouth
  g.add(box(0.2, 0.1, 0.3, skin, -0.32, 0.05, 0.15)); // feet
  g.add(box(0.2, 0.1, 0.3, skin, 0.32, 0.05, 0.15));
  return g;
}

function tree() {
  const g = new THREE.Group();
  g.name = "Tree";
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.25, 1.2, 6), mat("#8a5a34"));
  trunk.position.y = 0.6;
  g.add(trunk);
  g.add(ball(0.9, "#3f9b4a", 0, 1.8, 0, 0));
  g.add(ball(0.6, "#4fb35a", 0.3, 2.4, 0.1, 0));
  return g;
}

function signpost() {
  const g = new THREE.Group();
  g.name = "Signpost";
  g.add(box(0.12, 1.2, 0.12, "#8a5a34", 0, 0.6, 0));
  g.add(box(0.9, 0.5, 0.08, "#d9a86c", 0, 1.05, 0.07));
  g.add(box(0.6, 0.05, 0.01, "#7a5030", 0, 1.13, 0.115)); // "writing"
  g.add(box(0.5, 0.05, 0.01, "#7a5030", 0, 0.98, 0.115));
  return g;
}

async function save(obj: THREE.Object3D, file: string) {
  const exporter = new GLTFExporter();
  const result = await exporter.parseAsync(obj, { binary: true });
  writeFileSync(file, Buffer.from(result as ArrayBuffer));
  console.log("wrote", file);
}

const outDir = new URL("../public/models/", import.meta.url);
mkdirSync(outDir, { recursive: true });

const models: Record<string, () => THREE.Object3D> = { cat, frog, tree, signpost };
for (const [name, make] of Object.entries(models)) {
  await save(make(), fileURLToPath(new URL(`${name}.glb`, outDir)));
}
