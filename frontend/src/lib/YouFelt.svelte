<script>
	import { onMount } from "svelte";
	import { request } from "./Auth";
	import Icon from "./Icons.svelte";

	export let buttons = [];
	export let category = "";

	let selected = new Set();
	let customButtons = [];
	let showInput = false;
	let newActivity = "";
	let inputRef;

	onMount(async () => {
		let stored = localStorage.getItem("Activity");
		if (stored) {
			try {
				let parsed = JSON.parse(stored);
				if (Array.isArray(parsed)) {
					parsed.forEach((item) => {
						if (buttons.includes(item)) selected.add(item);
					});
				}
			} catch (e) {
				console.error("Failed to parse Activity", e);
			}
		}

		// Fetch custom activities
		let res = await request("/get-activities", {});
		if (res.activities) {
			customButtons = res.activities.filter((a) => a.category === category).map((a) => a.activity);

			// Check if any custom buttons were previously selected but not displayed
			let parsed = JSON.parse(localStorage.getItem("Activity") || "[]");
			customButtons.forEach((btn) => {
				if (parsed.includes(btn)) selected.add(btn);
			});
		}

		selected = selected;
	});

	function toggleColor(item) {
		let list = [];
		try {
			list = JSON.parse(localStorage.getItem("Activity") || "[]");
		} catch (e) {
			list = [];
		}

		if (selected.has(item)) {
			selected.delete(item);
			list = list.filter((i) => i !== item);
		} else {
			selected.add(item);
			if (!list.includes(item)) {
				list.push(item);
			}
		}

		localStorage.setItem("Activity", JSON.stringify(list));
		selected = selected;
	}

	async function addActivity() {
		if (!newActivity.trim()) {
			showInput = false;
			newActivity = "";
			return;
		}

		let activityName = newActivity.trim();
		// Prevent duplicates
		if (buttons.includes(activityName) || customButtons.includes(activityName)) {
			alert("Activity already exists");
			return;
		}

		let res = await request("/add-activity", { activity: activityName, category });
		if (res.ok) {
			customButtons = [...customButtons, activityName];
			toggleColor(activityName); // Select the new activity immediately
			newActivity = "";
			showInput = false;
		} else {
			console.error("Failed to add activity");
		}
	}
</script>

<div class="flex flex-wrap items-center justify-start gap-2 py-5">
	{#each [...buttons, ...customButtons] as item}
		<button class="rounded-full px-6 py-3 text-[15px] text-white transition-colors duration-200 {selected.has(item) ? 'bg-white/40 font-semibold' : 'bg-gray-700/50 hover:bg-gray-500/50'}" on:click={() => toggleColor(item)}>
			{item}
		</button>
	{/each}

	{#if showInput}
		<div class="flex items-center rounded-full bg-gray-700/50 pr-1 pl-4 transition-colors duration-200 focus-within:bg-gray-600/50">
			<input bind:this={inputRef} type="text" bind:value={newActivity} placeholder="Add..." class="w-32 bg-transparent py-3 text-[15px] text-white placeholder-gray-400 outline-none" on:keydown={(e) => e.key === "Enter" && addActivity()} on:blur={() => !newActivity && (showInput = false)} />
			<button class="ml-1 rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white" on:click={addActivity}>
				<Icon icon="material-symbols-light:check-rounded" size={5} showCircle={false} />
			</button>
			<button
				class="rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white"
				on:click={() => {
					showInput = false;
					newActivity = "";
				}}
			>
				<Icon icon="material-symbols-light:close-rounded" size={5} showCircle={false} />
			</button>
		</div>
	{:else}
		<button
			class="flex h-[45px] w-[45px] items-center justify-center rounded-full bg-gray-700/50 text-white/70 transition-colors duration-200 hover:bg-gray-500/50 hover:text-white"
			on:click={() => {
				showInput = true;
				setTimeout(() => inputRef?.focus(), 0);
			}}
		>
			<Icon icon="material-symbols-light:add-rounded" size={6} showCircle={false} />
		</button>
	{/if}
</div>
