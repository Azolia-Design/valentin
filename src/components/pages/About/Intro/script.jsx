import { onMount, onCleanup } from 'solid-js';
import { cvUnit } from '~/utils/number';

const IntroScript = () => {
    let scriptRef;

    onMount(() => {
        if (!scriptRef) return;
        const GRID_COL = 5;
        let emptySpace = (document.querySelector('.container-col').offsetWidth + cvUnit(20, 'rem')) * GRID_COL
        document.querySelector('.about__intro-vision-empty').style.width = `${emptySpace}px`;
    })

    return <div ref={scriptRef} class="divScript"></div>
}
export default IntroScript;