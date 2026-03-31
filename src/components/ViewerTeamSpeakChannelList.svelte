<script>
  import ChannelList from "./ViewerTeamSpeakChannelList.svelte";
  import ViewerChannel from "./ViewerChannel.svelte";
  import ViewerClient from "./ViewerClient.svelte";

  let {tree} = $props();

  // Normalize incoming tree data. Accepts nested arrays using `subchannels` or `children`,
  // or a flat list with `parentId` references. Ensures `children` and `clients` exist
  // Normalize incoming tree data. API provides a nested `subchannels` tree already
  // ordered by TeamSpeak; just convert `subchannels` -> `children` and ensure clients exist.
  function normalizeTree(input) {
    if (!Array.isArray(input)) return [];

    const ensureShape = (item) => ({
      ...item,
      children: Array.isArray(item.children) ? item.children : Array.isArray(item.subchannels) ? item.subchannels : [],
      clients: Array.isArray(item.clients) ? item.clients : [],
    });

    const convert = (arr = []) =>
      arr.map((raw) => {
        const it = ensureShape(raw);
        return { ...it, children: convert(it.children) };
      });

    return convert(input);
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
                  {#if client.type == 0}
                    <ViewerClient>
                      <i slot="icon" class="fa-solid fa-circle text-sky-700"></i>
                      <div slot="name">{client.nickname}</div>
                    </ViewerClient>
                  {/if}
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
