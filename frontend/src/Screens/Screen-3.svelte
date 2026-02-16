<script>
	import { onMount } from "svelte";
	import Emotion from "../lib/Emotions.svelte";
	import Icons from "../lib/Icons.svelte";
	import { emotion, colors, texts } from "../store.js";

	let offsetX = 0,
		offsetY = 0,
		canvas;
	export let goto;
	onMount(() => {
		let prevX = 0,
			prevY = 0;
		let isDragging = false;

		function handleStart(x, y) {
			prevX = x;
			prevY = y;
		}

		function handleMove(x, y) {
			let deltaX = x - prevX;
			let deltaY = y - prevY;

			offsetX += deltaX;
			offsetY += deltaY;

			prevX = x;
			prevY = y;

			if (offsetX > 600) offsetX = 600;
			if (offsetX < -600) offsetX = -600;
			if (offsetY > 600) offsetY = 600;
			if (offsetY < -600) offsetY = -600;
		}

		canvas.addEventListener("touchstart", (e) => {
			e.preventDefault();
			handleStart(e.touches[0].pageX, e.touches[0].pageY);
		});

		canvas.addEventListener(
			"touchmove",
			(e) => {
				e.preventDefault();
				handleMove(e.touches[0].pageX, e.touches[0].pageY);
			},
			{ passive: false },
		);

		// Mouse events
		canvas.addEventListener("mousedown", (e) => {
			isDragging = true;
			e.preventDefault();
			handleStart(e.pageX, e.pageY);
		});

		canvas.addEventListener("mousemove", (e) => {
			if (!isDragging) return;
			e.preventDefault();
			handleMove(e.pageX, e.pageY);
		});

		const stopDragging = () => {
			isDragging = false;
		};

		canvas.addEventListener("mouseup", stopDragging);
		canvas.addEventListener("mouseleave", stopDragging);
	});
</script>

<div class="h-full w-full overflow-hidden p-4">
	<div class="relative z-1 flex h-1/7 w-full flex-row items-start justify-between text-white">
		<button class="cursor-pointer" on:click={() => goto("screen2")}>
			<Icons icon="material-symbols-light:close-rounded" opacity={80} width={8} height={8} />
		</button>
		<div class="flex flex-row">
			<Icons icon="material-symbols-light:question-mark-rounded" opacity={80} width={8} height={8} />
			<Icons icon="material-symbols-light:search-rounded" opacity={80} width={8} height={8} />
		</div>
	</div>
	<div bind:this={canvas} class="absolute top-1/2 left-1/2" style="transform: translate(calc(-50% + {offsetX}px), calc(-50% + {offsetY}px))">
		<Emotion {offsetX} {offsetY} />
	</div>
	<div class="fixed bottom-5 left-0 flex h-[100px] w-full flex-row items-center justify-between rounded-full bg-gray-800 pt-5 pr-2 pb-5 pl-10 opacity-98 md:absolute">
		<div class="text-md">
			<p style="color: {$colors}" class="text-lg font-bold">{$emotion}</p>
			<p class="text-white">{$texts}</p>
		</div>
		<button
			class="cursor-pointer"
			on:click={() => {
				localStorage.setItem("Emotion", $emotion);
				localStorage.setItem("Color", $colors);
				localStorage.setItem("Text", $texts);
				goto("screen4");
			}}
		>
			<div class="hidden h-20 w-20"></div>
			<Icons icon="material-symbols-light:arrow-forward-rounded" size={20} opacity={100} fill="#ffffff" />
		</button>
	</div>
</div>
