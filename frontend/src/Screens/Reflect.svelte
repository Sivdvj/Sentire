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

	let dateStr = "";
	let timeStr = "";

	if (data.created_at || data.createdAt) {
		const d = new Date(data.created_at || data.createdAt);
		const currentYear = new Date().getFullYear();
		const year = d.getFullYear();
		/** @type {Intl.DateTimeFormatOptions} */
		const optDate = { weekday: "long", month: "long", day: "numeric" };
		if (year !== currentYear) optDate.year = "numeric";

		dateStr = d.toLocaleDateString("en-US", optDate);
		/** @type {Intl.DateTimeFormatOptions} */
		const timeFormat = { hour: "numeric", minute: "numeric", hour12: true };
		timeStr = d.toLocaleTimeString("en-US", timeFormat).toLowerCase();
	}
</script>

<!-- TODO: improve ui -->
<div class="scrollbar-hide mt-10 h-full w-full space-y-10 overflow-y-auto scroll-smooth p-4">
	<div class="pointer-events-none absolute inset-0 z-0 opacity-60 blur-md">
		<ThreeParticles colorParticles={data.color} />
	</div>
	<div class="relative z-10 flex flex-col space-y-4 text-white">
		<div class="flex justify-between">
			<p class="px-4 font-serif text-4xl font-bold">Reflect</p>
			<button class="cursor-pointer" onclick={() => goto("screen7")}>
				<Icon icon="material-symbols:close-rounded" showCircle={false} />
			</button>
		</div>
		{#if dateStr}
			<div class="px-4 text-sm opacity-70">
				<p>{dateStr} at {timeStr}</p>
			</div>
		{/if}
	</div>

	<div class="relative z-10 flex flex-col items-center justify-center space-y-8 text-center text-white">
		<div>
			{#if data.created_at}
				<p class="mb-4 text-sm opacity-60">
					{new Date(data.created_at).toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric" })}
					at {new Date(data.created_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric" })}
				</p>
			{/if}
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
