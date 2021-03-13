<script>
  import { onMount } from "svelte";

  import WorkCanvas from "@/components/WorkCanvas";

  import * as Colors from "./_colors";

  let ws: WebSocket;

  let persistentCanvas: HTMLCanvasElement;
  let persistentCtx: CanvasRenderingContext2D;

  let screenWidth: number;
  let screenHeight: number;

  let drawing: boolean = false;
  let start: [number, number] = [0, 0];

  let paths: [number, number][][] = [];

  let color: Colors.Color = Colors.Color.Black;

  onMount(() => {
    persistentCtx = persistentCanvas.getContext("2d")!;

    ws = new WebSocket("ws://localhost:1234");
    ws.addEventListener("open", () => {});
    ws.addEventListener("message", (msg) => {
      drawStroke(JSON.parse(msg.data));
    });
  });

  $: {
    if (persistentCanvas) {
      persistentCanvas.width = screenWidth;
      persistentCanvas.height = screenHeight;

      persistentCtx.lineWidth = 2;
      persistentCtx.lineCap = "round";
      persistentCtx.lineJoin = "round";
    }
  }

  const drawStroke = (stroke: [number, number][]) => {
    if (!stroke.length) return;

    const [first, ...rest] = stroke;
    persistentCtx.beginPath();
    persistentCtx.moveTo(...first);
    for (const pt of rest) persistentCtx.lineTo(...pt);
    persistentCtx.stroke();
  };

  const addStroke = (stroke: [number, number][]) => {
    drawStroke(stroke);
    ws.send(JSON.stringify(stroke));
  };
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

<canvas bind:this={persistentCanvas} />

<WorkCanvas onStroke={addStroke} />

<div class="controls-wrapper">
  <div class="controls">
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

  canvas {
    @apply absolute inset-0;
  }

  .controls-wrapper {
    @apply absolute bottom-4 left-0 right-0 
      flex justify-center;
  }

  .controls {
    @apply bg-gray-100 
      border border-solid border-gray-300 
    shadow 
    rounded
      px-4 py-2;

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
