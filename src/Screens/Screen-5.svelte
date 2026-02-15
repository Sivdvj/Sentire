<script>
	import Icon from "../lib/Icons.svelte";
	import ThreeParticles from "../lib/ThreeParticles.svelte";
	export let goto;
	let message = "";
	$: wordCount = message.trim() ? message.trim().split(/\s+/).length : 0;
	$: isOverLimit = wordCount >= 160;

	function handleInput(e) {
		const words = e.target.value.trim().split(/\s+/);
		if (words.length > 10) {
			if (e.inputType !== "deleteContentBackward" && e.inputType !== "deleteContentForward") {
				message = words.slice(0, 160).join(" ");
			}
		}
	}
</script>

<div class="relative h-full w-full overflow-hidden p-4">
	<div class="pointer-events-none absolute inset-0 z-0 opacity-60 blur-md">
		<ThreeParticles colorParticles={localStorage.getItem("Color")} />
	</div>
	<div class="relative z-10 flex w-full flex-row items-center justify-between text-white">
		<button class="cursor-pointer" on:click={() => goto("screen4")}>
			<Icon icon="material-symbols-light:close-rounded" showCircle={false} />
		</button>
		<div class="flex flex-row">
			<Icon icon="material-symbols-light:ink-pen-rounded" showCircle={false} height={10} />
			<div style="color:{localStorage.getItem('Color')}">
				<Icon icon="material-symbols-light:pentagon-rounded" showCircle={false} height={10} />
			</div>
		</div>
	</div>
	<div class="relative z-10 flex h-full flex-col justify-center">
		<div class="text-center font-serif font-bold text-white">
			<p>Describe what might be causing you to feel</p>
			<p style="color: {localStorage.getItem('Color')}" class="text-xl font-extrabold">{localStorage.getItem("Emotion")}</p>
			<br />
			<div class="relative w-full">
				<textarea placeholder="Describe how you feel" bind:value={message} on:input={handleInput} class="custom-scrollbar h-32 w-full resize-none rounded-lg bg-white/10 p-2 font-light text-white outline-none placeholder:italic focus:bg-white/20"></textarea>
				<div class="mt-1 flex justify-between px-1 text-xs text-white/60">
					<p class:text-red-500={isOverLimit}>
						{isOverLimit ? "Limit exceeded!" : ""}
					</p>
					<p class:text-red-500={isOverLimit}>
						{wordCount} / 160 words
					</p>
				</div>
			</div>
		</div>
	</div>
	<div class="fixed bottom-4 left-0 z-10 flex w-full flex-row items-start justify-between text-white md:absolute">
		<div class="flex flex-row">
			<Icon icon="material-symbols-light:mic" fill="#242424" size={20} width={8} height={8} />
			<Icon icon="weui:camera-outlined" fill="#242424" size={20} width={8} height={8} />
			<Icon icon="octicon:sparkle-24" fill="#242424" size={20} width={8} height={8} />
		</div>
		<button
			class="cursor-pointer text-black disabled:opacity-50"
			disabled={isOverLimit}
			on:click={() => {
				localStorage.setItem("Feeling", message);
				goto("screen6");
			}}
		>
			<Icon icon="material-symbols-light:arrow-forward-rounded" fill="#ffffff" size={20} />
		</button>
	</div>
</div>

<style>
	.custom-scrollbar::-webkit-scrollbar {
		width: 4px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: transparent;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: rgba(255, 255, 255, 0.2);
		border-radius: 10px;
	}
</style>
