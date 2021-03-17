<script>
  export let strokes: [number, number][][];

  $: d = strokes
    .map((stroke) =>
      stroke.length
        ? `M${stroke[0]}${stroke
            .slice(1)
            .map((pt) => `L${pt}`)
            .join("")}`
        : ""
    )
    .join("");
</script>

<svg width="100%" height="100%">
  <path
    stroke="black"
    fill="none"
    stroke-width="2"
    stroke-linejoin="round"
    stroke-linecap="round"
    {d}
  />
</svg>

<style>
  svg {
    @apply absolute top-0 left-0;
  }
</style>
