import { onMount, onCleanup } from 'solid-js';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

const ServicesScript = () => {
    let scriptRef;

    onMount(() => {
        if (!scriptRef) return;
        console.log("run")
        gsap.registerPlugin(ScrollTrigger);

        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.about__daily',
                start: 'top bottom',
                end: 'top top',
                scrub: true
            }
        })
        tl.from('.about__daily-img-inner', { yPercent: -20, duration: 1, ease: 'linear' });

        onCleanup(() => tl.kill());
    })

    return <div ref={scriptRef} class="divScript"></div>
}
export default ServicesScript;