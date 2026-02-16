<script>
	import { onMount } from "svelte";
	import Icons from "../../lib/Icons.svelte";
	import FriendComponents from "../../lib/FriendScreen.svelte";
	import Navigation from "../../lib/Navigation.svelte";
	import { request } from "../../lib/Auth";
	import ThreeParticles from "../../lib/ThreeParticles.svelte";
	export let goto;
	let showDropdown = false;
	let showMyCode = false;
	let showEnterCode = false;
	let friendCodeInput = "";
	let myCode = "";

	onMount(async () => {
		let res = await request("/mycode");
		myCode = res.code;
		console.log(myCode);
	});
</script>

<div class="scrollbar-hide mt-10 h-full w-full space-y-10 overflow-y-auto scroll-smooth p-4">
	<div class="pointer-events-none absolute inset-0 z-0 opacity-60 blur-md">
		<ThreeParticles colorParticles={"#68A0B0"} />
	</div>
	<div class="relative z-10 flex flex-row items-center justify-between">
		<p class="px-4 font-serif text-4xl font-bold text-white">Friends</p>
		<button class="flex cursor-pointer flex-col items-center justify-between text-white" onclick={() => (showDropdown = true)}>
			<Icons icon="tabler:plus" size={10} showCircle={false} />
		</button>
	</div>

	{#if showDropdown}
		<div class="fixed inset-0 z-50 flex h-full w-full flex-col items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
			<button class="absolute inset-0 h-full w-full cursor-default" onclick={() => (showDropdown = false)} aria-label="Close"></button>
			<div class="relative z-10 w-full max-w-sm space-y-10">
				<div class="overflow-hidden rounded-2xl bg-[#1c1c1e]">
					<button
						class="flex w-full cursor-pointer items-center justify-center border-b border-white/10 p-4 text-white hover:bg-white/10"
						onclick={() => {
							showDropdown = false;
							showMyCode = true;
						}}
					>
						<span class="text-lg">Show my code</span>
					</button>
					<button
						class="flex w-full cursor-pointer items-center justify-center border-b border-white/10 p-4 text-white hover:bg-white/10"
						onclick={() => {
							showDropdown = false;
							showEnterCode = true;
						}}
					>
						<span class="text-lg">Enter a friend's code</span>
					</button>
				</div>
				<button class="w-full cursor-pointer rounded-2xl bg-[#1c1c1e] p-4 text-lg font-bold text-white hover:bg-white/10" onclick={() => (showDropdown = false)}> Cancel </button>
			</div>
		</div>
	{/if}

	{#if showMyCode}
		<div class="fixed inset-0 z-50 flex h-full w-full flex-col items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
			<button class="absolute inset-0 h-full w-full cursor-default" onclick={() => (showMyCode = false)} aria-label="Close"></button>
			<div class="relative z-10 w-full max-w-xs rounded-2xl bg-[#1c1c1e] p-6 text-center text-white">
				<p class="mb-4 text-xl font-bold">Your Code</p>
				<p class="mb-4 text-sm text-white/60">Share this code with your friends so they can add you</p>

				<div class="mb-4 flex items-center justify-center rounded-xl bg-white/5 p-4">
					<span class="spacing-widest font-mono text-3xl font-bold text-yellow-400">{myCode}</span>
				</div>

				<button class="w-full cursor-pointer rounded-xl bg-white p-3 font-bold text-black" onclick={() => (showMyCode = false)}> Done </button>
			</div>
		</div>
	{/if}

	{#if showEnterCode}
		<div class="fixed inset-0 z-50 flex h-full w-full flex-col items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
			<button class="absolute inset-0 h-full w-full cursor-default" onclick={() => (showEnterCode = false)} aria-label="Close"></button>
			<div class="relative z-10 w-full max-w-xs overflow-hidden rounded-2xl bg-[#1c1c1e] p-6 text-center text-white shadow-2xl">
				<p class="mb-4 text-xl font-bold">Add a Friend</p>
				<p class="mb-4 text-sm text-white/60">Enter your friend's code below to connect with them</p>

				<input type="text" bind:value={friendCodeInput} placeholder="Enter Code" class="mb-4 w-full rounded-xl border border-white/20 bg-white/5 p-4 text-center font-mono text-xl text-yellow-400 placeholder-white/20 focus:border-yellow-400 focus:outline-none" />
				<div class="flex gap-3">
					<button class="flex-1 cursor-pointer rounded-xl bg-white/10 p-3 font-bold text-white hover:bg-white/20" onclick={() => (showEnterCode = false)}> Cancel </button>
					<button
						class="flex-1 cursor-pointer rounded-xl bg-yellow-400 p-3 font-bold text-black hover:opacity-90 disabled:opacity-50"
						disabled={!friendCodeInput}
						onclick={async () => {
							await request("/friend/pair", { code: friendCodeInput });
							showEnterCode = false;
							alert(`Added friend with code: ${friendCodeInput}`);
							friendCodeInput = "";
						}}
					>
						Add
					</button>
				</div>
			</div>
		</div>
	{/if}

	<FriendComponents {goto} />
	<button class="flex w-full cursor-pointer flex-col items-center justify-between" onclick={() => (showDropdown = true)}>
		<div class="hidden h-15 w-15"></div>
		<Icons icon="tabler:plus" size={15} fill={"white"} />
		<p class="text-sm text-white">Add a friend</p>
	</button>

	<div class="fixed right-0 bottom-0 left-0 z-10 h-24 w-full bg-gradient-to-t from-black/95 from-65% to-transparent to-100% md:absolute">
		<Navigation {goto} />
	</div>
</div>

<style>
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}
</style>
