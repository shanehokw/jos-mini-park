// Keyboard + on-screen joystick, combined into one movement direction.

const keys = new Set<string>();

/** Set by the on-screen joystick. x: right, y: down, each -1..1 */
export const joystick = { x: 0, y: 0 };

window.addEventListener("keydown", (e) => keys.add(e.code));
window.addEventListener("keyup", (e) => keys.delete(e.code));
window.addEventListener("blur", () => keys.clear());

const held = (...codes: string[]) => codes.some((c) => keys.has(c));

/** Movement on the ground: x = right, z = towards camera. Length 0..1. */
export function moveInput() {
  let x = 0;
  let z = 0;
  if (held("KeyA", "ArrowLeft")) x -= 1;
  if (held("KeyD", "ArrowRight")) x += 1;
  if (held("KeyW", "ArrowUp")) z -= 1;
  if (held("KeyS", "ArrowDown")) z += 1;
  x += joystick.x;
  z += joystick.y;
  const len = Math.hypot(x, z);
  if (len > 1) {
    x /= len;
    z /= len;
  }
  return { x, z };
}
