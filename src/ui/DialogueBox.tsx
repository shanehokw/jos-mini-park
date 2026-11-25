import { useEffect, useRef, useState } from "react";
import { currentNode, useGame } from "../game/state";

/** Letters per second */
const TYPE_SPEED = 45;

export function DialogueBox() {
  const dialogue = useGame((s) => s.dialogue);
  const goTo = useGame((s) => s.goTo);
  const nextPage = useGame((s) => s.nextPage);
  const info = dialogue ? currentNode(dialogue) : null;

  const text = info ? info.pages[dialogue!.page] ?? "" : "";
  const isLastPage = info ? dialogue!.page >= info.pages.length - 1 : true;
  const choices = info && isLastPage ? info.node.choices ?? [] : [];

  const [shown, setShown] = useState(0);
  const [selected, setSelected] = useState(0);
  const done = shown >= text.length;

  // Typewriter: reveal letters over time, restart whenever the text changes
  useEffect(() => {
    setShown(0);
    setSelected(0);
    if (!text) return;
    const start = performance.now();
    const id = setInterval(() => {
      const n = Math.floor(((performance.now() - start) / 1000) * TYPE_SPEED);
      setShown(n);
      if (n >= text.length) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [text, dialogue?.nodeId, dialogue?.page]);

  /** Click / E / Space: finish typing, else go on */
  const advance = () => {
    if (!info) return;
    if (!done) return setShown(text.length);
    if (choices.length) return; // waiting for a choice
    if (!isLastPage) return nextPage();
    goTo(info.node.next);
  };

  const choose = (i: number) => {
    const c = choices[i];
    if (c) goTo(c.next);
  };

  // Keyboard. Kept in a ref so the listener always sees the latest state.
  const keyHandler = useRef<(e: KeyboardEvent) => void>(() => {});
  keyHandler.current = (e) => {
    const showingChoices = done && choices.length > 0;
    if (showingChoices && (e.code === "ArrowUp" || e.code === "KeyW")) {
      setSelected((s) => (s + choices.length - 1) % choices.length);
    } else if (showingChoices && (e.code === "ArrowDown" || e.code === "KeyS")) {
      setSelected((s) => (s + 1) % choices.length);
    } else if (showingChoices && /^Digit[1-9]$/.test(e.code)) {
      choose(Number(e.code.slice(5)) - 1);
    } else if (e.code === "KeyE" || e.code === "Space" || e.code === "Enter") {
      if (showingChoices) choose(selected);
      else advance();
    } else if (e.code === "Escape") {
      goTo(undefined);
    } else return;
    e.preventDefault();
  };
  useEffect(() => {
    if (!dialogue) return;
    const onKey = (e: KeyboardEvent) => !e.repeat && keyHandler.current(e);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [!!dialogue]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!dialogue || !info) return null;

  return (
    <div className="dialogue-layer">
      {done && choices.length > 0 && (
        <div className="choices">
          {choices.map((c, i) => (
            <button
              key={i}
              className={i === selected ? "choice selected" : "choice"}
              onClick={() => choose(i)}
              onMouseEnter={() => setSelected(i)}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}
      <div className="dialogue-box" onClick={advance}>
        <div className="name-tag">{info.speaker}</div>
        <p>{text.slice(0, shown)}</p>
        {done && choices.length === 0 && <span className="more">▼</span>}
      </div>
    </div>
  );
}
