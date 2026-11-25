// Register every dialogue file here. The key is what scene.ts uses in `dialogue: "..."`.
import frog from "./frog";
import signpost from "./signpost";

export const dialogues = {
  frog,
  signpost,
};

export type DialogueId = keyof typeof dialogues;
