export const deg = (d: number) => (d * Math.PI) / 180;

/** Rotate `current` towards `target` along the shortest way round. */
export function turnTowards(current: number, target: number, amount: number) {
  let diff = target - current;
  diff = Math.atan2(Math.sin(diff), Math.cos(diff));
  return current + diff * Math.min(1, amount);
}

/** Angle to face from (x1,z1) towards (x2,z2), for models facing +Z. */
export const angleTo = (x1: number, z1: number, x2: number, z2: number) => Math.atan2(x2 - x1, z2 - z1);
