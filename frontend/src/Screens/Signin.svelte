<script>
    import { request } from '../lib/Auth';
    import Icon from '../lib/Icons.svelte'
    import ThreeParticles from '../lib/ThreeParticles.svelte';
    export let goto
    let message = ''
    let firstname = ''
    let username = ''
    let password = ''

    let signin = async () => {
        await request('/signin',{firstname, username, password})
        //TODO: ui message error
        goto('authentication')
    }
</script>

<div class = 'w-full h-full p-4 overflow-hidden relative'>
    <div class = 'absolute inset-0 z-0 pointer-events-none opacity-70 blur-xs'>
        <ThreeParticles colorParticles = "#ffa500" />
    </div>
    <div class='w-full h-full flex flex-col justify-center'>
        <div class='h-2/5 w-full p-4 bg-black flex flex-col justify-between rounded-2xl opacity-60 z-10 drop-shadow-md drop-shadow-amber-400/70 text-amber-100 font-serif'>
            <p class='w-full text-center text-xl font-bold'>Sign in</p>
            <input type='text' placeholder='Name' class='w-full rounded-full p-3 border-1 border-amber-400/50' bind:value={firstname}/>
            <input type='text' placeholder='Username' class='w-full rounded-full p-3 border-1 border-amber-400/50' bind:value={username}/>
            <input type='password' placeholder='Password' class='w-full rounded-full p-3 border-1 border-amber-400/50' bind:value={password}/>
            <button class='w-full bg-amber-400/70 rounded-full p-2 text-lg hover:cursor-pointer' on:click={signin}>Sign in</button>
            {#if message}
                <p class='w-full text-center text-lg font-bold text-red-600'>{message}</p>
            {/if}
        </div>
    </div>
</div>
