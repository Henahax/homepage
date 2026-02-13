<script>
  import ChannelList from "./ViewerTeamSpeakChannelList.svelte";
  import ViewerChannel from "./ViewerChannel.svelte";
  import ViewerClient from "./ViewerClient.svelte";

  let {tree} = $props();

  // Normalize incoming tree data. Accepts nested arrays using `subchannels` or `children`,
  // or a flat list with `parentId` references. Ensures `children` and `clients` exist
  // and sorts channels by `order` recursively.
  function normalizeTree(input) {
    if (!Array.isArray(input)) return [];

    const ensureShape = (item) => ({
      ...item,
      children: Array.isArray(item.children) ? item.children : Array.isArray(item.subchannels) ? item.subchannels : [],
      clients: Array.isArray(item.clients) ? item.clients : [],
    });

    // If items contain parentId and there are no nested subchannels/children, treat as flat list
    const hasParentId = input.some((c) => c && Object.prototype.hasOwnProperty.call(c, 'parentId'));
    const hasNested = input.some((c) => c && ((Array.isArray(c.subchannels) && c.subchannels.length) || (Array.isArray(c.children) && c.children.length)));

    if (hasParentId && !hasNested) {
      const map = new Map();
      input.forEach((raw) => {
        const it = ensureShape(raw);
        map.set(it.id, { ...it, children: [] });
      });

      const roots = [];
      for (const item of map.values()) {
        const pid = item.parentId;
        if (pid && map.has(pid)) {
          map.get(pid).children.push(item);
        } else {
          roots.push(item);
        }
      }

      const sortRec = (arr) => {
        arr.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
        arr.forEach((c) => sortRec(c.children));
      };
      sortRec(roots);
      return roots;
    }

    // Otherwise assume nested structure; convert `subchannels` -> `children` and normalize
    const convert = (arr) =>
      arr.map((raw) => {
        const it = ensureShape(raw);
        return { ...it, children: convert(it.children || []) };
      });

    const out = convert(input);
    const sortRec = (arr) => {
      arr.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
      arr.forEach((c) => sortRec(c.children));
    };
    sortRec(out);
    return out;
  }

  // Detect spacer channels
  function isSpacer(channel) {
    const name = (channel && channel.name) || "";
    return (
      name.startsWith("[cspacer") ||
      name.startsWith("[spacer") ||
      /^[\s\-_.•═─]+$/.test(name)
    );
  }

  // Optional: clean up spacer display name
  function spacerLabel(name) {
    return (name || "").replace(/^\[(c)?spacer[^\]]*\]/i, "").trim();
  }

  let normalizedTree = $derived(normalizeTree(tree));
</script>

<ul class="flex flex-col gap-1 w-full">
  {#each normalizedTree as channel}
    <li class="flex flex-col gap-1 w-full">
      {#if isSpacer(channel)}
        <!-- Spacer rendering -->
        <div class="select-none uppercase text-xs">
          {spacerLabel(channel.name) || " "}
        </div>
        {#if channel.children && channel.children.length}
          <div class="pl-4">
            <ChannelList tree={channel.children} />
          </div>
        {/if}
      {:else}
        <!-- Normal channel -->
        <ViewerChannel>
          <i slot="icon" class="fa-solid fa-message"></i>
          <div slot="name">{channel.name}</div>
          <div slot="content">
            {#if channel.clients && channel.clients.length}
              <ul class="flex flex-col pl-9 gap-1">
                {#each channel.clients as client}
                  <ViewerClient>
                    <i slot="icon" class="fa-solid fa-circle text-sky-700"></i>
                    <div slot="name">{client.nickname}</div>
                  </ViewerClient>
                {/each}
              </ul>
            {/if}

            {#if channel.children && channel.children.length}
              <div class="pl-4">test
                <ChannelList tree={channel.children} />
              </div>
            {/if}
          </div>
        </ViewerChannel>
      {/if}
    </li>
  {/each}
</ul>
