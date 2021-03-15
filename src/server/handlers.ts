import type * as Wss from "./wss";
import * as Msg from "@/common/msg";

export const handlers: Wss.Handlers = {
  [Msg.ClientType.Join]: () => {},
  [Msg.ClientType.WorkStart]: (session, data) => {
    if (!Array.isArray(data)) return;
    const [x, y] = <unknown[]>data;
    if (typeof x !== "number" || typeof y !== "number") return;

    session.sendOthers({
      type: Msg.HostType.WorkStart,
      data: { uuid: session.clientId, point: [x, y] },
    });
  },
  [Msg.ClientType.WorkMove]: (session, data) => {
    if (!Array.isArray(data)) return;
    const [x, y] = <unknown[]>data;
    if (typeof x !== "number" || typeof y !== "number") return;

    session.sendOthers({
      type: Msg.HostType.WorkMove,
      data: { uuid: session.clientId, point: [x, y] },
    });
  },
  [Msg.ClientType.Commit]: (session, data) => {
    session.sendOthers({
      type: Msg.HostType.Commit,
      data: { uuid: session.clientId },
    });
  },
};
