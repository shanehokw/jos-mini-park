import { useRef, useState } from "react";
import { joystick } from "../game/input";
import { useGame } from "../game/state";

const RADIUS = 50;

/** On-screen joystick for phones. Drag anywhere in the bottom-left area. */
export function Joystick() {
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const origin = useRef<{ x: number; y: number } | null>(null);
  const talking = useGame((s) => !!s.dialogue);

  const reset = () => {
    origin.current = null;
    joystick.x = joystick.y = 0;
    setKnob({ x: 0, y: 0 });
  };

  if (talking && origin.current) reset();

  return (
    <div
      className="joystick"
      style={{ visibility: talking ? "hidden" : "visible" }}
      onPointerDown={(e) => {
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
          // capture can fail for synthetic events; dragging still works
        }
        const r = e.currentTarget.getBoundingClientRect();
        origin.current = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
        move(e.clientX, e.clientY);
      }}
      onPointerMove={(e) => origin.current && move(e.clientX, e.clientY)}
      onPointerUp={reset}
      onPointerCancel={reset}
    >
      <div className="knob" style={{ transform: `translate(${knob.x}px, ${knob.y}px)` }} />
    </div>
  );

  function move(cx: number, cy: number) {
    if (!origin.current) return;
    let dx = cx - origin.current.x;
    let dy = cy - origin.current.y;
    const len = Math.hypot(dx, dy);
    if (len > RADIUS) {
      dx = (dx / len) * RADIUS;
      dy = (dy / len) * RADIUS;
    }
    joystick.x = dx / RADIUS;
    joystick.y = dy / RADIUS;
    setKnob({ x: dx, y: dy });
  }
}
