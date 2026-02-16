<script lang>
	import Screen1 from "./Screens/Screen-1.svelte";
	import Screen2 from "./Screens/Screen-2.svelte";
	import Screen3 from "./Screens/Screen-3.svelte";
	import Screen4 from "./Screens/Screen-4.svelte";
	import Screen5 from "./Screens/Screen-5.svelte";
	import Screen6 from "./Screens/Screen-6.svelte";
	import Screen7 from "./Screens/Screen-7.svelte";
	import Authentication from "./Screens/Authentication.svelte";
	import Signin from "./Screens/Signin.svelte";
	import Session from "./Screens/Sessions.svelte";
	import FriendScreen from "./Screens/Friends/Screen-1.svelte";
	import FriendSelection from "./Screens/Friends/Selection.svelte";
	import Reflect from "./Screens/Reflect.svelte";

	let screen = localStorage.getItem("ScreenName") || "authentication";

	function goto(screenName) {
		screen = screenName;
		localStorage.setItem("ScreenName", screen);
	}
</script>

<main class="flex h-screen w-screen justify-center overflow-hidden bg-black">
	<div class="relative h-full w-full max-w-[475px] bg-black">
		{#if screen == "authentication"}
			<Authentication {goto} />
		{:else if screen == "signin"}
			<Signin {goto} />
		{:else if screen == "sessions"}
			<Session {goto} />
		{:else if screen == "screen1"}
			<Screen1 {goto} />
		{:else if screen == "screen2"}
			<Screen2 {goto} />
		{:else if screen == "screen3"}
			<Screen3 {goto} />
		{:else if screen == "screen4"}
			<Screen4 {goto} />
		{:else if screen == "screen5"}
			<Screen5 {goto} />
		{:else if screen == "screen6"}
			<Screen6 {goto} />
		{:else if screen == "screen7"}
			<Screen7 {goto} />
		{:else if screen == "friends"}
			<FriendScreen {goto} />
		{:else if screen == "friendSelection"}
			<FriendSelection {goto} />
		{:else if screen == "reflect"}
			<Reflect {goto} />
		{/if}
	</div>
</main>
