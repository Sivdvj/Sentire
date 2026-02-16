<script>
	export let color = "#000000";
	export let emotion = "";
	export let image = "";
	export let name = "";
	export let fullData = {};
	export let goto;

	function handleReflect() {
		localStorage.setItem("reflectData", JSON.stringify(fullData));
		console.log(fullData);
		goto("reflect");
	}
</script>

<div class="relative mb-4 flex h-48 w-full flex-col justify-between overflow-hidden rounded-3xl bg-[#1c1c1e]/60">
	{#if image}
		<img src={image} alt="gradient" class="absolute z-0 h-full w-full shrink-0" />
		<div class="relative flex w-full flex-row-reverse justify-between p-4">
			<!-- TODO: Notify friend -->
			<button class="rounded-4xl bg-gray-700/50 px-3 py-1 text-white hover:bg-gray-500/50" onclick={handleReflect}>More</button>
		</div>
	{/if}

	<div class="z-10 p-4 text-xl" style="color:{color}">
		<p class="italic">{name}</p>
		{#if emotion}
			<p class="font-bold">is feeling {emotion}</p>
		{:else}
			<p class="font-bold">no emotions shared</p>
		{/if}
	</div>
</div>

<style>
</style>
