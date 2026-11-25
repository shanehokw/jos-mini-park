# Jo's Mini Park

A small 3D park. Walk around as a cat and talk to things.

## Run it

```bash
npm install
npm run dev
```

Open the address it prints (`Local:`). To try it on your phone, connect to the same Wi-Fi and open the `Network:` address.

| Control | Desktop | Phone |
|---|---|---|
| Walk | WASD or arrow keys | Joystick, bottom-left |
| Talk / next line | E, Space or Enter; or click the box | Tap the prompt or the box |
| Pick a reply | Up/Down + E, number keys, or click | Tap |
| Leave a conversation | Esc | Finish the conversation |

## Files you edit

| File | What it controls |
|---|---|
| `public/models/*.glb` | The 3D models |
| `src/data/scene.ts` | What's in the park, where, how big, and which dialogue each thing uses. Also the player's model, speed and start point |
| `src/data/dialogue/*.ts` | What each thing says |
| `src/data/dialogue/index.ts` | List of dialogue files |

Everything else is game code. You don't need to touch it.

## Swap a model

1. Get a `.glb` file (Blender: File → Export → glTF 2.0, format "glTF Binary"). Meshy, Tripo and Sketchfab can all download GLB.
2. Put it in `public/models/`.
3. In `src/data/scene.ts`, set that object's `model` to `"/models/yourfile.glb"`.
4. Set `height` to how tall it should be, in metres (the cat is 1.1). The game scales and centres the model and stands it on the ground automatically.
5. If it faces the wrong way, set `rotationY` (degrees, e.g. `180`). Models should face the camera when `rotationY` is 0.

If a file is missing or broken, a pink box appears in its place and the browser console says which file failed.

Models don't need animations. The game makes characters hop while they walk.

## Add an object

Add an entry to `objects` in `src/data/scene.ts`:

```ts
{
  id: "bench1",            // unique
  name: "Bench",           // shown in prompts and the name tag
  model: "/models/bench.glb",
  position: [4, 3],        // [x, z]. Park centre is [0, 0]; bigger z = closer to camera
  height: 0.9,
  solid: true,             // can't walk through it
  radius: 0.8,             // size of the solid area, in metres
},
```

Add `dialogue`, `verb: "Read"` (instead of "Talk") or `turnToTalk: true` (turns to face you) as needed.

## Write dialogue

1. Create `src/data/dialogue/bench.ts`:

```ts
import { defineDialogue } from "../types";

export default defineDialogue({
  start: {
    text: ["First page.", "Second page."],      // one string, or several pages
    choices: [
      { label: "Sit down", next: "sit" },
      { label: "Leave" },                        // no `next` = conversation ends
    ],
  },
  sit: {
    text: "Very comfy.",
    // next: "someOtherNode"   // optional: go on without a choice
  },
});
```

2. Register it in `src/data/dialogue/index.ts`: import it and add `bench,` to `dialogues`.
3. In `scene.ts`, give the object `dialogue: "bench"`.

Every conversation begins at `start`. A typo in a `next` or `dialogue` name shows as an error in your editor and in `npm run typecheck`.

## Placeholder models

The current models are generated from code by `scripts/make-models.ts`. Running `npm run make-models` rebuilds them and **overwrites** cat, frog, tree and signpost in `public/models/`. Don't run it after you've replaced those files with your own.

## Deploy to Vercel

Push to GitHub, then import the repository in Vercel. It detects Vite automatically: build command `npm run build`, output folder `dist`.
