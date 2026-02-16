<script>
    import PreEmo from '../lib/PreEmo.svelte'
    export let goto
</script>

<div class = 'w-full h-full p-4 overflow-y-auto scrollbar-hide scroll-smooth'>
    <PreEmo {goto} />
</div>

<style>
    .scrollbar-hide::-webkit-scrollbar {
        display : none;
    }
</style>