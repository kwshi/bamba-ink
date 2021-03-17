import * as Stroke from "./stroke";
export declare type ToUnion<T> = {
    [K in keyof T]: {
        type: K;
    } & (T[K] extends void ? {} : {
        data: T[K];
    });
}[keyof T];
export declare enum ClientType {
    Join = 0,
    WorkStart = 1,
    WorkMove = 2,
    Commit = 3
}
export interface ClientData {
    [ClientType.Join]: null;
    [ClientType.WorkStart]: {
        pt: Stroke.Point;
        style: Stroke.Style;
    };
    [ClientType.WorkMove]: {
        pt: Stroke.Point;
    };
    [ClientType.Commit]: null;
}
export declare type ClientMsg = ToUnion<ClientData>;
export declare enum HostType {
    Init = 0,
    WorkStart = 1,
    WorkMove = 2,
    Commit = 3
}
export interface HostData {
    [HostType.Init]: Stroke.Stroke[];
    [HostType.WorkStart]: {
        uuid: string;
        point: Stroke.Point;
    };
    [HostType.WorkMove]: {
        uuid: string;
        point: Stroke.Point;
    };
    [HostType.Commit]: {
        uuid: string;
    };
}
export declare type HostMsg = ToUnion<HostData>;
