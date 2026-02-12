<script>
	export let color = "#1c1c1e";
	export let text = "";
	export let image = "";
	export let name = "";
</script>

<div class="relative mb-4 flex h-48 w-full flex-col justify-between overflow-hidden rounded-4xl bg-gray-300">
	<img src={image} alt="gradient" class="absolute z-0 h-full w-full shrink-0" />
	<div class="relative z-1 flex w-full flex-row items-start justify-between p-4">
		<!-- TODO: Notify friend -->
		<button class="cursor-pointer rounded-4xl bg-white px-3 py-1 hover:bg-gray-500/50">Nudge</button>
	</div>
	<div class="z-10 p-4 text-xl" style="color:{color}">
		<p class="italic">{name}</p>
		<p class="font-bold">is feeling {text}</p>
	</div>
</div>

<style>
</style>
