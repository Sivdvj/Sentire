<script>
	export let color = "#000000";
	export let emotion = "";
	export let image = "";
	export let name = "";
	export let fullData = {};
	export let goto;

	let timeAgo = "";
	let expiresText = "";

	$: if (fullData && fullData.createdAt) {
		let created = new Date(fullData.createdAt);
		let now = new Date();

		let diffMs = now.getTime() - created.getTime();
		let diffMins = Math.max(0, Math.floor(diffMs / 60000));
		let diffHrs = Math.floor(diffMins / 60);

		if (diffMins < 1) timeAgo = "Just now";
		else if (diffMins < 60) timeAgo = `${diffMins}m ago`;
		else if (diffHrs < 24) timeAgo = `${diffHrs}h ago`;
		else timeAgo = created.toLocaleDateString();

		let expiresAt = new Date(created.getTime() + 24 * 60 * 60 * 1000);
		let remainingMs = expiresAt.getTime() - now.getTime();
		let remainingHrs = Math.ceil(remainingMs / (60 * 60 * 1000));

		if (remainingHrs > 0) {
			expiresText = `Expires in ${remainingHrs}h`;
		} else {
			expiresText = "Expired";
		}
	}

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
		<div class="flex flex-row items-baseline justify-between">
			<p class="italic">{name}</p>
			{#if timeAgo}
				<p class="text-xs opacity-60">{timeAgo} &bull; {expiresText}</p>
			{/if}
		</div>
		{#if emotion}
			<p class="font-bold">is feeling {emotion}</p>
		{:else}
			<p class="font-bold">no emotions shared</p>
		{/if}
	</div>
</div>

<style>
</style>
