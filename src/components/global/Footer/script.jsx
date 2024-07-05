import gsap from 'gsap';
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { onMount, onCleanup } from 'solid-js';
import SplitType from 'split-type';

const FooterScript = () => {
    let scriptRef;

    onMount(() => {
        if (!scriptRef) return;

        gsap.registerPlugin(ScrollTrigger);
        const splitedText = new SplitType('.footer__title', { types: 'lines, words', lineClass: 'split-line' });

        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.footer__title',
                start: 'top+=50% bottom',
                end: 'bottom+=100% bottom',
                scrub: true
            }
        })

        tl.fromTo(splitedText.words, { autoAlpha: 0 }, { autoAlpha: 1, duration: 5.5, stagger: .4, ease: 'linear' })


        let tlInfinite = gsap.timeline({
            scrollTrigger: {
                trigger: '.home__hero-clone-wrap',
                start: 'top+=30% top',
                end: 'bottom bottom',
                scrub: true
            }
        })

        tlInfinite.fromTo('.home__hero-clone-wrap', { autoAlpha: 0, ease: 'linear' }, { autoAlpha: 1, ease: 'linear' })
        onCleanup(() => {
            tl.kill();
            tlInfinite.kill();
            if (splitedText.isSplit) splitedText.revert();
        });
    })

    return (<div ref={scriptRef} class="divScript"></div>)
}

export default FooterScript;