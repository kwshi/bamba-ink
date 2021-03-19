import type * as Stroke from "./stroke";

export type ToUnion<T> = {
  [K in keyof T]: { type: K } & (T[K] extends void ? {} : { data: T[K] });
}[keyof T];

export enum ClientType {
  Join,

  //CursorMove,
  //CursorColor,
  //CursorThickness,
  //CursorTool,
  //StrokeStart,
  //StrokeMove,
  //StrokeCommit,
  //EraseStart,
  //EraseAdd,
  //EraseCommit,
  //TextCreate,
  //TextEdit,
  //ViewportMove,
  //BoardClear,

  WorkStart,
  WorkMove,
  Commit,
}

export interface ClientData {
  [ClientType.Join]: null;
  [ClientType.WorkStart]: Stroke.Point;
  [ClientType.WorkMove]: Stroke.Point;
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
  [HostType.Init]: Stroke.Stroke[];
  [HostType.WorkStart]: { uuid: string; point: Stroke.Point };
  [HostType.WorkMove]: { uuid: string; point: Stroke.Point };
  [HostType.Commit]: { uuid: string };
}

export type HostMsg = ToUnion<HostData>;
