<script>
    import Emo from './Emo.svelte'
    import Icons from './Icons.svelte'
    export let goto
</script>
<div class = 'w-full h-full flex flex-col p-y-0 relative'>
    <div class = 'z-10 h-1/8 w-full flex flex-row justify-between items-start text-white'>
        <button class = 'cursor-pointer' on:click={() => goto('screen1')}>
            <Icons icon = 'material-symbols-light:arrow-back-rounded'/>
        </button>
        <Icons icon = 'material-symbols-light:search-rounded' width = {8} height = {8} />
    </div>
    <div class = 'text-white font-serif text-center text-xl font-bold'>
        <p>Tap the color that best describes<br>how you feel right now</p>
    </div>
    <div class = 'flex justify-center absolute inset-0 items-center'>
        <div class = 'w-75 h-73 relative scale-115'> <!--40+40 = 80 but w=70 in grid for overlap, so 80-((80-70)/2) for h=40+33-->
            <button class = 'w-70 grid grid-cols-2 absolute cursor-pointer' on:click={() => goto('screen3')}>
                <Emo color1 = '#ffa500' color2 = 'red' text1 = 'High' text2 = 'Unpleasant' duration = -3 />
                <Emo color1 = '#ffda03' color2 = '#ffa500' text1 = 'High' text2 = 'Pleasant' duration = -5 />
            </button>
            <button class = 'w-70 grid grid-cols-2 absolute top-33 cursor-pointer' on:click={() => goto('screen3')}>
                <Emo color1 = '#90d5ff' color2 = 'darkblue' text1 = 'Low' text2 = 'Unpleasant' duration = -5 />
                <Emo color1 = '#83f28f' color2 = 'green' text1 = 'Low' text2 = 'pleasant' duration = -3 />
            </button>
        </div>
    </div>
</div>
