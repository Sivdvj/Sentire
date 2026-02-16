<script>
    import Icon from '@iconify/svelte'
    export let icon;
    export let size = 10;
    export let opacity = 0;
    export let width = 10;
    export let height = 10;
    export let fill = '#636363'
    export let showCircle = true
</script>
{#if showCircle}
    <div class = {`w-${size} h-${size} relative`}>
            <svg viewBox = '0 0 24 24' class = {`opacity-${opacity}`}>
                <circle cx = '12' cy = '12' r = '10' fill = {fill}  />
            </svg>
        <div class = 'inset-0 absolute flex justify-center items-center'>
            <Icon {icon} class = {`w-${width} h-${height}`} />
        </div>
    </div>
{:else}
    <Icon {icon} class = {`w-${size} h-${size}`} />
{/if}
