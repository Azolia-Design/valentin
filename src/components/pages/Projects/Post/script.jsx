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
                start: `top top`,
                end: `bottom bottom`,
                scrub: true,
            }
        })
        tl
            .to(['.post__hero-title, .post__hero-year, .post__hero-cta'], { scale: .8, autoAlpha: .6, duration: 1, ease: 'power2.in' }, 0)
            .to('.post__hero-cover img', { scale: .8, duration: 1, ease: 'none' }, 0)
            .to('.post__hero-cover', { scale: 1.4,  autoAlpha: .5, duration: 1, ease: 'none' }, 0)

        onCleanup(() => tl.kill());
    })

    return <div ref={scriptRef} class="divScript"></div>
}
export default PostScript;