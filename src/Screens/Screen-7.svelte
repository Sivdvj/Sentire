<script>
	import Ecomp from "../lib/EmotionComp.svelte";
	import Icons from "../lib/Icons.svelte";
	export let goto;
</script>

<div class="scrollbar-hide h-full w-full space-y-5 overflow-y-auto scroll-smooth p-4">
	<button class="flex w-full justify-center text-3xl text-white opacity-80" on:click={() => goto("screen1")}>
		<Icons icon="material-symbols-light:family-home-outline-rounded" size={20} width={20} height={20} showCircle={false} />
	</button>
	<Ecomp {goto} />
</div>

<style>
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}
</style>
