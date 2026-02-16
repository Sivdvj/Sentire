<script>
    import Icons from "./Icons.svelte"
    import { request } from "./Auth";
    export let goto
</script>

<div class = 'w-full h-full flex flex-col p-y-0'>
    <div class = 'w-full h-1/7 flex flex-row justify-between items-start'>
        <button class='text-white opacity-60 cursor-pointer hover:opacity-100' on:click={() => goto("sessions")}>
            <Icons icon='material-symbols-light:lock-outline' size={8} showCircle={false} />
        </button>
        <div class = 'text-white flex flex-row space-x-10 text-sm'>
            <button class = 'bg-gray-700/50 px-3 py-1 rounded-4xl hover:bg-gray-500/50'>24 emotions</button>
            <button class = 'bg-gray-700/50 px-3 py-1 rounded-4xl hover:bg-gray-500/50'>0 day streak</button>
        </div>
        <button class='text-white opacity-60 cursor-pointer hover:opacity-100' 
            on:click={async () => {
                await request("/logout")
                localStorage.clear()
            }}>
            <div class="w-8 h-8 hidden"></div>
            <Icons icon='solar:logout-outline' size={8} showCircle={false} />
        </button>
    </div>
    <div class = 'w-full h-6/7'>
        <p class = 'text-white font-bold font-serif text-center text-3xl'>How are you feeling<br />this evening?</p>
        <div class = 'h-full flex justify-center items-center relative'>
            <button class='absolute z-10 flex flex-col items-center cursor-pointer' 
                on:click={async () => {
                    let curr = await request("/data")
                    curr = curr.ID
                    curr = (parseInt(curr, 10) + 1).toString()
                    localStorage.setItem("currID", curr)
                    goto("screen2")
                }}>
                <Icons icon='material-symbols-light:add-2-rounded' size={12} fill='#ffffff'/>
                <div class="w-12 h-12 hidden"></div>
                <p class = 'text-white text-xs'>Check in</p>
            </button>
            <svg class = 'animate-spin size-90 text-white opacity-30 spin-slow' viewBox = '0 0 20 20'>
                <defs>
                    <linearGradient id='grad'>
                        <stop offset = "0%" stop-color = 'white' stop-opacity = 1 />
                        <stop offset = "100%" stop-color = 'white' stop-opacity = 0 />
                    </linearGradient>
                </defs>
                <circle cx = '10' cy = '10' r = '8' stroke = "url('#grad')" stroke-width = '1.3' stroke-dasharray = '62.83' stroke-dashoffset = '31.4' stroke-linecap = 'round' />
            </svg>
        </div>
        
    </div>
</div>

<style>
    .spin-slow {
        animation : spin 7s linear infinite;
    }
</style>