<script>
	import ThreeParticles from "../lib/ThreeParticles.svelte";
	import Icon from "../lib/Icons.svelte";
	export let goto;

	let data = JSON.parse(localStorage.getItem("reflectData") || "{}");
	console.log(data);
	if (typeof data.activity === "string") {
		try {
			data.activity = JSON.parse(data.activity);
		} catch (e) {
			console.error(e);
			data.activity = [];
		}
	} else if (!Array.isArray(data.activity)) {
		data.activity = [];
	}

	console.log(data);
</script>

<!-- TODO: improve ui -->
<div class="scrollbar-hide mt-10 h-full w-full space-y-10 overflow-y-auto scroll-smooth p-4">
	<div class="pointer-events-none absolute inset-0 z-0 opacity-60 blur-md">
		<ThreeParticles colorParticles={data.color} />
	</div>
	<div class="relative z-10 flex justify-between text-white">
		<p class="px-4 font-serif text-4xl font-bold">Reflect</p>
		<button class="cursor-pointer" onclick={() => goto("screen7")}>
			<Icon icon="material-symbols:close-rounded" showCircle={false} />
		</button>
	</div>

	<div class="relative z-10 flex flex-col items-center justify-center space-y-8 text-center text-white">
		<div>
			<h1 class="z-10 mb-2 font-serif text-3xl italic">I felt</h1>
			<p class="text-3xl font-extrabold" style="color: {data.color}">{data.emotion}</p>
		</div>

		{#if data.text}
			<div class="w-full max-w-sm rounded-xl bg-white/5 p-6 backdrop-blur-sm">
				<p class="text-lg">{data.text}</p>
			</div>
		{/if}

		{#if data.activity && data.activity.length > 0}
			<div class="w-full">
				<!-- <p class="mb-3 text-lg font-semibold italic">while...</p> -->
				<div class="flex flex-wrap justify-center gap-2">
					{#each data.activity as act}
						<span class="text-md rounded-full bg-white/5 px-4 py-1 tracking-wider italic hover:bg-white/10">{act}</span>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}
</style>
