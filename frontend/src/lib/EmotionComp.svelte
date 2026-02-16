<script>
	import { onMount } from "svelte";
	import Ecomp1 from "./Ecomp1.svelte";
	import { request } from "./Auth";

	export let goto;

	let data = {};
	onMount(async () => {
		data = await request("/data");
		data = data.Emotion;
	});

	function getImage(color) {
		const hex = color.replace("#", "");
		const r = parseInt(hex.substring(0, 2), 16);
		const g = parseInt(hex.substring(2, 4), 16);
		const b = parseInt(hex.substring(4, 6), 16);

		if (b > r && b > g * 0.8) return "/assets/3.png"; // Blue
		if (g > r && g > b) return "/assets/2.png"; // Green
		if (g > r * 0.75) return "/assets/4.png"; // Yellow
		return "/assets/1.png"; // Red
	}
</script>

<main>
	<div class="flex flex-col-reverse">
		{console.log(data)}
		{#each Object.entries(data) as [id, userdata]}
			<Ecomp1 color={userdata.color} text={userdata.emotion} image={getImage(userdata.color)} fullData={userdata} {goto} />
		{/each}
	</div>
</main>
