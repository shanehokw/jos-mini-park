import { useGLTF } from "@react-three/drei";
import { objects, player, world } from "../data/scene";
import { Player } from "./Player";
import { SceneObjectView } from "./SceneObjectView";
import { CameraRig } from "./CameraRig";

// Start downloading every model at once instead of one by one
new Set([player.model, ...objects.map((o) => o.model)]).forEach((url) => useGLTF.preload(url));

export function World() {
  return (
    <>
      <color attach="background" args={[world.skyColor]} />
      <fog attach="fog" args={[world.skyColor, 20, 40]} />
      <hemisphereLight args={["#ffffff", "#6a8f4a", 1.2]} />
      <directionalLight
        position={[6, 12, 6]}
        intensity={1.6}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-world.size / 2}
        shadow-camera-right={world.size / 2}
        shadow-camera-top={world.size / 2}
        shadow-camera-bottom={-world.size / 2}
      />

      {/* Ground */}
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[world.size, world.size]} />
        <meshStandardMaterial color={world.groundColor} />
      </mesh>
      {/* Grass beyond the park edge, so the world doesn't end in a cliff */}
      <mesh rotation-x={-Math.PI / 2} position-y={-0.01}>
        <planeGeometry args={[world.size * 4, world.size * 4]} />
        <meshStandardMaterial color={world.groundColor} />
      </mesh>

      {objects.map((o) => (
        <SceneObjectView key={o.id} obj={o} />
      ))}
      <Player />
      <CameraRig />
    </>
  );
}
