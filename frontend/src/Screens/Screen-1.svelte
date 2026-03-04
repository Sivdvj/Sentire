<script>
	import Checkin from "../lib/Checkin.svelte";
	import Navigation from "../lib/Navigation.svelte";
	import Ecomp from "../lib/EmotionComp.svelte";
	export let goto;
</script>

<div class="scrollbar-hide h-full w-full space-y-20 overflow-y-auto scroll-smooth p-4">
	<div class="h-2/3 overflow-hidden">
		<Checkin {goto} />
	</div>
	<div class="mb-20">
		<Ecomp {goto} />
	</div>
</div>
<div class="fixed right-0 bottom-0 left-0 z-10 h-24 w-full bg-gradient-to-t from-black/95 from-60% to-transparent to-100% md:absolute">
	<Navigation {goto} active="checkin" />
</div>

<style>
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}
</style>
