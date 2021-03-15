import type * as Stroke from "./stroke";

import * as Util from "./util";
import * as Io from "io-ts";

export type ToUnion<T> = {
  [K in keyof T]: { type: K } & (T[K] extends void ? {} : { data: T[K] });
}[keyof T];

export enum ClientType {
  Join,
  WorkStart,
  WorkMove,
  Commit,
}

export interface ClientData {
  [ClientType.Join]: null;
  [ClientType.WorkStart]: { pt: Stroke.Point; style: Stroke.Style };
  [ClientType.WorkMove]: { pt: Stroke.Point };
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