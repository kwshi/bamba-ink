<script>
  export let onStart: (pt: [number, number]) => void;
  export let onMove: (pt: [number, number]) => void;
  export let onCommit: (s: [number, number][]) => void;
  //export let onStroke: (s: [number, number][]) => void = () => undefined;

  let width: number = 0;
  let height: number = 0;

  let stroke: [number, number][] = [];
  let active: boolean = false;

  let d: string = "";

  const start = (ev: MouseEvent) => {
    active = true;
    const pt: [number, number] = [ev.clientX, ev.clientY];
    stroke = [pt];
    onStart(pt);
  };

  const move = (ev: MouseEvent) => {
    if (!active) return;
    const pt: [number, number] = [ev.clientX, ev.clientY];
    stroke = [...stroke, pt];
    onMove(pt);
  };

  const end = () => {
    onCommit(stroke);

    active = false;
    stroke = [];
  };

  $: d = stroke.length
    ? `M${stroke[0]} ${stroke
        .slice(1)
        .map((pt) => `L${pt}`)
        .join("")}`
    : "";
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

<svg
  width="100%"
  height="100%"
  on:mousedown={start}
  on:mousemove={move}
  on:mouseup={end}
>
  <path
    stroke="red"
    fill="none"
    stroke-width="2"
    stroke-linejoin="round"
    stroke-linecap="round"
    {d}
  />
</svg>

<style>
  svg {
    @apply absolute left-0 top-0;
  }
</style>
