<script>
  import { onMount } from "svelte";

  export let onStroke: (s: [number, number][]) => void = () => undefined;

  let width: number = 0;
  let height: number = 0;
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  let stroke: [number, number][] = [];
  let active: boolean = false;

  onMount(() => {
    ctx = canvas.getContext("2d")!;
  });

  $: {
    if (canvas && ctx) {
      canvas.width = width;
      canvas.height = height;
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "red";
    }
  }

  $: {
    if (stroke.length) {
      width;
      height;
      stroke;

      const [first, ...rest] = stroke;
      ctx.clearRect(0, 0, width, height);
      ctx.beginPath();
      ctx.moveTo(...first);
      for (const pt of rest) ctx.lineTo(...pt);
      ctx.stroke();
    }
  }

  const start = (ev: MouseEvent) => {
    active = true;
    stroke = [[ev.clientX, ev.clientY]];
  };

  const move = (ev: MouseEvent) => {
    if (!active) return;
    stroke = [...stroke, [ev.clientX, ev.clientY]];
  };

  const end = () => {
    onStroke(stroke);

    active = false;
    stroke = [];
    ctx.clearRect(0, 0, width, height);
  };
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

<canvas
  bind:this={canvas}
  on:mousedown={start}
  on:mousemove={move}
  on:mouseup={end}
/>

<style>
  canvas {
    @apply absolute inset-0;
  }
</style>
