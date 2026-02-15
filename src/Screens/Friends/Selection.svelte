<script>
	import { onMount } from "svelte";
	import { request } from "../../lib/Auth";
	import Ecomp1 from "../../lib/Ecomp1.svelte";
	import ThreeParticles from "../../lib/ThreeParticles.svelte";
	export let goto;

	let friends = [];
	let selectedFriends = [];
	let emo = localStorage.getItem("Emotion");
	let color = localStorage.getItem("Color");

	onMount(async () => {
		let res = await request("/friend/getAll");
		if (res.ok) {
			friends = res.list;
		}
	});

	function getImage(color) {
		if (!color) return "/assets/1.png";
		const hex = color.replace("#", "");
		const r = parseInt(hex.substring(0, 2), 16);
		const g = parseInt(hex.substring(2, 4), 16);
		const b = parseInt(hex.substring(4, 6), 16);

		if (b > r && b > g * 0.8) return "/assets/3.png"; // Blue
		if (g > r && g > b) return "/assets/2.png"; // Green
		if (g > r * 0.75) return "/assets/4.png"; // Yellow
		return "/assets/1.png"; // Red
	}

	async function handleShare() {
		let Id = localStorage.getItem("currID");

		await request("/share", {
			Id,
			emo,
			color,
			viewers: selectedFriends,
		});

		goto("screen7");
	}
</script>

<div class="scrollbar-hide h-full w-full space-y-20 overflow-y-auto scroll-smooth p-4">
	<div class="pointer-events-none absolute inset-0 z-0 opacity-60 blur-md">
		<ThreeParticles colorParticles={localStorage.getItem("Color")} />
	</div>
	<div class="relative z-10 px-4 pt-10 font-serif text-4xl font-bold text-white">Share with Friends</div>
	<div class="mb-6">
		<Ecomp1 text={emo} {color} image={getImage(color)} />
	</div>

	<div class="relative z-10 mb-4 flex flex-1 flex-col overflow-hidden">
		<h2 class="mt-10 mb-4 font-serif text-xl text-white italic">Select friends you want to share your emotion with</h2>
		<div class="flex flex-col space-y-3 overflow-y-auto pr-2 text-white">
			{#each friends as friend}
				<label class="flex cursor-pointer items-center space-x-3 rounded-xl bg-white/10 p-4 hover:bg-white/15">
					<input type="checkbox" bind:group={selectedFriends} value={friend.id} class="h-5 w-5 rounded" style="accent-color:{color}" />
					<span class="text-lg font-medium">{friend.name}</span>
				</label>
			{/each}
			{#if friends.length === 0}
				<div class="rounded-xl bg-white/5 p-6 text-center">
					<p class="text-white/60">No friends found.</p>
				</div>
			{/if}
		</div>
	</div>

	<div class="fixed bottom-4 left-0 w-full md:absolute">
		<button class="w-full cursor-pointer rounded-full bg-white/80 py-4 text-lg font-bold text-black hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50" disabled={selectedFriends.length === 0} on:click={handleShare}> Save and Share </button>
	</div>
</div>

<style>
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}
</style>
