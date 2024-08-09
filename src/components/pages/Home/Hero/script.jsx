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
                end: 'bottom+=500px bottom',
                scrub: true,
            }
        })
        tl
            .fromTo('.home__hero-bg-main-inner', { scale: 1, xPercent: 0, yPercent: 0 }, { scale: 1.7, xPercent: 5, yPercent: -8, duration: 2, ease: 'linear' })
            .fromTo(['.home__hero-title-wrap', '.home__hero-scope-wrap', '.home__hero-intro-wrap'], { autoAlpha: 1 }, { autoAlpha: 1, stagger: .1, duration: .5, ease: 'linear' }, 0)
            .fromTo('.home__hero-bg-main-inner', { autoAlpha: 1 }, { autoAlpha: 0, duration: 1, ease: 'linear' }, '>.5')
            // .fromTo(['.home__hero-clone-wrap', '.home__hero-bg-main-inner'], { autoAlpha: 1 }, { autoAlpha: 0, duration: 1, ease: 'linear' }, '>.5')
            // .fromTo('.home__intro-bg-gradient', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1, ease: 'linear' }, '-=1')
            .fromTo('.home__intro-companies', { yPercent: 0 }, { yPercent: window.innerWidth > 767 ? 20 : 0, duration: 1, ease: 'linear' }, "<.3")
            .to('.home__intro-bg-gradient', { display: 'none', duration: 0, ease: 'linear' });

        onCleanup(() => tl.kill());
    })
    return <div ref={scriptRef} class="divScript"></div>
}

export default HeroScript;