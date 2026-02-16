<script context='module'> //context makes the idc accessible across all instance
    let idc=0
</script>
<script>
    export let color1;
    export let color2;
    export let text1;
    export let text2;
    export let duration;
    const gradID = 'grad-' + idc++;
</script>
<div class = 'flex flex-col relative w-40 h-40'>
    <div>
        <svg class = 'size-40 opacity-90' viewBox = "0 0 24 24">
            <defs>
                <linearGradient id = {gradID} x1 = '0%' x2 = '0%' y1 = '0%' y2 = '100%'>
                    <stop offset = '0%' stop-color = {color1} />
                    <stop offset = '30%' stop-color = {color2} />
                </linearGradient>
            </defs>
            <circle cx = '12' cy = '12' r = '10' fill = {"url(#" + gradID + ")"}/>
        </svg>
    </div>
    <div class = 'absolute z-1'>
        <svg class = 'animate-spin size-40 opacity-60 spin-slow' style = 'animation-delay : {duration}s' viewBox = "0 0 24 24">
            <circle cx = '13' cy = '13' r = '10' fill = {color1}/>
        </svg>
    </div>
    <div class = 'absolute z-2'>
        <svg class = 'animate-spin size-38 opacity-40 spin-slow2' style = 'animation-delay : {duration}s' viewBox = "0 0 24 24">
            <circle cx = '11' cy = '11' r = '10' fill = {color1}/>
        </svg>
    </div>
    <div class = 'absolute z-3'>
        <svg class = 'spin-reverse size-38 opacity-20' style = 'animation-delay : {duration}s' viewBox = "0 0 24 24">
            <circle cx = '11' cy = '11' r = '10' fill = {color1}/>
        </svg>
    </div>
    <div class = 'absolute inset-0 text-center flex items-center justify-center z-4 text-black text-xs font-serif font-semibold'>
        <p>{text1} Energy<br>{text2}</p>
    </div>
</div>

<style>
    .spin-slow {
        animation : spin 9s linear infinite;
    }
    .spin-slow2 {
        animation : spin 11s linear infinite;
    }
    .spin-reverse {
        animation: spin 12s linear infinite reverse;
    }
</style>