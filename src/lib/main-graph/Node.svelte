<script>
    export let point,
        colourScale,
        setNodeHovered,
        grid,
        radius,
        multiplier,
        transform;

    const gridX = (x) => {
        return Math.round(x / grid) * grid || x || 100;
    };

    const gridY = (y) => {
        return Math.round(y / grid) * grid || y || 100;
    };

    $: if (grid > 1 && point.x) point.x = gridX(point.x);
    $: if (grid > 1 && point.y) point.y = gridY(point.y);
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<g
    on:click={() => {
        if (!point.modalOpened) point.modalOpened = true;
        else point.modalOpened = false;
    }}
    on:mouseenter={setNodeHovered(point.id)}
    on:mouseleave={setNodeHovered}
    class="node"
>
    <text
        fill={colourScale(point.group)}
        x={point.x}
        y={point.y - radius * 1.5 || point.y}
        text-anchor="middle"
        transform="
        translate({transform.x || 0} {transform.y || 0}) 
        scale({transform.k} {transform.k})"
    >
        ID: {point.id}
    </text>
    
    <!-- squares -->
    {#if point.group === 5}
        <rect
            class="node"
            width={radius * 2}
            height={radius * 2}
            fill={colourScale(point.group)}
            stroke-opacity={0.6}
            stroke={colourScale(point.group)}
            x={point.x - radius || point.x}
            y={point.y - radius || point.y}
            transform="translate({transform.x} {transform.y}) scale({transform.k} {transform.k})"
        />
        <!-- triangles -->
    {:else if point.group === 6}
        <polygon
            class="node"
            points="{point.x - radius || 0},{point.y + radius || 0}
            {point.x + radius || 0},{point.y + radius || 0} 
            {point.x || 0},{point.y - radius || 0}"
            fill={colourScale(point.group)}
            stroke-opacity={0.6}
            stroke={colourScale(point.group)}
            x={point.x - radius || point.x}
            y={point.y - radius || point.y}
            transform="translate({transform.x} {transform.y}) scale({transform.k} {transform.k})"
        />
        <!-- circles -->
    {:else}
        <circle
            class="node"
            r={radius}
            fill={colourScale(point.group)}
            stroke-opacity={0.6}
            stroke={colourScale(point.group)}
            cx={point.x}
            cy={point.y}
            transform="translate({transform.x} {transform.y}) scale({transform.k} {transform.k})"
        />
    {/if}
</g>

<style lang="postcss">
    circle.node,
    rect.node,
    polygon.node {
        @apply stroke-[0.9rem];
    }
</style>
