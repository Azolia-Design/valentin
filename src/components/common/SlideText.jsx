import { onCleanup, onMount } from "solid-js";
import gsap from 'gsap';
import SplitType from "split-type";
import { easeInOutQuint } from "~/utils/easing";

function SlideText(props) {
    let slideRef;
    onMount(() => {

        if (!slideRef) return;
        slideRef.querySelectorAll('div').forEach((text, idx) => {
            let splittext = new SplitType(text, { types: 'lines, words', lineClass: 'split-line' });

            gsap.set(splittext.words, { autoAlpha: 0, willChange: 'transform, opacity' });

            let dur = 3;
            let ease = gsap.parseEase(easeInOutQuint);

            let yPercent = { in: 100, out: -100 }
            let tl = gsap.timeline({ repeat: -1 });

            if (idx === props.data.length - 1) {
                tl
                    .set(splittext.words, { yPercent: 0, autoAlpha: 1, willChange: 'transform, opacity' })
                    .to(splittext.words, { yPercent: yPercent.in, autoAlpha: 0, duration: dur, ease: ease }, "<=0")
                    .to(splittext.words, { duration: dur * (idx) - (1 * dur)})

                    .set(splittext.words, { yPercent: yPercent.out, autoAlpha: 0, willChange: 'transform, opacity' })
                    .to(splittext.words, { yPercent: 0, autoAlpha: 1, duration: dur, ease: ease })
            }
            else {
                tl
                    .set(splittext.words, { yPercent: yPercent.out, autoAlpha: 0, willChange: 'transform, opacity' })
                    .to(splittext.words, { duration: dur * idx}, "<=0")
                    .to(splittext.words, { yPercent: 0, autoAlpha: 1, duration: dur, ease: ease })
                    .to(splittext.words, { yPercent: yPercent.in, autoAlpha: 0, duration: dur, ease: ease })
                    .to(splittext.words, { duration: (props.data.length - 2 - idx) * dur})
            }

            onCleanup(() => {
                splittext.revert();
                tl.kill();
            })
        })
    })
    return (
        <div class="grid-1-1" ref={slideRef} style={{ width: "max-content" }}>
            {props.data.map((text) => <div>{text}</div>)}
        </div>
    )
}

export default SlideText;
