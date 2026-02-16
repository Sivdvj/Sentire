<script>
	import FriendComp from "./FriendComp.svelte";
	import { onMount } from "svelte";
	import { request } from "./Auth";

	let friends = [];

	onMount(async () => {
		let res = await request("/friend/getAll");
		friends = res.list;
	});

	export let goto;

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
	<div class="flex flex-col gap-4 p-4">
		{#each friends as friend}
			<FriendComp name={friend.name} emotion={friend.currentEmotion?.emotion || ""} color={friend.currentEmotion?.color || "#ffffff"} image={friend.currentEmotion ? getImage(friend.currentEmotion.color) : ""} fullData={friend.currentEmotion} {goto} />
		{/each}
	</div>
</main>
