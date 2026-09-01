<script>
	import ChannelList from './ViewerTeamSpeakChannelList.svelte'
	import ViewerChannel from './ViewerChannel.svelte'
	import ViewerClient from './ViewerClient.svelte'

	let { tree } = $props()

	// Normalize incoming tree data. Accepts nested arrays using `subchannels` or `children`,
	// or a flat list with `parentId` references. Ensures `children` and `clients` exist
	// Normalize incoming tree data. API provides a nested `subchannels` tree already
	// ordered by TeamSpeak; just convert `subchannels` -> `children` and ensure clients exist.
	function normalizeTree(input) {
		if (!Array.isArray(input)) return []

		const ensureShape = (item) => ({
			...item,
			children: Array.isArray(item.children)
				? item.children
				: Array.isArray(item.subchannels)
					? item.subchannels
					: [],
			clients: Array.isArray(item.clients) ? item.clients : []
		})

		const convert = (arr = []) =>
			arr.map((raw) => {
				const it = ensureShape(raw)
				return { ...it, children: convert(it.children) }
			})

		return convert(input)
	}

	// Detect spacer channels
	function isSpacer(channel) {
		const name = (channel && channel.name) || ''
		return name.startsWith('[cspacer') || name.startsWith('[spacer') || /^[\s\-_.•═─]+$/.test(name)
	}

	// Optional: clean up spacer display name
	function spacerLabel(name) {
		return (name || '').replace(/^\[(c)?spacer[^\]]*\]/i, '').trim()
	}

	function countryFlagUrl(country) {
		const code = String(country || '')
			.trim()
			.toLowerCase()
		if (code.length !== 2) return null
		return `https://flagcdn.com/w20/${code}.png`
	}

	let normalizedTree = $derived(normalizeTree(tree))
</script>

<ul class="flex w-full flex-col gap-1">
	{#each normalizedTree as channel}
		<li class="flex w-full flex-col gap-1">
			{#if isSpacer(channel)}
				<!-- Spacer rendering -->
				<div class="px-4 text-xs uppercase select-none">
					{spacerLabel(channel.name) || ' '}
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

					<div slot="usercount" class="text-xs">
						{#if (channel.clients?.filter((c) => c.type == 0).length ?? 0) > 0}
							<i class="fa-solid fa-user"></i>
							{channel.clients?.filter((c) => c.type == 0).length}
						{/if}
					</div>
					<div slot="content">
						{#if (channel.clients?.filter((c) => c.type == 0).length ?? 0) > 0}
							<ul class="flex flex-col gap-1 pl-9">
								{#each channel.clients as client}
									{#if client.type == 0}
										<ViewerClient>
											<i slot="icon" class="fa-solid fa-circle text-sky-600 opacity-75"></i>
											<div slot="name">{client.nickname}</div>
											<div slot="add">
												{#if countryFlagUrl(client.country)}
													<img
														src={countryFlagUrl(client.country)}
														alt={client.country}
														class="h-4 w-4 rounded-sm opacity-75"
													/>
												{/if}
											</div>
										</ViewerClient>
									{/if}
								{/each}
							</ul>
						{/if}

						{#if channel.children && channel.children.length}
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
