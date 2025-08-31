import * as ex from "excalibur";
// import { SocketManager } from "./socket-manager.ts";

class Hero extends ex.Actor {
  constructor() {
    super({
      color: ex.Color.Red,
      width: 16,
      height: 16,
      pos: ex.vec(100, 100),
    });

    this._makeDownHandler = this._makeDownHandler.bind(this);
  }

  private _makeDownHandler(): ex.Handler<ex.PointerEvent> {
    return (event) => {
      this.pos = event.pagePos;
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

type TileData = [["", "", ""], ["", "", ""], ["", "", ""]];

const tile1: TileData = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

interface CellArgs {
  row: number;
  column: number;
}

class Cell extends ex.Actor {
  constructor(args: CellArgs) {
    super({
      height: 16,
      width: 16,
      color: ex.Color.Green,
      pos: ex.vec(args.column * 16, args.row * 16),
    });
  }
}

class Tile extends ex.Actor {
  #tileData: TileData;

  constructor(tileData: TileData) {
    super();
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
}

export class GameScene extends ex.Scene {
  #hero?: Hero;

  constructor() {
    super();
    // SocketManager.getInstance().open();
  }

  override onInitialize(_engine: ex.Engine): void {
    // this.add(new SocketStatusLabel());
    this.#hero = new Hero();
    this.#hero.z = 10;
    this.add(this.#hero);

    this.add(new Tile(tile1));
  }
}
