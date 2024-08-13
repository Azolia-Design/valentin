import gsap from 'gsap';
import { onMount, onCleanup } from 'solid-js';
import { initScrollTrigger } from '~/components/core/scrollTrigger';

const IntroScript = () => {
    let scriptRef;

    onMount(() => {
        if (!scriptRef) return;

        initScrollTrigger();
        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.home__intro-awards-listing',
                start: 'top bottom',
                end: 'bottom bottom',
                scrub: true
            }
        });

        tl.to('.home__intro-award', { '--scale-factor': '1', duration: 1, stagger: .03 })

        onCleanup(() => tl.kill());
    })

    return <div ref={scriptRef} class="divScript"></div>
}
export default IntroScript;