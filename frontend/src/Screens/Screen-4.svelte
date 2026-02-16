<script>
	import Icon from "../lib/Icons.svelte";
	import ThreeParticles from "../lib/ThreeParticles.svelte";
	import YouFelt from "../lib/YouFelt.svelte";
	export let goto;
	let buttons1 = ["Driving", "Eating", "Fitness", "Hobbies", "Resting", "Sleeping", "Studying"];
	let buttons2 = ["By Myself", "Co-workers", "Family", "Friends", "Pets"];
	let buttons3 = ["College", "Commuting", "Home", "Outside", "School", "Work"];
</script>

<div class="relative h-full w-full overflow-hidden p-4">
	<div class="pointer-events-none absolute inset-0 z-0 opacity-60 blur-md">
		<ThreeParticles colorParticles={localStorage.getItem("Color")} />
	</div>
	<div class="relative z-10 flex h-full flex-col">
		<div class="sticky mb-5 -ml-2 flex w-full flex-row items-center justify-between text-white">
			<button class="cursor-pointer" on:click={() => goto("screen3")}>
				<Icon icon="material-symbols-light:close-rounded" showCircle={false} />
			</button>
			<div class="-mr-2 flex flex-row">
				<Icon icon="material-symbols-light:ink-pen-rounded" showCircle={false} height={10} />
				<div style="color:{localStorage.getItem('Color')}">
					<Icon icon="material-symbols-light:pentagon-rounded" showCircle={false} height={10} />
				</div>
			</div>
		</div>
		<div class="h-1/7 w-full text-left font-serif text-3xl font-semibold">
			<p class="text-white">What were you doing</p>
			<p class="text-white">when you felt <i style="color: {localStorage.getItem('Color')}">{localStorage.getItem("Emotion")}</i></p>
		</div>
		<div class="flex flex-col">
			<p class="text-white">Themes</p>
			<YouFelt buttons={buttons1} />
		</div>
		<div class="flex flex-col">
			<p class="text-white">People</p>
			<YouFelt buttons={buttons2} />
		</div>
		<div class="flex flex-col">
			<p class="text-white">Places</p>
			<YouFelt buttons={buttons3} />
		</div>
	</div>
	<button class="fixed right-4 bottom-4 z-20 cursor-pointer md:absolute" on:click={() => goto("screen5")}>
		<Icon icon="material-symbols-light:arrow-forward-rounded" size={20} fill="white" />
	</button>
</div>
