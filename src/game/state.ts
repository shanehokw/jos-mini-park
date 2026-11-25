import { create } from "zustand";
import { objects, player as playerConfig } from "../data/scene";
import { dialogues } from "../data/dialogue";

/** Player position, updated every frame. Not React state, to avoid re-rendering 60 times a second. */
export const playerState = {
  x: playerConfig.start[0],
  z: playerConfig.start[1],
  rotY: 0,
};

export type ActiveDialogue = { objectId: string; nodeId: string; page: number };

type GameStore = {
  /** id of the talkable object in range, if any */
  nearby: string | null;
  dialogue: ActiveDialogue | null;
  setNearby: (id: string | null) => void;
  openDialogue: (objectId: string) => void;
  /** Go to a node, or end the conversation when nodeId is undefined */
  goTo: (nodeId: string | undefined) => void;
  nextPage: () => void;
};

export const useGame = create<GameStore>((set, get) => ({
  nearby: null,
  dialogue: null,
  setNearby: (id) => {
    if (get().nearby !== id) set({ nearby: id });
  },
  openDialogue: (objectId) => {
    if (!objectById(objectId)?.dialogue) return;
    set({ dialogue: { objectId, nodeId: "start", page: 0 } });
  },
  goTo: (nodeId) => {
    const d = get().dialogue;
    if (!d || !nodeId) return set({ dialogue: null });
    set({ dialogue: { ...d, nodeId, page: 0 } });
  },
  nextPage: () => {
    const d = get().dialogue;
    if (d) set({ dialogue: { ...d, page: d.page + 1 } });
  },
}));

export function objectById(id: string) {
  return objects.find((o) => o.id === id);
}

export function currentNode(d: ActiveDialogue) {
  const obj = objectById(d.objectId);
  if (!obj?.dialogue) return null;
  const tree = dialogues[obj.dialogue];
  const node = tree[d.nodeId];
  if (!node) return null;
  const pages = Array.isArray(node.text) ? node.text : [node.text];
  return { obj, node, pages, speaker: node.speaker ?? obj.name };
}
