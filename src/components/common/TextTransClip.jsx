import gsap from 'gsap';
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { onMount, onCleanup } from 'solid-js';

const TextTransClip = (props) => {
    let textRef;

    onMount(() => {
        if (!textRef) return;
        gsap.registerPlugin(ScrollTrigger);
        const q = gsap.utils.selector(textRef);
        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: textRef,
                start: 'top bottom',
                end: `bottom top+=${(window.innerHeight / 2) + textRef.offsetHeight}`,
                scrub: true,
                ...props.triggerOpts
            }
        });

        tl.fromTo([q('.trans-line-above'), q('.trans-line-under')], { yPercent: 0 }, { yPercent: 100, ease: 'linear', duration: 1 })

        onCleanup(() => tl.kill());
    })

    return (
        <div ref={textRef}>
            <div class="trans-line">
                <div class="trans-line-above">
                    {props.children}
                </div>
                <div class='trans-line-under'>
                    {props.children}
                </div>
            </div>
        </div>
    )
}

export default TextTransClip;