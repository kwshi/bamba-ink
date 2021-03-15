export type Point = [number, number];
export type Stroke = Point[];

export enum Thickness {
  Thin,
  Med,
  Thick,
}

export enum Color {
  Red,
  Orange,
  Yellow,
  Green,
  Blue,
  Indigo,
  Violet,
}

export interface Style {
  thickness: Thickness;
  color: Color;
}
