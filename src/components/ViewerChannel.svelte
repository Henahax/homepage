<script lang="ts">

</script>

<details open>
    <summary class="flex">
        <div class="grid grid-cols-[auto_auto_1fr] items-center gap-2 text-neutral-300">
            <i class="arrow fa-solid fa-angle-right text-xs"></i>
            <slot name="icon"/>
            <slot name="name"/>
        </div>
    </summary>
    <slot name="content" class="grid-cols-full"/>
</details>

<style>
    details > summary .arrow {
        transition: transform 0.25s ease;
    }

    details[open] > summary .arrow {
        transform: rotate(90deg);
    }

    :global(details:has(ul) > summary) {
        cursor: pointer;
        transition: color 0.25s ease;
    }

    :global(details:has(ul) > summary:hover * ) {
        color: var(--color-white)
    }

    :global(details:not(:has(ul)) > summary .arrow) {
        opacity: 0;
    }
</style>