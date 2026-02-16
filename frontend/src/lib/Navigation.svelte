<script>
	import Plus from "@iconify-svelte/material-symbols-light/add-2-rounded";
	import Data from "@iconify-svelte/material-symbols-light/bar-chart-rounded";
	import Tools from "@iconify-svelte/material-symbols-light/arrows-more-down-outline-rounded";
	import Ppl from "@iconify-svelte/material-symbols-light/group-outline-rounded";
	export let goto;
</script>

<div class="flex h-full w-full flex-row items-end justify-between pr-5 pb-3 pl-5 text-sm text-white">
	<button class="flex cursor-pointer flex-col items-center justify-between opacity-100" onclick={() => goto("screen1")}>
		<Plus class="h-10 w-10" />
		<p>Check in</p>
	</button>
	<div class="flex flex-col items-center justify-between opacity-60">
		<Tools class="h-10 w-10" />
		<p>Tools</p>
	</div>
	<button class="flex cursor-pointer flex-col items-center justify-between opacity-60" onclick={() => goto("friends")}>
		<Ppl class="h-10 w-10" />
		<p>Friends</p>
	</button>
	<div class="flex flex-col items-center justify-between opacity-60">
		<Data class="h-10 w-10" />
		<p>Analyze</p>
	</div>
</div>
