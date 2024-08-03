import gsap from "gsap";
import { onCleanup, onMount } from "solid-js";
import { getLenis } from "~/components/core/lenis";

function Content(props) {
    const pageTransition = () => {
        document.querySelector('.sc__next-post.fake .next__post-title').innerHTML = document.querySelector('.sc__next-post.default .next__post-title').innerHTML;
        document.querySelector('.sc__next-post.fake .next__post-img-inner').innerHTML = document.querySelector('.sc__next-post.default .next__post-img-inner').innerHTML;

        let rect = document.querySelector('.sc__next-post.default').getBoundingClientRect();
        // gsap.set('.sc__next-post.fake .next__post', { top: rect.top, height: rect.height, transformOrigin: 'top left' })
        gsap.timeline({
            defaults: { ease: 'expo.inOut', duration: 1.2 },
            onStart() { getLenis().stop(); },
            onComplete() {
                getLenis().start();
                document.querySelector('.sc__next-post.fake .next__post-title').innerHTML = '';
                document.querySelector('.sc__next-post.fake .next__post-img-inner').innerHTML = '';
            }
        })
        .fromTo('.sc__next-post.fake .next__post',
            { top: rect.top, height: rect.height },
            { top: 0, height: window.innerHeight })
        .fromTo('.sc__next-post.fake .next__post-img-inner',
            { filter: 'brightness(10%)', scale: 1.2 }, { filter: 'brightness(80%)', scale: 1 }
            , "<=0")
        .to('.sc__next-post.fake', { autoAlpha: 0, ease: 'linear', duration: 0.4, clearProps: 'all' })
    }
    onMount(() => {

    })
    return (
        <a href={`/${props.link}`} onClick={pageTransition} style={{ 'height': '100%', 'width': '100%' }}>
            {props.children}
        </a>
    )
}
export default Content;