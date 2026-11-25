import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { objectById, playerState, useGame } from "./state";

// Fixed angled view, Animal Crossing style. Camera sits behind and above the player.
const OFFSET = new THREE.Vector3(0, 7, 8.5);
const TALK_ZOOM = 0.6;

export function CameraRig() {
  const look = useRef(new THREE.Vector3(playerState.x, 0, playerState.z));
  const zoom = useRef(1);

  useFrame(({ camera, size }, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const { dialogue } = useGame.getState();
    const target = new THREE.Vector3(playerState.x, 0.5, playerState.z);
    let targetZoom = 1;

    if (dialogue) {
      const other = objectById(dialogue.objectId);
      if (other) target.set((playerState.x + other.position[0]) / 2, 0.6, (playerState.z + other.position[1]) / 2);
      targetZoom = TALK_ZOOM;
    }

    const k = 1 - Math.exp(-dt * 6);
    look.current.lerp(target, k);
    // Tall phone screens see less side-to-side, so pull back a bit
    const aspect = size.width / size.height;
    targetZoom *= Math.pow(THREE.MathUtils.clamp(1 / aspect, 1, 2.2), 0.55);
    zoom.current = THREE.MathUtils.lerp(zoom.current, targetZoom, k);
    camera.position.copy(look.current).addScaledVector(OFFSET, zoom.current);
    camera.lookAt(look.current);
  });

  return null;
}
