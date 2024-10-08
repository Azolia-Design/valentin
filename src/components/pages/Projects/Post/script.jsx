import gsap from 'gsap';
import { onMount, onCleanup } from 'solid-js';
import { getLenis } from '~/components/core/lenis';
import { initScrollTrigger } from '~/components/core/scrollTrigger';

const PostScript = () => {
    let scriptRef;

    onMount(() => {
        if (!scriptRef) return;
        initScrollTrigger();

        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.sc-post__hero',
                start: `top top`,
                end: `bottom bottom`,
                scrub: true,
            }
        })


        let scaleArray = ['.post__hero-title, .post__hero-year, .post__hero-cta'];
        if (window.innerWidth <= 991) {
            scaleArray.push('.post__hero-info', '.post__hero-bottom')
        }
        tl
            .to(scaleArray, { scale: .8, autoAlpha: .6, duration: 1, ease: 'power2.in' }, 0)
            .to('.post__hero-cover img', { scale: .8, duration: 1, ease: 'none' }, 0)
            .to('.post__hero-cover', { scale: 1.4,  autoAlpha: .5, duration: 1, ease: 'none' }, 0)

        const scrollToContent = () => getLenis().scrollTo(document.getElementById('post-content'));

        if (window.innerWidth > 991) {
            document.querySelector('.post__hero').addEventListener('click', scrollToContent);
        }

        onCleanup(() => {
            tl.kill();
            if (window.innerWidth > 991) {
                document.querySelector('.post__hero').removeEventListener('click', scrollToContent);
            }
        });
    })

    return <div ref={scriptRef} class="divScript"></div>
}
export default PostScript;