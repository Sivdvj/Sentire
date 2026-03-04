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
	let hoveredActivity = null;
	let topActivities = [];

	$: if (data.length > 0) {
		const activityMap = new Map();

		data.forEach((d) => {
			if (!d.activity) return;
			if (!activityMap.has(d.activity)) {
				activityMap.set(d.activity, {
					name: d.activity,
					positive: 0,
					total: 0,
					breakdown: { Happy: 0, Pleased: 0, Displeased: 0, Sad: 0 },
				});
			}

			const stats = activityMap.get(d.activity);
			const cat = getCategory(d.color);

			stats.total += d.frequency;
			if (stats.breakdown[cat.label] !== undefined) {
				stats.breakdown[cat.label] += d.frequency;
			}

			if (cat.label === "Happy" || cat.label === "Pleased") {
				stats.positive += d.frequency;
			}
		});

		topActivities = Array.from(activityMap.values())
			.map((a) => ({
				...a,
				score: a.total > 0 ? (a.positive / a.total) * 100 : 0,
			}))
			.filter((a) => a.total > 0)
			.sort((a, b) => b.score - a.score)
			.slice(0, 3);
	}

	function getCategory(color) {
		if (!color) return { label: "Unknown", color: "#888888" };
		const hex = color.replace("#", "");
		const r = parseInt(hex.substring(0, 2), 16);
		const g = parseInt(hex.substring(2, 4), 16);
		const b = parseInt(hex.substring(4, 6), 16);

		if (b > r && b > g * 0.8) return { label: "Sad", color: "#1E90FF" }; // Blue
		if (g > r && g > b) return { label: "Pleased", color: "#32CD32" }; // Green
		if (g > r * 0.75) return { label: "Happy", color: "#FFD700" }; // Yellow
		return { label: "Displeased", color: "#FF4500" }; // Red
	}

	function getActivityStats(activity) {
		const activityData = data.filter((d) => d.activity === activity);
		if (activityData.length === 0) return null;

		const sorted = [...activityData].sort((a, b) => b.frequency - a.frequency);
		const mostCommon = sorted[0]?.emotion || "N/A";

		const total = activityData.reduce((sum, d) => sum + d.frequency, 0);
		const counts = {
			Happy: 0,
			Pleased: 0,
			Displeased: 0,
			Sad: 0,
			Unknown: 0,
		};

		activityData.forEach((d) => {
			const cat = getCategory(d.color).label;
			counts[cat] = (counts[cat] || 0) + d.frequency;
		});

		const positiveCount = counts["Happy"] + counts["Pleased"];
		const positivePercentage = total > 0 ? Math.round((positiveCount / total) * 100) : 0;
		const negativePercentage = 100 - positivePercentage;

		const distribution = [
			{ label: "Happy", count: counts["Happy"], color: "#FFD700" }, // Yellow
			{ label: "Pleased", count: counts["Pleased"], color: "#32CD32" }, // Green
			{ label: "Displeased", count: counts["Displeased"], color: "#FF4500" }, // Red
			{ label: "Sad", count: counts["Sad"], color: "#1E90FF" }, // Blue
		].map((item) => ({
			...item,
			percentage: total > 0 ? Math.round((item.count / total) * 100) : 0,
		}));

		return {
			activity,
			mostCommon,
			distribution,
			total,
			positivePercentage,
			negativePercentage,
		};
	}

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
				<div class="sticky left-0 z-10 bg-[#101010]">
					<svg width={margin.left} {height} class="font-sans">
						<g transform="translate({margin.left}, {margin.top})">
							{#each activities as act, row}
								<text x="-10" y={row * cellSize + cellSize / 2} dy="0.35em" text-anchor="end" fill={hoveredActivity?.activity === act ? "white" : "#ddd"} font-weight={hoveredActivity?.activity === act ? "bold" : "normal"} font-size="13" class="cursor-pointer transition-colors duration-200" on:mouseenter={() => (hoveredActivity = getActivityStats(act))} on:mouseleave={() => (hoveredActivity = null)}>
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

		{#if topActivities.length > 0}
			<div class="mt-8 mb-6">
				<h3 class="mb-4 font-serif text-2xl font-bold text-gray-200">Activities that improve mood</h3>
				<div class="space-y-3">
					{#each topActivities as activity, i}
						<div class="rounded-lg border border-gray-700 bg-gray-800/50 p-3 transition-colors hover:border-yellow-500/30">
							<div class="mb-2 flex items-center justify-between">
								<span class="text-lg font-bold text-white">
									<span class="mr-2 text-gray-500">#{i + 1}</span>{activity.name}
								</span>
								<span class="font-mono text-sm font-bold text-green-400">{Math.round(activity.score)}% positive</span>
							</div>
							<div class="flex h-2 w-full overflow-hidden rounded-full bg-gray-700">
								<div style="width: {(activity.breakdown.Happy / activity.total) * 100}%" class="bg-[#FFD700]"></div>
								<div style="width: {(activity.breakdown.Pleased / activity.total) * 100}%" class="bg-[#32CD32]"></div>
								<div style="width: {(activity.breakdown.Displeased / activity.total) * 100}%" class="bg-[#FF4500]"></div>
								<div style="width: {(activity.breakdown.Sad / activity.total) * 100}%" class="bg-[#1E90FF]"></div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
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
	{:else if hoveredActivity}
		<div class="fixed right-4 bottom-28 left-4 z-50 rounded border border-gray-700 bg-gray-800 p-4 shadow-lg md:right-4 md:left-auto md:w-64">
			<div class="mb-2 flex justify-between border-b border-gray-700 pb-2 text-lg font-bold text-white">
				<span>{hoveredActivity.activity}</span>
			</div>

			<div class="mb-2 flex gap-2 font-mono text-xs tracking-wide uppercase">
				<span class="text-green-400">{hoveredActivity.positivePercentage}% Pos</span>
				<span class="text-gray-500">|</span>
				<span class="text-red-400">{hoveredActivity.negativePercentage}% Neg</span>
			</div>

			<div class="mb-3">
				<div class="text-xs tracking-wide text-gray-400 uppercase">Most common mood</div>
				<div class="text-xl font-semibold text-white capitalize">{hoveredActivity.mostCommon}</div>
			</div>

			<div>
				<div class="mb-1 text-xs tracking-wide text-gray-400 uppercase">Distribution</div>
				{#each hoveredActivity.distribution as item}
					<div class="flex items-center justify-between py-0.5 text-sm">
						<div class="flex items-center gap-2">
							<span class="block h-2.5 w-2.5 rounded-full" style="background-color: {item.color}"></span>
							<span class="text-gray-300 capitalize">{item.label}</span>
						</div>
						<div class="font-mono text-gray-400">{item.count > 0 ? ((item.count / hoveredActivity.total) * 100).toFixed(0) : 0}%</div>
					</div>
				{/each}
			</div>
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
