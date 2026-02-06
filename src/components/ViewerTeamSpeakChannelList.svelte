<script>
  import ChannelList from "./ViewerTeamSpeakChannelList.svelte";
  import ViewerChannel from "./ViewerChannel.svelte";
  import ViewerClient from "./ViewerClient.svelte";

  export let tree = [];

  // Detect spacer channels
  function isSpacer(channel) {
    const name = channel.name ?? "";
    return (
      name.startsWith("[cspacer") ||
      name.startsWith("[spacer") ||
      /^[\s\-_.•═─]+$/.test(name)
    );
  }

  // Optional: clean up spacer display name
  function spacerLabel(name) {
    return name.replace(/^\[(c)?spacer[^\]]*\]/i, "").trim();
  }
</script>

<ul class="flex flex-col gap-1">
  {#each tree as channel}
    <li class="flex flex-col gap-1">
      {#if isSpacer(channel)}
        <!-- Spacer rendering -->
        <div class="select-none uppercase text-xs">
          {spacerLabel(channel.name) || " "}
        </div>
        {#if channel.children.length}
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
            {#if channel.clients.length}
              <ul class="flex flex-col pl-9 gap-1">
                {#each channel.clients as client}
                  <ViewerClient>
                    <i slot="icon" class="fa-solid fa-circle text-sky-700"></i>
                    <div slot="name">{client.nickname}</div>
                  </ViewerClient>
                {/each}
              </ul>
            {/if}

            {#if channel.children.length}
              <div class="pl-4">
                <ChannelList tree={channel.children} />
              </div>
            {/if}
          </div>
        </ViewerChannel>
      {/if}
    </li>
  {/each}
</ul>
