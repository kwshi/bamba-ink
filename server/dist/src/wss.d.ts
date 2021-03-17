import type * as Msg from "@bamba/common/msg";
import * as Ws from "ws";
interface Session {
    roomId: string;
    clientId: string;
    reply(msg: Msg.HostMsg): void;
    sendAll(msg: Msg.HostMsg): void;
    sendOthers(msg: Msg.HostMsg): void;
}
declare type Handler<T extends Msg.ClientType> = (session: Session, payload: Msg.ClientData[T]) => void;
export declare type Handlers = {
    [T in Msg.ClientType]: Handler<T>;
};
export declare const setup: (opts: Ws.ServerOptions, handlers: Handlers) => void;
export {};
