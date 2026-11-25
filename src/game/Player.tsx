import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { objects, player, world } from "../data/scene";
import { moveInput } from "./input";
import { objectById, playerState, useGame } from "./state";
import { Model } from "./Model";
import { angleTo, deg, turnTowards } from "./math";

const PLAYER_RADIUS = 0.35;
/** Extra distance beyond an object's radius where the talk prompt appears */
const TALK_RANGE = 1.0;

export function Player() {
  const root = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const walkTime = useRef(0);

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const { dialogue, setNearby } = useGame.getState();
    let moving = false;

    if (dialogue) {
      // Face whoever we're talking to
      const target = objectById(dialogue.objectId);
      if (target) {
        const a = angleTo(playerState.x, playerState.z, target.position[0], target.position[1]);
        playerState.rotY = turnTowards(playerState.rotY, a, dt * 10);
      }
    } else {
      const { x, z } = moveInput();
      const amount = Math.hypot(x, z);
      if (amount > 0.05) {
        moving = true;
        playerState.x += x * player.speed * dt;
        playerState.z += z * player.speed * dt;
        playerState.rotY = turnTowards(playerState.rotY, Math.atan2(x, z), dt * 12);
        collide();
      }
      setNearby(findNearby());
    }

    // Code-driven walk bob: hop and waddle while moving, settle when still
    if (body.current) {
      if (moving) walkTime.current += dt * 12;
      const hop = moving ? Math.abs(Math.sin(walkTime.current)) * 0.12 : 0;
      const tilt = moving ? Math.sin(walkTime.current) * 0.12 : 0;
      body.current.position.y = THREE.MathUtils.lerp(body.current.position.y, hop, 0.5);
      body.current.rotation.z = THREE.MathUtils.lerp(body.current.rotation.z, tilt, 0.3);
      if (!moving) walkTime.current = 0;
    }

    root.current?.position.set(playerState.x, 0, playerState.z);
    if (root.current) root.current.rotation.y = playerState.rotY;
  });

  return (
    <group ref={root}>
      <group ref={body}>
        <group rotation-y={deg(player.rotationY)}>
          <Model url={player.model} height={player.height} />
        </group>
      </group>
    </group>
  );
}

/** Push the player out of solid objects and keep them inside the park. */
function collide() {
  for (const o of objects) {
    if (!o.solid) continue;
    const min = (o.radius ?? 0.5) + PLAYER_RADIUS;
    const dx = playerState.x - o.position[0];
    const dz = playerState.z - o.position[1];
    const dist = Math.hypot(dx, dz);
    if (dist < min && dist > 0.0001) {
      playerState.x = o.position[0] + (dx / dist) * min;
      playerState.z = o.position[1] + (dz / dist) * min;
    }
  }
  const edge = world.size / 2 - PLAYER_RADIUS;
  playerState.x = THREE.MathUtils.clamp(playerState.x, -edge, edge);
  playerState.z = THREE.MathUtils.clamp(playerState.z, -edge, edge);
}

/** Closest talkable object in range, or null. */
function findNearby() {
  let best: string | null = null;
  let bestDist = Infinity;
  for (const o of objects) {
    if (!o.dialogue) continue;
    const dist = Math.hypot(playerState.x - o.position[0], playerState.z - o.position[1]);
    if (dist < (o.radius ?? 0.5) + PLAYER_RADIUS + TALK_RANGE && dist < bestDist) {
      best = o.id;
      bestDist = dist;
    }
  }
  return best;
}
