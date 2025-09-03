import * as ex from "excalibur";
import { Resources } from "./resources.ts";
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
      this.pos = event.worldPos;
      // TODO: Send new position to server
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

type TileData = [
  ["", "", "", ""],
  ["", "", "", ""],
  ["", "", "", ""],
  ["", "", "", ""],
];

const tileData1: TileData = [
  ["", "", "", ""],
  ["", "", "", ""],
  ["", "", "", ""],
  ["", "", "", ""],
];

interface CellArgs {
  row: number;
  column: number;
}

class Cell extends ex.Actor {
  constructor(args: CellArgs) {
    super({
      name: "Cell",
      height: 8,
      width: 8,
      color: ex.Color.Green,
      pos: ex.vec(args.column * 8, args.row * 8),
    });

    this.graphics.use(spritesheet.getSprite(1, 1));
  }
}

class Tile extends ex.Actor {
  #tileData: TileData;

  constructor(tileData: TileData) {
    super({
      name: "Tile",
    });
    this.#tileData = tileData;
  }

  override onInitialize(_engine: ex.Engine): void {
    for (let rowIndex = 0; rowIndex < this.#tileData.length; rowIndex++) {
      const cellRow = this.#tileData[rowIndex];
      for (let columnIndex = 0; columnIndex < cellRow.length; columnIndex++) {
        const _cell = cellRow[columnIndex];
        this.addChild(
          new Cell({
            row: rowIndex,
            column: columnIndex,
          }),
        );
      }
    }
  }

  static #getAdjacentPos(
    side: "top" | "right" | "bottom" | "left",
    pos: ex.Vector,
  ): ex.Vector | never {
    switch (side) {
      case "top": {
        return ex.vec(pos.x, pos.y - 8 * 4);
      }
      case "right": {
        return ex.vec(pos.x + 8 * 4, pos.y);
      }
      case "bottom": {
        return ex.vec(pos.x, pos.y + 8 * 4);
      }
      case "left": {
        return ex.vec(pos.x - 8 * 4, pos.y);
      }
    }
  }

  static adjacentTo(args: {
    tile: Tile;
    side: "top" | "right" | "bottom" | "left";
    data: TileData;
  }): Tile {
    const newTile = new Tile(args.data);
    newTile.pos = Tile.#getAdjacentPos(args.side, args.tile.pos);
    return newTile;
  }
}

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

    this.camera.strategy.lockToActor(this.#hero);
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
