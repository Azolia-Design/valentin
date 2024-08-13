import { onMount, onCleanup } from 'solid-js';
import gsap from 'gsap';
import { initScrollTrigger } from '~/components/core/scrollTrigger';

const HistoryScript = () => {
    let scriptRef;

    onMount(() => {
        if (!scriptRef) return;
        initScrollTrigger();
    })

    return <div ref={scriptRef} class="divScript"></div>
}
export default HistoryScript;