import gsap from 'gsap';
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { onMount, onCleanup } from 'solid-js';
import SplitType from 'split-type';

const TextBlurFading = (props) => {
    let textRef;

    onMount(() => {
        if (!textRef) return;
        gsap.registerPlugin(ScrollTrigger);

        const text = SplitType.create(textRef, { types: 'lines, words', lineClass: 'split-line' });
        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: textRef,
                scrub: true,
                ...props.triggerOpts
            }
        });
        tl.fromTo(text.words, {
            filter: 'blur(4px)',
            opacity: 0,
            stagger: .4,
            duration: 5.5,
            ease: 'back.out(2.0)',
        },
        {
            filter: 'blur(0px)',
            opacity: 1,
            stagger: .4,
            duration: 5.5,
            ease: 'back.out(2.0)',
        }, 0)

        onCleanup(() => {
            tl.kill();
            if (text.isSplit) text.revert();
        });
    })
    return <div ref={textRef}>{props.children}</div>
}

export default TextBlurFading;