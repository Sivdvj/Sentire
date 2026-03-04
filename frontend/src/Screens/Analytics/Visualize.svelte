<script>
	import { onMount } from "svelte";
	import Icons from "../../lib/Icons.svelte";
	import Navigation from "../../lib/Navigation.svelte";
	import { request } from "../../lib/Auth";

	export let goto;

	let data = [];
	let rawData = [];
	let loading = true;
	let error = null;

	let activities = [];
	let emotions = [];
	let maxFreq = 0;

	let width = 0;
	let height = 0;
	const margin = { top: 100, right: 20, bottom: 20, left: 100 };
	const cellSize = 50;

	let hovered = null;

	onMount(async () => {
		let res = await request("/analytics/activity");
		if (res.ok) {
			rawData = res.data || [];
			processData();
		} else {
			error = res.error;
		}
		loading = false;
	});

	function processData() {
		const map = new Map();
		rawData.forEach((d) => {
			if (!d.activity) return;
			const acts = String(d.activity)
				.split(",")
				.map((s) => s.trim())
				.filter((s) => s);

			acts.forEach((act) => {
				const key = `${act}|${d.emotion}`;
				if (!map.has(key)) {
					map.set(key, { ...d, activity: act, frequency: 0 });
				}
				map.get(key).frequency += d.frequency;
			});
		});
		data = Array.from(map.values());

		let actSet = new Set(data.map((d) => d.activity));
		let emoSet = new Set(data.map((d) => d.emotion));

		activities = Array.from(actSet).sort();
		emotions = Array.from(emoSet).sort();

		maxFreq = Math.max(0, ...data.map((d) => d.frequency));

		width = margin.left + emotions.length * cellSize + margin.right;
		height = margin.top + activities.length * cellSize + margin.bottom;
	}

	function getBubbleData(act, emo) {
		return data.find((d) => d.activity === act && d.emotion === emo);
	}
</script>

<!-- TODO: improve UI -->
<div class="scrollbar-hide h-full w-full overflow-y-auto scroll-smooth bg-[#101010] p-4 pb-32 text-white">
	<h2 class="mb-4 font-serif text-4xl font-bold">Activity & Emotion</h2>

	{#if loading}
		<div class="flex items-center justify-center p-10">Loading...</div>
	{:else if error}
		<div class="p-10 text-red-400">{error}</div>
	{:else if data.length === 0}
		<div class="p-10 text-gray-400">No activity data yet.</div>
	{:else}
		<div class="scrollbar-hide overflow-x-auto">
			<div class="flex min-w-max">
				<!-- Sticky Y-Axis -->
				<div class="sticky left-0 z-10 bg-[#101010]">
					<svg width={margin.left} {height} class="font-sans">
						<g transform="translate({margin.left}, {margin.top})">
							{#each activities as act, row}
								<text x="-10" y={row * cellSize + cellSize / 2} dy="0.35em" text-anchor="end" fill="#ddd" font-size="13">
									{act}
								</text>
							{/each}
						</g>
					</svg>
				</div>

				<div>
					<svg width={width - margin.left} {height} class="font-sans">
						<g transform="translate(0, {margin.top})">
							{#each emotions as emo, col}
								<text x={col * cellSize + cellSize / 2} y="-10" text-anchor="start" fill="#aaa" font-size="12" transform={`rotate(-45, ${col * cellSize + cellSize / 2}, -10)`}>
									{emo}
								</text>
							{/each}

							{#each activities as act, row}
								{#each emotions as emo, col}
									{@const cellData = getBubbleData(act, emo)}
									<circle cx={col * cellSize + cellSize / 2} cy={row * cellSize + cellSize / 2} r="2" fill="#333" />
									{#if cellData}
										<circle cx={col * cellSize + cellSize / 2} cy={row * cellSize + cellSize / 2} r={(Math.sqrt(cellData.frequency) / Math.sqrt(maxFreq)) * (cellSize * 0.4)} fill={cellData.color || "white"} opacity={hovered === cellData ? 1 : 0.8} stroke={hovered === cellData ? "white" : "none"} stroke-width="2" class="cursor-pointer transition-all duration-200" on:mouseenter={() => (hovered = cellData)} on:mouseleave={() => (hovered = null)} />
									{/if}
								{/each}
							{/each}
						</g>
					</svg>
				</div>
			</div>
		</div>
	{/if}

	{#if hovered}
		<div class="fixed right-4 bottom-28 left-4 z-50 rounded border border-gray-700 bg-gray-800 p-3 shadow-lg md:right-4 md:left-auto md:w-64">
			<div class="font-bold">{hovered.activity}</div>
			<div class="flex items-center gap-2 text-sm text-gray-300">
				<span class="block h-3 w-3 rounded-full" style="background-color: {hovered.color}"></span>
				{hovered.emotion}
			</div>
			<div class="mt-1 text-xs text-gray-400">Frequency: {hovered.frequency}</div>
		</div>
	{/if}

	<div class="pointer-events-none fixed right-0 bottom-0 left-0 z-10 h-24 w-full bg-gradient-to-t from-black/95 from-65% to-transparent to-100% md:absolute">
		<div class="pointer-events-auto h-full w-full">
			<Navigation {goto} />
		</div>
	</div>
</div>

<style>
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}
</style>
