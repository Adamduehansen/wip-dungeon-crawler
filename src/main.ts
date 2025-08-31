import * as ex from "excalibur";
import { GameScene } from "./game-scene.ts";

const engine = new ex.Engine({
  width: 800,
  height: 800,
  scenes: { GameScene },
});

await engine.start();
engine.goToScene("GameScene");
