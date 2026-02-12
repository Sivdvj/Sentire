<script>
	import FriendComp from "./FriendComp.svelte";
	import { onMount } from "svelte";
	import { request } from "./Auth";

	let friends = [];

	onMount(async () => {
		let res = await request("/friend/getAll");
		friends = res.list;
	});
</script>

<main>
	<div class="flex flex-col gap-4 p-4">
		{#each friends as friend}
			<FriendComp name={friend.name} />
		{/each}
	</div>
</main>
