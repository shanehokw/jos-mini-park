import { Canvas } from "@react-three/fiber";
import { World } from "./game/World";
import { TalkPrompt } from "./ui/TalkPrompt";
import { DialogueBox } from "./ui/DialogueBox";
import { Joystick } from "./ui/Joystick";
import { isTouch } from "./ui/device";

export function App() {
  return (
    <>
      <Canvas shadows camera={{ fov: 40, near: 0.1, far: 100, position: [0, 9, 13] }} dpr={[1, 2]}>
        <World />
      </Canvas>
      <div className="ui">
        {!isTouch && <div className="hint">WASD / arrows to walk · E to talk</div>}
        <TalkPrompt />
        <DialogueBox />
        {isTouch && <Joystick />}
      </div>
    </>
  );
}
