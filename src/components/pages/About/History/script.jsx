import { onMount, onCleanup } from 'solid-js';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

const HistoryScript = () => {
    let scriptRef;

    onMount(() => {
        if (!scriptRef) return;
        gsap.registerPlugin(ScrollTrigger);
    })

    return <div ref={scriptRef} class="divScript"></div>
}
export default HistoryScript;