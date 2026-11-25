// Everything in the park. Edit this file to move, add or remove things.
//
// Coordinates: [x, z] on the ground. x = left/right, z = towards/away from the camera
// (bigger z = closer to the camera). The park centre is [0, 0].

import type { ModelPath } from "./types";
import type { DialogueId } from "./dialogue";

export type SceneObject = {
  /** Unique name for this object */
  id: string;
  /** Shown in the dialogue name tag and the talk prompt */
  name: string;
  model: ModelPath;
  position: [x: number, z: number];
  /** Height in metres. The model is scaled to this, whatever size the file is. */
  height: number;
  /** Turn the model, in degrees. Use if a model faces the wrong way. 0 = facing the camera. */
  rotationY?: number;
  /** If true, the player can't walk through it. */
  solid?: boolean;
  /** Size of the solid area and talk range, in metres. Default 0.5. */
  radius?: number;
  /** Which dialogue file to use. Leave out for decoration. */
  dialogue?: DialogueId;
  /** Word in the prompt, e.g. "Talk" or "Read". Default "Talk". */
  verb?: string;
  /** If true, turns to face the player while talking (for characters). */
  turnToTalk?: boolean;
};

export const world = {
  /** Width and depth of the walkable park, in metres */
  size: 24,
  groundColor: "#8fd16a",
  skyColor: "#bfe6ff",
};

export const player = {
  model: "/models/cat.glb" as ModelPath,
  height: 1.1,
  /** Metres per second */
  speed: 4,
  start: [0, 3] as [number, number],
  /** Extra degrees to turn the model if it faces the wrong way */
  rotationY: 0,
};

export const objects: SceneObject[] = [
  {
    id: "frog",
    name: "Frog",
    model: "/models/frog.glb",
    position: [2.5, -1],
    height: 0.8,
    solid: true,
    radius: 0.5,
    dialogue: "frog",
    turnToTalk: true,
  },
  {
    id: "signpost",
    name: "Signpost",
    model: "/models/signpost.glb",
    position: [-2.5, 0.5],
    height: 1.4,
    rotationY: 20,
    solid: true,
    radius: 0.4,
    dialogue: "signpost",
    verb: "Read",
  },
  { id: "tree1", name: "Tree", model: "/models/tree.glb", position: [-6, -5], height: 3.2, solid: true, radius: 0.5 },
  { id: "tree2", name: "Tree", model: "/models/tree.glb", position: [5, -6], height: 3.6, solid: true, radius: 0.5 },
  { id: "tree3", name: "Tree", model: "/models/tree.glb", position: [7, 2], height: 3, solid: true, radius: 0.5 },
  { id: "tree4", name: "Tree", model: "/models/tree.glb", position: [-7, 4], height: 3.4, solid: true, radius: 0.5 },
  { id: "tree5", name: "Tree", model: "/models/tree.glb", position: [0, -8], height: 3.2, solid: true, radius: 0.5 },
];
