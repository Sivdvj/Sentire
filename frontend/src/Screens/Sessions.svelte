<script>
	import Icons from "../lib/Icons.svelte";
	import { onMount } from "svelte";
	import { request } from "../lib/Auth";
	export let goto;

	let data = {};
	onMount(async () => {
		let res = await request("/sessions");
		data = res.list;
		console.log(data);
	});
</script>

<div class="scrollbar-hide h-full w-full space-y-5 overflow-y-auto scroll-smooth p-4">
	<div class="flex w-full flex-row items-start justify-between">
		<button class="cursor-pointer text-white opacity-60 hover:opacity-100" on:click={() => goto("screen1")}>
			<Icons icon="material-symbols-light:arrow-back-rounded" size={10} showCircle={false} />
		</button>
		<button
			class="cursor-pointer rounded-3xl bg-white px-4 py-1 font-serif text-black opacity-60 hover:opacity-100"
			on:click={async () => {
				await request("/revokeAll");
				window.location.reload();
			}}
		>
			Revoke all
		</button>

		<button
			class="cursor-pointer text-white opacity-60 hover:opacity-100"
			on:click={async () => {
				await request("/logout");
				localStorage.clear();
			}}
		>
			<div class="hidden h-8 w-8"></div>
			<Icons icon="solar:logout-outline" size={8} showCircle={false} />
		</button>
	</div>
	<!-- TODO: add error handling for revoking sessions -->
	<div class="flex w-full flex-col-reverse">
		{#each Object.entries(data) as [id, session]}
			<div class="mb-4 w-full font-serif">
				<div class="flex flex-row justify-between rounded-xl bg-white p-4 opacity-85">
					<div class="flex flex-col">
						<div><strong>Device: </strong>{session.userAgent}</div>
						<div><strong>Created at:</strong>{new Date(session.createdAt).toLocaleString()}</div>
						{#if session.isCurrent}
							<div class="font-bold text-green-600">(Current Session)</div>
						{/if}
					</div>
					{#if !session.isCurrent}
						<button
							class="h-[40px] rounded-3xl bg-gray-200 px-4 py-2 text-black hover:cursor-pointer hover:bg-red-700 hover:text-white"
							on:click={async () => {
								await request("/revoke", { token: id });
								window.location.reload();
							}}
						>
							Revoke
						</button>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>
