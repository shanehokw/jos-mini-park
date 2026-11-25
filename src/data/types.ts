// Shapes for the files you edit: scene.ts and dialogue/*.ts

/** A model file inside public/models, e.g. "/models/frog.glb" */
export type ModelPath = `/models/${string}.glb`;

export type DialogueChoice<Id extends string> = {
  /** Button text */
  label: string;
  /** Node to jump to. Leave out to end the conversation. */
  next?: Id;
};

export type DialogueNode<Id extends string> = {
  /** One string = one page. An array = several pages, shown in order. */
  text: string | string[];
  /** Overrides the name tag for this node (defaults to the object's name). */
  speaker?: string;
  /** Reply buttons, shown after the last page. */
  choices?: DialogueChoice<Id>[];
  /** With no choices: node to go to after the last page. Leave out to end. */
  next?: Id;
};

export type Dialogue = Record<string, DialogueNode<string>> & { start: DialogueNode<string> };

/**
 * Wrap each dialogue file in this. It checks that every `next` points at a node
 * that exists, and that there is a `start` node.
 */
export function defineDialogue<Id extends string>(
  nodes: { start: DialogueNode<NoInfer<Id>> } & Record<Id, DialogueNode<NoInfer<Id>>>,
): Dialogue {
  return nodes as Dialogue;
}
