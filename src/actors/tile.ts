import * as ex from "excalibur";
import { Resources } from "../resources.ts";

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

export type TileData = [
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

    this.graphics.use(spritesheet.getSprite(1, 1).clone());
  }

  override onInitialize(_engine: ex.Engine): void {
    this.on("pointerenter", () => {
      this.graphics.current!.tint = ex.Color.Green;
    });

    this.on("pointerleave", () => {
      this.graphics.current!.tint = undefined;
    });
  }
}

export class Tile extends ex.Actor {
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
