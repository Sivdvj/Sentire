<script>
    import { colors, emotion, texts} from "../store";

    const high_energy_unpleasant = [
        "angry", "annoyed", "frustrated", "irritated", "furious", "enraged",
        "outraged", "bitter", "resentful", "hostile", "aggressive", "violent",
        "impatient", "stressed", "anxious", "panicked", "terrified", "horrified",
        "disgusted", "repulsed", "nauseated", "appalled", "shocked", "dismayed",
        "alarmed", "distressed", "troubled", "worried", "uneasy", "restless",
        "agitated", "jittery", "nervous", "tense", "edgy", "on edge"
    ];

    const high_energy_pleasant = [
        "happy", "ecstatic", "joyful", "delighted", "thrilled", "excited",
        "enthusiastic", "euphoric", "elated", "exuberant", "cheerful", "gleeful",
        "jubilant", "lively", "energetic", "vibrant", "animated", "spirited",
        "buoyant", "carefree", "lighthearted", "merry", "playful", "fun-loving",
        "optimistic", "hopeful", "confident", "proud", "accomplished", "triumphant",
        "victorious", "successful", "admired", "respected", "loved", "adored"
    ];

    const low_energy_unpleasant = [
        "sad", "depressed", "gloomy", "melancholic", "sorrowful", "mournful",
        "heartbroken", "desolate", "lonely", "isolated", "abandoned", "rejected",
        "disappointed", "discouraged", "hopeless", "despairing", "defeated", "weary",
        "exhausted", "drained", "lethargic", "sluggish", "apathetic", "indifferent",
        "numb", "detached", "alienated", "bored", "jaded", "unmotivated",
        "uninspired", "listless", "passive", "submissive", "resigned", "fatigued"
    ];

    const low_energy_pleasant = [
        "calm", "relaxed", "peaceful", "serene", "tranquil", "content",
        "satisfied", "fulfilled", "grateful", "appreciative", "loving", "affectionate",
        "caring", "empathetic", "aware", "patient", "tolerant", "accepting",
        "forgiving", "merciful", "gentle", "kind", "warm", "nurturing",
        "supportive", "encouraging", "reassuring", "comforting", "soothing", "mellow",
        "easygoing", "laid-back", "chill", "composed", "balanced", "harmonious"
    ];

    function interpolateColor(color1, color2, factor) {
        const hex = (c) => parseInt(c, 16);
        const r1 = hex(color1.slice(1,3)), g1 = hex(color1.slice(3,5)), b1 = hex(color1.slice(5,7));
        const r2 = hex(color2.slice(1,3)), g2 = hex(color2.slice(3,5)), b2 = hex(color2.slice(5,7));
        const r = Math.round(r1 + (r2 - r1) * factor);
        const g = Math.round(g1 + (g2 - g1) * factor);
        const b = Math.round(b1 + (b2 - b1) * factor);
        return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
    }

    function getColor(i, j){
        let index;
        let startColor, endColor;
        if(i < 6 && j < 6){
            index = i*6 + j;
            startColor = '#8b4513';
            endColor = '#ffa500';
        }else if(i < 6 && j < 12){
            index = i*6 + (j-6);
            startColor = '#daa520';
            endColor = '#ffda03';
        }else if(i >= 6 && j < 6){
            index = (i-6)*6 + j;
            startColor = '#90d5ff';
            endColor = '#000080';
        }else{
            index = (i-6)*6 + (j-6);
            startColor = '#83f28f';
            endColor = '#006400';
        }
        return interpolateColor(startColor, endColor, index / 35);
    }

    function getEmotion(i, j){
        let index;
        if(i < 6){
            if(j < 6){
                index = i*6 + j;
                return high_energy_unpleasant[index];
            }else{
                index = i*6 + (j-6);
                return high_energy_pleasant[index];
            }
        }else{
            if(j < 6){
                index = (i-6)*6 + j;
                return low_energy_unpleasant[index];
            }else{
                index = (i-6)*6 + (j-6);
                return low_energy_pleasant[index];
            }
        }
    }

    export let offsetX;
    export let offsetY;

    function getClosestToCenter(offsetX, offsetY) {
        const gridCenterX = 600;
        const gridCenterY = 600;
        

        const targetX = gridCenterX - offsetX;
        const targetY = gridCenterY - offsetY;

        const closestI = Math.max(0, Math.min(11, Math.floor(targetY / 100))); //max and min so that it stays within the range 0 to 11
        const closestJ = Math.max(0, Math.min(11, Math.floor(targetX / 100)));
     
        return {i: closestI, j: closestJ};
    }

    $:closest = getClosestToCenter(offsetX, offsetY);  //state - so that UI keeps updating - when canvas moves the parent passes the offset to the child
    $:if (closest){
        let color = getColor(closest.i, closest.j)
        let specificEmotion = getEmotion(closest.i, closest.j)
        // localStorage.setItem("Emotion", text)
        // localStorage.setItem("Color", color) 
        // localStorage.setItem("Text", t)
        texts.set('feeling ' + specificEmotion)
        emotion.set(specificEmotion)
        colors.set(color)
    }


</script>

<div class = 'grid grid-cols-12 w-[1320px] h-[1320px]'>
    {#each {length : 12}, i}
        {#each {length : 12}, j}
            <svg class = 'size-[110px]' viewBox = '0 0 24 24'>
                {#if i === closest.i && j === closest.j}
                    <rect x = '0' y = '0' width = '24' height = '24' fill = {getColor(i, j)} />
                {:else}
                    <circle cx = '12' cy = '12' r = '12' fill = {getColor(i, j)} />
                {/if}
                <text x='50%' y='50%' font-size='4  ' font-family='Roboto' text-anchor='middle' dominant-baseline='middle'>
                    {getEmotion(i, j)}
                </text>
            </svg>
        {/each}
    {/each}
</div>