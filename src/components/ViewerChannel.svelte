<script lang="ts">
</script>

<details open>
	<summary class="flex">
		<div class="grid w-full grid-cols-[auto_auto_1fr_auto] items-center gap-2">
			<i class="arrow fa-solid fa-angle-right text-xs"></i>
			<slot name="icon" />
			<slot name="name" />
			<slot name="usercount" />
		</div>
	</summary>
	<slot name="content" class="grid-cols-full" />
</details>
