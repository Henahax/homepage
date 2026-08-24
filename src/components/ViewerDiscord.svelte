<!-- src/components/discord/DiscordViewer.svelte -->
<script lang="ts">
  import { onMount } from "svelte";
  import ViewerChannel from "./ViewerChannel.svelte";
  import ViewerClient from "./ViewerClient.svelte";

  // Types for Discord widget JSON
  type WidgetChannel = { id: string; name: string; position?: number };
  type WidgetMember = {
    id: string;
    username: string;
    discriminator?: string;
    status?: "online" | "idle" | "dnd" | "offline";
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
  const {
    guildId,
    invite,
    refreshMs = 300_000,
  } = $props<{
    guildId: string;
    invite: string;
    refreshMs?: number;
  }>();

  // ✅ Runes state
  let loading = $state(true); // nur für den allerersten Load
  let error: string | null = $state(null);
  let data: WidgetData | null = $state(null);

  function endpoint(id: string) {
    return `https://discord.com/api/guilds/${id}/widget.json`;
    // If you add a proxy endpoint later, switch it here:
    // return `/api/discord-widget.json?guildId=${encodeURIComponent(id)}`;
  }

  // Stabiler Vergleichssnapshot: Members/Channels nach ID sortiert,
  // damit eine bloße Umordnung nicht als Änderung zählt.
  function snapshot(w: WidgetData): string {
    return JSON.stringify({
      id: w.id,
      name: w.name,
      instant_invite: w.instant_invite ?? null,
      presence_count: w.presence_count ?? 0,
      channels: [...(w.channels ?? [])]
        .map((c) => ({ id: c.id, name: c.name, position: c.position ?? null }))
        .sort((a, b) => Number(a.id) - Number(b.id)),
      members: [...(w.members ?? [])]
        .map((m) => ({
          id: m.id,
          username: m.username,
          discriminator: m.discriminator ?? null,
          status: m.status ?? "",
          avatar_url: m.avatar_url,
          game: m.game?.name ?? "",
          channel_id: m.channel_id ?? "",
        }))
        .sort((a, b) => Number(a.id) - Number(b.id)),
    });
  }

  async function load() {
    try {
      const res = await fetch(endpoint(guildId), { cache: "no-store" });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const next: WidgetData = await res.json();

      // UI nur anfassen, wenn sich tatsächlich etwas geändert hat
      if (!data || snapshot(next) !== snapshot(data)) {
        data = next;
        error = null;
      }
    } catch (e: any) {
      // Bei fehlgeschlagenen Hintergrund-Refreshs alte Daten behalten;
      // Fehler nur zeigen, wenn wir gar keine Daten haben.
      if (!data) error = e?.message ?? "Unknown error";
    } finally {
      loading = false;
    }
  }

  // ✅ Lädt beim Mount und reagiert auf Prop-Änderungen (z.B. andere Guild),
  // räumt das Intervall sauber auf. Kein sichtbares Re-Render ohne Änderungen.
  $effect(() => {
    load();
    const t = window.setInterval(load, refreshMs);
    return () => window.clearInterval(t);
  });
</script>

{#if loading}
  <div class="animate-pulse text-sm">Lade Discord…</div>
{:else if error}
  <div class="text-red-400 text-sm">
    Konnte Discord nicht laden: {error}.
    <a class="underline" href={invite} rel="noopener noreferrer" target="_blank"
      >Direkt beitreten</a
    >
  </div>
{:else if data}
  <div class="flex flex-col gap-4">
    {#if data.channels?.length > 0}
      <div class="channels flex flex-col gap-1">
        <div class="text-xs uppercase">channel</div>
        <ul class="flex flex-col gap-1">
          {#each data.channels as channel}
            <li class="flex text-sm flex-col">
              <ViewerChannel>
                <i slot="icon" class="fa-solid fa-volume-high text-xs"></i>
                <div slot="name">{channel.name}</div>
                <div slot="usercount" class="text-xs text-neutral-500">
                  {#if (data.members ?? []).filter((m) => m.channel_id === channel.id).length > 0}
                    <i class="fa-solid fa-user"></i>
                    {(data.members ?? []).filter(
                      (m) => m.channel_id === channel.id,
                    ).length}
                  {/if}
                </div>
                <div slot="content">
                  {#if (data.members ?? []).some((m) => m.channel_id === channel.id)}
                    <ul class="flex flex-col pl-9 gap-1">
                      {#each (data.members ?? []).filter((m) => m.channel_id === channel.id) as member}
                        <ViewerClient>
                          <img
                            slot="icon"
                            class="w-4 h-4 rounded-full"
                            src={member.avatar_url}
                            alt={`${member.username}'s avatar`}
                            loading="lazy"
                            decoding="async"
                            referrerpolicy="no-referrer"
                          />
                          <div slot="name">{member.username}</div>
                        </ViewerClient>
                      {/each}
                    </ul>
                  {/if}
                </div>
              </ViewerChannel>
            </li>
          {/each}
        </ul>
      </div>
    {/if}

    {#if (data.members?.length ?? 0) > 0}
      <div class="flex flex-col gap-1 grow">
        <div class="text-xs uppercase">online</div>
        <ul class="flex flex-col">
          {#each data.members as member}
            <ViewerClient>
              <img
                slot="icon"
                class="w-4 h-4 rounded-full"
                src={member.avatar_url}
                alt={`${member.username}'s avatar`}
                loading="lazy"
                decoding="async"
                referrerpolicy="no-referrer"
              />
              <div slot="name">
                {member.username}
              </div>
            </ViewerClient>
          {/each}
        </ul>
      </div>
    {/if}
  </div>
{:else}
  <div class="text-sm">Keine Daten verfügbar.</div>
{/if}
