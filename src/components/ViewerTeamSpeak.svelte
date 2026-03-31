<script lang="ts">
  import { onMount } from "svelte";

  import TeamSpeakChannelList from "./ViewerTeamSpeakChannelList.svelte";

  let tree = $state<any[]>([]);
  let loading = $state(true);

  async function load() {
    const res = await fetch("http://192.168.0.11:8082/api/teamspeak/tree");
    tree = await res.json();

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
  <TeamSpeakChannelList tree={tree} />
{/if}
