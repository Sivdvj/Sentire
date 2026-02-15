<script>
	import { onMount } from "svelte";
	export let buttons = [];
	let selected = new Set();

	onMount(() => {
		let stored = localStorage.getItem("Activity");
		if (stored) {
			try {
				let parsed = JSON.parse(stored);
				if (Array.isArray(parsed)) {
					parsed.forEach((item) => {
						if (buttons.includes(item)) selected.add(item);
					});
				}
			} catch (e) {
				console.error("Failed to parse Activity", e);
			}
		}
		selected = selected;
	});

	function toggleColor(item) {
		let list = [];
		try {
			list = JSON.parse(localStorage.getItem("Activity") || "[]");
		} catch (e) {
			list = [];
		}

		if (selected.has(item)) {
			selected.delete(item);
			list = list.filter((i) => i !== item);
		} else {
			selected.add(item);
			if (!list.includes(item)) {
				list.push(item);
			}
		}

		localStorage.setItem("Activity", JSON.stringify(list));
		selected = selected;
	}
</script>

<div class="flex flex-wrap items-start justify-start gap-2 py-5">
	{#each buttons as item}
		<button class="rounded-full px-6 py-3 text-[15px] text-white transition-colors duration-200 {selected.has(item) ? 'bg-white/40 font-semibold' : 'bg-gray-700/50 hover:bg-gray-500/50'}" on:click={() => toggleColor(item)}>
			{item}
		</button>
	{/each}
</div>
