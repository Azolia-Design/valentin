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
                start: 'start+=50% bottom',
                end: 'bottom+=100% bottom',
                scrub: true
            }
        })

        tl.fromTo(splitedText.words, { autoAlpha: 0 }, { autoAlpha: 1, duration: 5.5, stagger: .4, ease: 'linear' })

        onCleanup(() => {
            tl.kill();
            if (splitedText.isSplit) splitedText.revert();
        });
    })

    return (<div ref={scriptRef} class="divScript"></div>)
}

export default FooterScript;