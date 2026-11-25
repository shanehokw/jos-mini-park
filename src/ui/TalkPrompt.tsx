import { useEffect } from "react";
import { objectById, useGame } from "../game/state";
import { isTouch } from "./device";

export function TalkPrompt() {
  const nearby = useGame((s) => s.nearby);
  const dialogue = useGame((s) => s.dialogue);
  const openDialogue = useGame((s) => s.openDialogue);
  const obj = nearby ? objectById(nearby) : undefined;
  const visible = !!obj && !dialogue;

  useEffect(() => {
    if (!visible || !obj) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "KeyE" || e.code === "Enter" || e.code === "Space") {
        e.preventDefault();
        openDialogue(obj.id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, obj, openDialogue]);

  if (!visible || !obj) return null;
  return (
    <button className="talk-prompt" onClick={() => openDialogue(obj.id)}>
      {!isTouch && <kbd>E</kbd>}
      {obj.verb ?? "Talk"} {obj.verb === "Read" ? "the" : "to"} {obj.name}
    </button>
  );
}
