import * as ex from "excalibur";
import { GameScene } from "./game-scene.ts";
import { loader } from "./resources.ts";

const engine = new ex.Engine({
  width: 800,
  height: 800,
  suppressPlayButton: true,
  pixelArt: true,
  scenes: { GameScene },
});

await engine.start(loader);
engine.goToScene("GameScene");
