import type { Point, Stroke } from "./stroke";
export declare class Page {
    work: Record<string, Stroke>;
    commits: Record<string, Stroke[]>;
    constructor();
    init(strokes: Stroke[]): void;
    workStart(uuid: string, point: Point): void;
    workMove(uuid: string, point: Point): void;
    commit(uuid: string): void;
}
