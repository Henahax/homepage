<script lang="ts">
	import { onMount } from 'svelte'
	import TeamSpeakChannelList from './ViewerTeamSpeakChannelList.svelte'

	let tree = $state<any[]>([])
	let loading = $state(true)
	let lastSnapshot = ''

	async function load() {
		try {
			const res = await fetch('https://api.henahax.net/api/teamspeak/tree')
			if (!res.ok) throw new Error('Failed to fetch')
			const nextTree = await res.json()
			const nextSnapshot = JSON.stringify(nextTree)

			if (nextSnapshot !== lastSnapshot) {
				tree = nextTree
				lastSnapshot = nextSnapshot
			}
		} catch (e) {
			console.error('TeamSpeak fetch error:', e)
		} finally {
			loading = false
		}
	}

	onMount(() => {
		load()
		const interval = setInterval(load, 300_000)
		return () => clearInterval(interval)
	})
</script>

{#if loading && tree.length === 0}
	<p>Loading TeamSpeak…</p>
{:else}
	<TeamSpeakChannelList {tree} />
{/if}
