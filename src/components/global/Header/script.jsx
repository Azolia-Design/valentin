import gsap from 'gsap';
import { onMount, onCleanup } from 'solid-js';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { cvUnit } from '~/utils/number';

const HeaderScript = () => {
    let scriptRef;
    onMount(() => {
        if (!scriptRef) return;
        console.log("header script")

        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.home__hero-greating-wrap',
                start: `top top+=${cvUnit(window.innerWidth > 767 ? 40 : 20, 'rem')}`,
                end: `bottom top+=${cvUnit(window.innerWidth > 767 ? 40 : 20, 'rem') + document.querySelector('.header__name').offsetHeight}`,
                scrub: true
            }
        })

        tl
            .to('.header__name', { y: 0, duration: 1, ease: 'none' })
            .to('.header__greating', { y: document.querySelector('.header__name').offsetHeight * -1, duration: 1, ease: 'none' }, 0)
            .to('.home__hero-name', { autoAlpha: 0, duration: 0, ease: 'none' })
            .to('.header__name', { autoAlpha: 1, duration: 0, ease: 'none' }, '<=0')

        let tlSub = gsap.timeline({
            scrollTrigger: {
                trigger: '.home__hero-greating-wrap',
                start: `top top+=${cvUnit(50, 'rem') + document.querySelector('.header__name').offsetHeight}`,
                end: `top top+=${document.querySelector('.header__name').offsetHeight}`,
                scrub: true
            }
        });
        tlSub.fromTo('.header__greating', { autoAlpha: 1 }, { autoAlpha: 0, duration: 1, ease: 'none' })

    })
    return (<div ref={scriptRef} class="divScript"></div>)
}
export default HeaderScript;
