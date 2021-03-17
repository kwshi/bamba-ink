import type { Point, Stroke } from "./stroke";

export class Page {
  work: Record<string, Stroke>;
  commits: Record<string, Stroke[]>;

  constructor() {
    this.work = {};
    this.commits = {};
  }

  init(strokes: Stroke[]) {
    // TODO bad
    this.commits["init"] ||= [];
    this.commits["init"].push(...strokes);
  }

  workStart(uuid: string, point: Point) {
    this.work[uuid] = [point];
  }

  workMove(uuid: string, point: Point) {
    this.work[uuid]?.push(point);
  }

  commit(uuid: string) {
    this.commits[uuid] ||= [];
    this.commits[uuid].push(this.work[uuid]);
    this.work[uuid] = [];
  }
}
