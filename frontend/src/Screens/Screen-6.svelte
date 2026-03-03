<script>
	import { request } from "../lib/Auth";
	import Icon from "../lib/Icons.svelte";
	import ThreeParticles from "../lib/ThreeParticles.svelte";
	import { onMount } from "svelte";
	export let goto;

	let currentDate = "";
	let currentTime = "";

	onMount(() => {
		let now = new Date();
		/** @type {Intl.DateTimeFormatOptions} */
		const options = { month: "long", day: "numeric", weekday: "long" };
		currentDate = now.toLocaleDateString("en-US", options);
		/** @type {Intl.DateTimeFormatOptions} */
		let timeOptions = { hour: "numeric", minute: "numeric", hour12: true };
		currentTime = now.toLocaleTimeString("en-US", timeOptions).toLowerCase();
	});
</script>

<div class="relative h-full w-full overflow-hidden p-4">
	<div class="pointer-events-none absolute inset-0 z-0 opacity-60 blur-md">
		<ThreeParticles colorParticles={localStorage.getItem("Color")} />
	</div>
	<div class="relative z-10 flex h-full w-full flex-col">
		<div class="flex w-full flex-row justify-between text-white">
			<button class="cursor-pointer" on:click={() => goto("screen5")}>
				<Icon icon="material-symbols-light:arrow-back-rounded" showCircle={false} />
			</button>
			<Icon icon="mdi-light:paperclip" showCircle={false} height={8} />
		</div>
		<div class=" py-5 font-serif text-4xl font-bold text-white">
			<p>Time, weather,</p>
			<p>sleep & exercise</p>
		</div>
		<div class="grid grid-cols-3 grid-rows-3 gap-2 py-8 text-white">
			<div class="col-span-3 flex flex-row items-center justify-between rounded-full bg-gray-700/40 p-8">
				<p>{currentDate}<br />{currentTime}</p>
				<Icon icon="mdi-light:calendar" showCircle={false} />
			</div>
			<div class="row-span-2 flex flex-col items-center justify-between rounded-full bg-gray-700/40 p-8 text-center">
				<Icon icon="ion:cloud-outline" showCircle={false} />
				<p>Weather<br /><span class="text-sm">31&deg;C</span></p>
			</div>
			<div class="row-span-2 flex flex-col items-center justify-between rounded-full bg-gray-700/40 p-8 text-center">
				<Icon icon="solar:moon-sleep-linear" showCircle={false} height={8} />
				<p>Sleep<br /><span class="text-sm">0 min</span></p>
			</div>
			<div class="row-span-2 flex flex-col items-center justify-between rounded-full bg-gray-700/40 p-8 text-center">
				<Icon icon="tabler:run" showCircle={false} />
				<p>Steps<br /><span class="text-sm">603 steps</span></p>
			</div>
		</div>
		<div class="fixed bottom-4 left-0 w-full md:absolute">
			<div class="grid w-full grid-cols-7 grid-rows-1 gap-2 text-white">
				<button
					class="col-span-6 cursor-pointer rounded-full bg-white/80 p-4 text-center font-semibold text-black hover:bg-gray-100/60"
					on:click={async () => {
						let emo = localStorage.getItem("Emotion");
						let color = localStorage.getItem("Color");
						let Id = localStorage.getItem("currID");
						let text = localStorage.getItem("Feeling");
						let act = JSON.parse(localStorage.getItem("Activity"));
						await request("/save", { Id, emo, color, text, act });
						localStorage.clear();
						goto("screen7");
					}}
				>
					<p>Save</p>
				</button>
				<button class="flex cursor-pointer items-center justify-center rounded-full text-yellow-100" style="background-color:{localStorage.getItem('Color')}" on:click={() => goto("friendSelection")}>
					<Icon icon="fluent:people-48-regular" showCircle={false} size={10} />
				</button>
			</div>
		</div>
	</div>
</div>
