<script>
	export let color = "#ffffff";
	export let text = "";
	export let image = "";
	export let fullData = {};
	export let goto;

	function handleReflect() {
		localStorage.setItem("reflectData", JSON.stringify(fullData));
		goto("reflect");
	}
</script>

<div class="relative mb-4 flex h-48 w-full flex-col justify-between overflow-hidden rounded-3xl bg-black">
	<img src={image} alt="gradient" class="absolute z-0 h-full w-full shrink-0" />
	<div class="relative z-1 flex w-full flex-row items-start justify-between p-4">
		<div class="font-sans text-sm text-white">
			<p>Sun Oct 12</p>
			<p>6:21 pm</p>
		</div>
		<div class="flex flex-row space-x-2 font-sans text-sm text-white">
			<button class="rounded-4xl bg-gray-700/50 px-3 py-1 hover:bg-gray-500/50" onclick={handleReflect}>Reflect</button>
			<button class="rounded-4xl bg-gray-700/50 px-3 py-1 hover:bg-gray-500/50">Tools</button>
		</div>
	</div>
	<div class="z-10 p-4 text-xl text-white">
		<p class="italic">I'm feeling</p>
		<p class="font-bold" style="color:{color}">{text}</p>
	</div>
</div>

<style>
</style>
