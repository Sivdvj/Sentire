<script>
    import { request } from '../lib/Auth';
    import ThreeParticles from '../lib/ThreeParticles.svelte';
    export let goto
    let message = ''
    let username =''
    let password =''
    let login = async () => {
        let data = await request('/login',{username, password})
        if(data.error){
            message = data.error
            return
        }
        goto('screen1')
    }
</script>

<div class = 'w-full h-full p-4 overflow-hidden relative'>
    <div class = 'absolute inset-0 z-0 pointer-events-none opacity-70 blur-xs'>
        <ThreeParticles colorParticles = "#ffa500" />
    </div>
    <div class='w-full h-full flex flex-col justify-center'>
        <div class='h-1/3 w-full p-4 bg-black flex flex-col justify-between rounded-2xl opacity-60 z-10 drop-shadow-md drop-shadow-amber-400/70 text-amber-100 font-serif'>
            <p class='w-full text-center text-xl font-bold'>Authentication Required</p>
            <input type='text' placeholder='Username' class='w-full rounded-full p-2 border-1 border-amber-400/50' bind:value={username}/>
            <input type='password' placeholder='Password' class='w-full rounded-full p-2 border-1 border-amber-400/50' bind:value={password}/>
            <button class='w-full bg-amber-400/70 rounded-full p-2 text-lg' on:click={login}>Login</button>
            {#if message}
                <p class='w-full text-center text-lg font-bold text-red-600'>{message}</p>
            {/if}
            <div class='w-full text-center'>
                <button class='underline underline-offset-2 text-sm hover:cursor-pointer' on:click={() => goto('signin')}>Sign in</button>
            </div>
        </div>
    </div>
</div>
