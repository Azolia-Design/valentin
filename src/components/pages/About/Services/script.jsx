import { onMount } from 'solid-js';
import { cvUnit } from '~/utils/number';

const ServicesScript = () => {
    let scriptRef;

    onMount(() => {
        if (!scriptRef) return;
    })

    return <div ref={scriptRef} class="divScript"></div>
}
export default ServicesScript;