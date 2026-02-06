<!-- src/components/discord/DiscordViewer.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';

  // Types for Discord widget JSON
  type WidgetChannel = { id: string; name: string; position?: number };
  type WidgetMember = {
    id: string;
    username: string;
    discriminator?: string;
    status?: 'online' | 'idle' | 'dnd' | 'offline';
    avatar_url: string;
    game?: { name: string };
    channel_id?: string;
  };
  type WidgetData = {
    id: string;
    name: string;
    instant_invite?: string | null;
    channels: WidgetChannel[];
    members: WidgetMember[];
    presence_count?: number;
  };

  // ✅ Svelte 5 rune for props (reactive)
  const { guildId, invite, refreshMs = 300_000 } = $props<{
    guildId: string;
    invite: string;
    refreshMs?: number;
  }>();

  // ✅ Runes state
  let loading = $state(true);
  let error: string | null = $state(null);
  let data: WidgetData | null = $state(null);

  function endpoint(id: string) {
    return `https://discord.com/api/guilds/${id}/widget.json`;
    // If you add a proxy endpoint later, switch it here:
    // return `/api/discord-widget.json?guildId=${encodeURIComponent(id)}`;
  }

  async function load(id = guildId) {
    loading = true;
    error = null;
    try {
      const res = await fetch(endpoint(id), { cache: 'no-store' });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      data = await res.json();
    } catch (e: any) {
      error = e?.message ?? 'Unknown error';
      data = null;
    } finally {
      loading = false;
    }
  }

  let timer: number | null = null;

  onMount(() => {
    load(guildId);
    timer = window.setInterval(() => load(guildId), refreshMs);
    return () => {
      if (timer) window.clearInterval(timer);
    };
  });

  // ✅ React if props change at runtime (e.g., parent swaps guild)
  $effect(() => {
    // Re-run when guildId or refreshMs change
    // Reset interval with new cadence
    if (timer) clearInterval(timer);
    load(guildId);
    timer = window.setInterval(() => load(guildId), refreshMs);
  });
</script>

{#if loading}
  <div class="animate-pulse text-sm">Lade Discord…</div>
{:else if error}
  <div class="text-red-400 text-sm">
    Konnte Discord nicht laden: {error}.
    <a class="underline" href={invite} rel="noopener noreferrer" target="_blank">Direkt beitreten</a>
  </div>
{:else if data}
  <div class="flex flex-col gap-4">
    {#if data.channels?.length > 0}
      <div class="channels flex flex-col gap-1">
        <div class="text-xs uppercase">channel</div>
        <ul class="flex flex-col text-white gap-1">
          {#each data.channels as channel}
            <li class="flex text-sm flex-col">
                <details open>
                    <summary>
                        <i class="fa-solid fa-volume-high"></i>
                          {channel.name}
                    </summary>
                    <ul class="flex flex-col px-2">
                {#each (data.members ?? []).filter(m => m.channel_id === channel.id) as member}
                  <li class="flex gap-2 items-center text-sm">
                    <img
                      class="w-4 h-4 rounded-full"
                      src={member.avatar_url}
                      alt={`${member.username}'s avatar`}
                      loading="lazy"
                      decoding="async"
                      referrerpolicy="no-referrer"
                    />
                    {member.username}
                  </li>
                {/each}
              </ul>
                </details>
            </li>
          {/each}
        </ul>
      </div>
    {/if}

    {#if (data.members?.length ?? 0) > 0}
      <div class="flex flex-col gap-1 grow">
        <div class="text-xs uppercase">online</div>
        <ul class="flex flex-col text-white">
          {#each data.members as member}
            <li class="flex gap-2 items-center text-sm">
              <img
                class="size-4 rounded-full"
                src={member.avatar_url}
                alt={`${member.username}'s avatar`}
                loading="lazy"
                decoding="async"
                referrerpolicy="no-referrer"
              />
              {member.username}
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  </div>
{:else}
  <div class="text-sm">Keine Daten verfügbar.</div>
{/if}

<style>
    details > summary {
        cursor: pointer;
       color: var(--color-neutral-400);
       transition: all 0.25s;
    }

    details > summary:hover {
        color: var(--color-white)
    }
</style>