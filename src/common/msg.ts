import type { Point, Stroke } from "./stroke";

export type ToUnion<T> = { [K in keyof T]: { type: K; data: T[K] } }[keyof T];

export enum ClientType {
  WorkStart,
  WorkMove,
  Commit,
}

export interface ClientData {
  [ClientType.WorkStart]: Point;
  [ClientType.WorkMove]: Point;
  [ClientType.Commit]: null;
}

export type ClientMsg = ToUnion<ClientData>;

export enum HostType {
  Init,
  WorkStart,
  WorkMove,
  Commit,
}

export interface HostData {
  [HostType.Init]: { strokes: Stroke[] };
  [HostType.WorkStart]: { uuid: string; point: Point };
  [HostType.WorkMove]: { uuid: string; point: Point };
  [HostType.Commit]: { uuid: string };
}

export type HostMsg = ToUnion<HostData>;
