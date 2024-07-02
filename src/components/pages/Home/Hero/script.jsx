import gsap from 'gsap';
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

import { onMount, onCleanup } from 'solid-js';

const HeroScript = (props) => {
    let scriptRef;

    onMount(() => {
        if (!scriptRef) return;
        gsap.registerPlugin(ScrollTrigger);
        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.home__hero-bg',
                start: 'top top',
                end: 'bottom bottom',
                scrub: true,
            }
        })
        tl
            .fromTo('.home__hero-bg-main img', { scale: 1, xPercent: 0 }, { scale: 1.5, duration: 2, ease: 'linear' })
            .fromTo('.home__hero-title-wrap', { autoAlpha: 1 }, { autoAlpha: 0, duration: .5, ease: 'linear' }, 0)
            .fromTo('.home__hero-bg-main img', { autoAlpha: 1 }, { autoAlpha: 0, duration: 1, ease: 'linear' }, '>.5')
            .fromTo('.home__hero-bg-gradient', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1, ease: 'linear' }, '-=1')
            .fromTo('.home__intro-companies', { yPercent: 0 }, { yPercent: 20, duration: 1, ease: 'linear' }, "<.3")
        onCleanup(() => tl.kill());
    })
    return <div ref={scriptRef} class="divScript"></div>
}

export default HeroScript;