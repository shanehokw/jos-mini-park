import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { SceneObject } from "../data/scene";
import { Model } from "./Model";
import { playerState, useGame } from "./state";
import { angleTo, deg, turnTowards } from "./math";

export function SceneObjectView({ obj }: { obj: SceneObject }) {
  const ref = useRef<THREE.Group>(null);
  const baseRot = deg(obj.rotationY ?? 0);

  useFrame((_, dt) => {
    if (!obj.turnToTalk || !ref.current) return;
    const talking = useGame.getState().dialogue?.objectId === obj.id;
    const target = talking
      ? angleTo(obj.position[0], obj.position[1], playerState.x, playerState.z)
      : baseRot;
    ref.current.rotation.y = turnTowards(ref.current.rotation.y, target, Math.min(dt, 0.05) * 8);
  });

  return (
    <group ref={ref} position={[obj.position[0], 0, obj.position[1]]} rotation-y={baseRot}>
      <Model url={obj.model} height={obj.height} />
    </group>
  );
}
