import type * as Wss from "./wss";
import * as Msg from "@/common/msg";

import * as Redis from "./redis";

export const handlers: Wss.Handlers = {
  [Msg.ClientType.Join]: (session) => {
    Redis.client.lrange(
      `commit:${session.roomId}:stroke:ids`,
      0,
      -1,
      (err, ids) => {
        for (const id of ids) {
          Redis.client.lrange(
            `commit:${session.roomId}:strokes:${id}:x`,
            0,
            -1,
            (_, xs) => {
              Redis.client.lrange(
                `commit:${session.roomId}:strokes:${id}:y`,
                0,
                -1,
                (_, ys) => {
                  const pts: [number, number][] = xs.map((x, i) => [
                    Number(x),
                    Number(ys[i]),
                  ]);
                  session.reply({ type: Msg.HostType.Init, data: [pts] });
                  //console.log(pts);
                }
              );
            }
          );
        }
      }
    );
  },
  [Msg.ClientType.WorkStart]: (session, data) => {
    if (!Array.isArray(data)) return;
    const [x, y] = <unknown[]>data;
    if (typeof x !== "number" || typeof y !== "number") return;

    session.sendOthers({
      type: Msg.HostType.WorkStart,
      data: { uuid: session.clientId, point: [x, y] },
    });

    Redis.client
      .multi()
      .rpush(`work:${session.roomId}:${session.clientId}:x`, x.toString())
      .rpush(`work:${session.roomId}:${session.clientId}:y`, y.toString())
      .exec();
  },
  [Msg.ClientType.WorkMove]: (session, data) => {
    if (!Array.isArray(data)) return;
    const [x, y] = <unknown[]>data;
    if (typeof x !== "number" || typeof y !== "number") return;

    session.sendOthers({
      type: Msg.HostType.WorkMove,
      data: { uuid: session.clientId, point: [x, y] },
    });

    Redis.client
      .multi()
      .rpush(`work:${session.roomId}:${session.clientId}:x`, x.toString())
      .rpush(`work:${session.roomId}:${session.clientId}:y`, y.toString())
      .exec();
  },
  [Msg.ClientType.Commit]: (session) => {
    session.sendOthers({
      type: Msg.HostType.Commit,
      data: { uuid: session.clientId },
    });

    Redis.client.incr(`commit:${session.roomId}:stroke:id`, (_, id) => {
      Redis.client
        .multi()
        .rpush(`commit:${session.roomId}:stroke:ids`, `${id}`)
        .rename(
          `work:${session.roomId}:${session.clientId}:x`,
          `commit:${session.roomId}:strokes:${id}:x`
        )
        .rename(
          `work:${session.roomId}:${session.clientId}:y`,
          `commit:${session.roomId}:strokes:${id}:y`
        )
        .exec();
    });
  },
};
