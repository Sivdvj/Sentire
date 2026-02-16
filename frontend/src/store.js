import {writable} from 'svelte/store'

export let emotion = writable(localStorage.getItem("Emotion"))
export let colors = writable(localStorage.getItem("Color"))
export let texts = writable(localStorage.getItem("Text"))