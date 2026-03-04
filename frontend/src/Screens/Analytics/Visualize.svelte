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

	const high_energy_unpleasant = ["angry", "annoyed", "frustrated", "irritated", "furious", "enraged", "outraged", "bitter", "resentful", "hostile", "aggressive", "violent", "impatient", "stressed", "anxious", "panicked", "terrified", "horrified", "disgusted", "repulsed", "nauseated", "appalled", "shocked", "dismayed", "alarmed", "distressed", "troubled", "worried", "uneasy", "restless", "agitated", "jittery", "nervous", "tense", "edgy", "on edge"];

	const high_energy_pleasant = ["happy", "ecstatic", "joyful", "delighted", "thrilled", "excited", "enthusiastic", "euphoric", "elated", "exuberant", "cheerful", "gleeful", "jubilant", "lively", "energetic", "vibrant", "animated", "spirited", "buoyant", "carefree", "lighthearted", "merry", "playful", "fun-loving", "optimistic", "hopeful", "confident", "proud", "accomplished", "triumphant", "victorious", "successful", "admired", "respected", "loved", "adored"];

	const low_energy_unpleasant = ["sad", "depressed", "gloomy", "melancholic", "sorrowful", "mournful", "heartbroken", "desolate", "lonely", "isolated", "abandoned", "rejected", "disappointed", "discouraged", "hopeless", "despairing", "defeated", "weary", "exhausted", "drained", "lethargic", "sluggish", "apathetic", "indifferent", "numb", "detached", "alienated", "bored", "jaded", "unmotivated", "uninspired", "listless", "passive", "submissive", "resigned", "fatigued"];

	const low_energy_pleasant = ["calm", "relaxed", "peaceful", "serene", "tranquil", "content", "satisfied", "fulfilled", "grateful", "appreciative", "loving", "affectionate", "caring", "empathetic", "aware", "patient", "tolerant", "accepting", "forgiving", "merciful", "gentle", "kind", "warm", "nurturing", "supportive", "encouraging", "reassuring", "comforting", "soothing", "mellow", "easygoing", "laid-back", "chill", "composed", "balanced", "harmonious"];

	function getCategory(emotion) {
		const norm = emotion.toLowerCase().trim();
		if (high_energy_pleasant.includes(norm)) return { label: "Happy", color: "#FFD700" }; // Yellow/Gold
		if (low_energy_pleasant.includes(norm)) return { label: "Pleased", color: "#32CD32" }; // LimeGreen
		if (high_energy_unpleasant.includes(norm)) return { label: "Displeased", color: "#FF4500" }; // OrangeRed
		if (low_energy_unpleasant.includes(norm)) return { label: "Sad", color: "#1E90FF" }; // DodgerBlue
		return { label: "Unknown", color: "#888888" };
	}

	function getActivityStats(activity) {
		const activityData = data.filter((d) => d.activity === activity);
		if (activityData.length === 0) return null;

		// 1. Most common mood
		const sorted = [...activityData].sort((a, b) => b.frequency - a.frequency);
		// Handle ties? Just take first.
		const mostCommon = sorted[0]?.emotion || "N/A";

		// 2. Distribution
		const total = activityData.reduce((sum, d) => sum + d.frequency, 0);
		const counts = {
			Happy: 0,
			Pleased: 0,
			Displeased: 0,
			Sad: 0,
			Unknown: 0,
		};

		activityData.forEach((d) => {
			const cat = getCategory(d.emotion).label;
			counts[cat] = (counts[cat] || 0) + d.frequency;
		});

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
				<!-- Sticky Y-Axis -->
				<div class="sticky left-0 z-10 bg-[#101010]">
					<svg width={margin.left} {height} class="font-sans">
						<g transform="translate({margin.left}, {margin.top})">
							{#each activities as act, row}
								<!-- svelte-ignore a11y-mouse-events-have-key-events -->
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
			<div class="mb-2 border-b border-gray-700 pb-2 text-lg font-bold text-white">{hoveredActivity.activity}</div>

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
