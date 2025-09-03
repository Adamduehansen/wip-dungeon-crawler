import * as ex from "excalibur";

export const Resources = {
  spritesheet: new ex.ImageSource("/assets/spritesheet.png"),
} as const;

export const loader = new ex.Loader([
  ...Object.values(Resources),
]);
