import { Component, Suspense, useMemo, type ReactNode } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

type Props = { url: string; height: number };

/**
 * Loads a GLB and fits it: scaled to `height`, centred, standing on the ground.
 * Works whatever size or offset the file was made with.
 */
export function Model(props: Props) {
  return (
    <ModelErrorBoundary {...props}>
      <Suspense fallback={null}>
        <FittedModel {...props} />
      </Suspense>
    </ModelErrorBoundary>
  );
}

function FittedModel({ url, height }: Props) {
  const { scene } = useGLTF(url);
  const { clone, scale, offset } = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const scale = size.y > 0 ? height / size.y : 1;
    const offset = new THREE.Vector3(-center.x, -box.min.y, -center.z).multiplyScalar(scale);
    return { clone, scale, offset };
  }, [scene, height]);

  return (
    <group position={offset} scale={scale}>
      <primitive object={clone} />
    </group>
  );
}

/** If a model file is missing or broken, show a pink box instead of crashing. */
class ModelErrorBoundary extends Component<Props & { children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.error(`Could not load model ${this.props.url}`, error);
  }
  render() {
    if (!this.state.failed) return this.props.children;
    const h = this.props.height;
    return (
      <mesh position-y={h / 2} castShadow>
        <boxGeometry args={[h * 0.5, h, h * 0.5]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
    );
  }
}
