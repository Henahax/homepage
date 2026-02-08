<script lang="ts">
  import { onMount } from "svelte";

  import TeamSpeakChannelList from "./ViewerTeamSpeakChannelList.svelte";

  let tree:any = [];
  let loading = true;

  async function load() {
    const res = await fetch("/api/teamspeak");
    tree = await res.json();

    console.log("--- Viewer ---");
    console.log(tree);

    loading = false;
  }

  onMount(() => {
    load();
    const interval = setInterval(load, 300_000);
    return () => clearInterval(interval);
  });
</script>

{#if loading}
  <p>Loading TeamSpeak…</p>
{:else}
  <TeamSpeakChannelList {tree} />
{/if}
