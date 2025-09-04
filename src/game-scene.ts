import * as ex from "excalibur";
import { Resources } from "./resources.ts";
import { Tile, TileData } from "./actors/tile.ts";
// import { SocketManager } from "./socket-manager.ts";

const spritesheet = ex.SpriteSheet.fromImageSource({
  image: Resources.spritesheet,
  grid: {
    columns: 16,
    rows: 10,
    spriteHeight: 8,
    spriteWidth: 8,
  },
  spacing: {
    margin: {
      x: 1,
      y: 1,
    },
  },
});

interface HeroArgs {
  pos: ex.Vector;
}

class Hero extends ex.Actor {
  constructor(args: HeroArgs) {
    super({
      name: "Hero",
      color: ex.Color.Red,
      width: 16,
      height: 16,
      pos: args.pos,
    });

    this.graphics.use(spritesheet.getSprite(4, 0));

    this._makeDownHandler = this._makeDownHandler.bind(this);
  }

  private _makeDownHandler(): ex.Handler<ex.PointerEvent> {
    return (event) => {
      const clickedPosition = event.worldPos;
      const selectedCell = this.scene?.actors.find((actor) =>
        actor.name === "Cell" &&
        actor.contains(clickedPosition.x, clickedPosition.y)
      );

      if (selectedCell === undefined) {
        return;
      }

      this.pos = ex.vec(selectedCell.globalPos.x, selectedCell.globalPos.y);
    };
  }

  override onInitialize(engine: ex.Engine): void {
    engine.input.pointers.primary.on("down", this._makeDownHandler());
  }

  override onPreKill(scene: ex.Scene): void {
    scene.engine.input.pointers.primary.off("down", this._makeDownHandler());
  }
}

// class SocketStatusLabel extends ex.Label {
//   constructor() {
//     super({
//       text: `Socket Connection: ${SocketManager.getInstance().connected}`,
//       font: new ex.Font({
//         size: 28,
//       }),
//     });

//     SocketManager.getInstance().on("status", (status) => {
//       this.text = `Socket Connection: ${status}`;
//     });
//   }
// }

const tileData1: TileData = [
  ["", "", "", ""],
  ["", "", "", ""],
  ["", "", "", ""],
  ["", "", "", ""],
];

export class GameScene extends ex.Scene {
  #hero?: Hero;

  constructor() {
    super();
    // SocketManager.getInstance().open();
  }

  override onInitialize(_engine: ex.Engine): void {
    // this.add(new SocketStatusLabel());
    this.#hero = new Hero({
      pos: ex.vec(0, 0),
    });
    this.#hero.z = 10;
    this.add(this.#hero);

    // this.camera.strategy.lockToActor(this.#hero);
    // this.camera.zoom = 3;

    this.camera.pos = ex.vec(0, 0);
    this.camera.zoom = 3;

    const tile1 = new Tile(tileData1);
    const tile2 = Tile.adjacentTo({
      tile: tile1,
      side: "right",
      data: tileData1,
    });
    const tile3 = Tile.adjacentTo({
      tile: tile2,
      side: "bottom",
      data: tileData1,
    });

    this.add(tile1);
    this.add(tile2);
    this.add(tile3);
  }
}
