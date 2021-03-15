<script>
  import { onMount } from "svelte";
  import { stores } from "@sapper/app";

  import WorkLayer from "@/components/WorkLayer.svelte";
  import CommitLayer from "@/components/CommitLayer.svelte";

  import * as Colors from "./_colors";
  import * as Msg from "@/common/msg";
  import * as Board from "@/common/board";

  import * as Qs from "query-string";

  let ws: WebSocket;

  //let persistentCanvas: HTMLCanvasElement;
  //let persistentCtx: CanvasRenderingContext2D;

  let screenWidth: number;
  let screenHeight: number;

  //let drawing: boolean = false;
  //let start: [number, number] = [0, 0];

  let strokes: [number, number][][] = [];

  let color: Colors.Color = Colors.Color.Black;

  const { page } = stores();

  let board = new Board.Page();
  const boardKey = $page.params.board;

  const start = (pt: [number, number]) => {
    const msg: Msg.ClientMsg = {
      type: Msg.ClientType.WorkStart,
      data: pt,
    };
    ws.send(JSON.stringify(msg));
  };
  const update = (pt: [number, number]) => {
    const msg: Msg.ClientMsg = {
      type: Msg.ClientType.WorkMove,
      data: pt,
    };
    ws.send(JSON.stringify(msg));
  };
  const commit = (s: [number, number][]) => {
    strokes = [...strokes, s];
    const msg: Msg.ClientMsg = {
      type: Msg.ClientType.Commit,
      data: null,
    };
    ws.send(JSON.stringify(msg));
  };

  onMount(() => {
    ws = new WebSocket(
      `ws://${$page.host}/ws/board/${encodeURIComponent(boardKey)}`
    );
    ws.addEventListener("open", () => {
      console.log("connection opened");
    });
    ws.addEventListener("message", ({ data }: MessageEvent<string>) => {
      const msg: Msg.HostMsg = JSON.parse(data);
      switch (msg.type) {
        case Msg.HostType.WorkStart:
          board.workStart(msg.data.uuid, msg.data.point);
          board = board;
          break;
        case Msg.HostType.WorkMove:
          board.workMove(msg.data.uuid, msg.data.point);
          board = board;
          break;
        case Msg.HostType.Commit:
          board.commit(msg.data.uuid);
          board = board;
          break;
      }
    });
  });
</script>

<svelte:window bind:innerWidth={screenWidth} bind:innerHeight={screenHeight} />

<svelte:head>
  <title>BAM!</title>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/katex@0.13.0/dist/katex.min.css"
    integrity="sha384-t5CR+zwDAROtph0PXGte6ia8heboACF9R5l/DiY+WZ3P2lxNgvJkQk5n7GPvLMYw"
    crossorigin="anonymous"
  />
</svelte:head>

<CommitLayer
  strokes={strokes.concat(
    ...Object.values(board.commits),
    Object.values(board.work)
  )}
/>

<WorkLayer onStart={start} onMove={update} onCommit={commit} />

<div class="controls-wrapper">
  <div class="controls">
    <div class="name">
      {boardKey}
    </div>
    <div class="colors">
      {#each Object.values(Colors.Color) as clr}
        <button
          class:current={clr === color}
          on:click={() => (color = clr)}
          style="background-color: #{clr}"
        />
      {/each}
    </div>
  </div>
</div>

<style>
  :global body {
    @apply bg-gray-50 font-sans;
  }

  .controls-wrapper {
    @apply absolute bottom-4 left-1/2
      flex justify-center;
  }

  .controls {
    @apply relative -left-1/2
      bg-gray-100 
      border border-solid border-gray-300 
    shadow 
    rounded
    px-4 py-2
    grid grid-flow-col gap-x-4;

    .name {
      @apply font-bold;
    }

    .colors {
      @apply flex flex-row;

      button {
        @apply w-6 h-6 rounded-sm
          border-none outline-none 
        cursor-pointer 
          transform-gpu transition-transform duration-300;
        & + button {
          @apply ml-2;
        }
        &:hover {
          @apply scale-110;
        }
        &.current {
          @apply scale-125;
        }
      }
    }
  }
</style>
