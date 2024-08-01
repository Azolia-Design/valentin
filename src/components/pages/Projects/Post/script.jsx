import { onMount, onCleanup } from 'solid-js';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

const PostScript = () => {
    let scriptRef;

    onMount(() => {
        if (!scriptRef) return;
        gsap.registerPlugin(ScrollTrigger);

        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.sc-post__hero',
                start: `bottom-=${window.innerHeight} bottom`,
                end: `bottom bottom`,
                scrub: true,
            }
        })
        tl
            .to('.post__hero-main', { scale: .8, autoAlpha: .6, duration: 1, ease: 'none' }, 0)
            .to('.post__hero-cover img', { scale: .8, duration: 1, ease: 'none' }, 0)
            .to('.post__hero-cover', { scale: 1.4, autoAlpha: .6, duration: 1, ease: 'none' }, 0)

        onCleanup(() => tl.kill());
    })

    return <div ref={scriptRef} class="divScript"></div>
}
export default PostScript;