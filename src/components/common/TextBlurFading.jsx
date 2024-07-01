import gsap from 'gsap';
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { onMount, onCleanup } from 'solid-js';
import SplitType from 'split-type';

const TextBlurFading = (props) => {
    let textRef;

    onMount(() => {
        if (!textRef) return;
        gsap.registerPlugin(ScrollTrigger);

        const splitText = SplitType.create(textRef, { type: 'lines, words', lineClass: 'split-line' });
        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: textRef,
                scrub: true,
                ...props.triggerOpts
            }
        });
            tl.fromTo(splitText.words, {
                filter: 'blur(4px)',
                opacity: 0,
            },
            {
                filter: 'blur(0px)',
                opacity: 1,
                stagger: .35,
                duration: 5,
                ease: 'linear',
            }, 0)

        onCleanup(() => {
            splitText.revert();
            tl.kill();
        });
    })
    return <div ref={textRef}>{props.children}</div>
}

export default TextBlurFading;