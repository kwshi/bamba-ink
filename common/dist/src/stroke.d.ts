export declare type Point = [number, number];
export declare type Stroke = Point[];
export declare enum Thickness {
    Thin = 0,
    Med = 1,
    Thick = 2
}
export declare enum Color {
    Red = 0,
    Orange = 1,
    Yellow = 2,
    Green = 3,
    Blue = 4,
    Indigo = 5,
    Violet = 6
}
export interface Style {
    thickness: Thickness;
    color: Color;
}
