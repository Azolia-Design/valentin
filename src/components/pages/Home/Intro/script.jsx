import { onMount } from 'solid-js';

const IntroScript = () => {
    let scriptRef;

    onMount(() => {
        if (!scriptRef) return;
    })

    return <div ref={scriptRef} class="divScript"></div>
}
export default IntroScript;