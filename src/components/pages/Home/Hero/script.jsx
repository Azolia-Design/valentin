import gsap from 'gsap';
import { onMount, onCleanup } from 'solid-js';
import { initScrollTrigger } from '~/components/core/scrollTrigger';
import { cvUnit } from '~/utils/number';

const HeroScript = (props) => {
    let scriptRef;

    onMount(() => {
        if (!scriptRef) return;
        initScrollTrigger();

        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.home__hero-bg',
                start: 'top top',
                end: 'bottom+=500px bottom',
                scrub: true,
                markers: true,
            }
        })
        tl
            .fromTo('.home__hero-bg-main-wrap', { scale: 1, xPercent: 0, yPercent: 0 }, { scale: 1.7, xPercent: 5, yPercent: -8, duration: 2, ease: 'linear' })
            .fromTo(['.home__hero-title-wrap', '.home__hero-scope-wrap', '.home__hero-intro-wrap'], { autoAlpha: 1 }, { autoAlpha: 1, stagger: .1, duration: .5, ease: 'linear' }, 0)
            .fromTo('.home__hero-bg-main-wrap', { autoAlpha: 1 }, { autoAlpha: 0, duration: 1, ease: 'linear' }, '>.5')
            // .fromTo(['.home__hero-clone-wrap', '.home__hero-bg-main-inner'], { autoAlpha: 1 }, { autoAlpha: 0, duration: 1, ease: 'linear' }, '>.5')
            // .fromTo('.home__intro-bg-gradient', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1, ease: 'linear' }, '-=1')
            .fromTo('.home__intro-companies', { yPercent: 0 }, { yPercent: window.innerWidth > 767 ? 20 : 0, duration: 1, ease: 'linear' }, "<.3")
            .to('.home__intro-bg-gradient', { display: 'none', duration: 0, ease: 'linear' });


        // let tlShowHeader = gsap.timeline({
        //     scrollTrigger: {
        //         trigger: '.home__hero-greating-wrap',
        //         start: `top top+=${cvUnit(window.innerWidth > 767 ? 40 : 20, 'rem')}`,
        //         end: `bottom top+=${cvUnit(window.innerWidth > 767 ? 40 : 20, 'rem') + document.querySelector('.header__name').offsetHeight}`,
        //         scrub: true,
        //         markers: true
        //     }
        // })
        // let tlHiddenGreating = gsap.timeline({
        //     scrollTrigger: {
        //         trigger: '.home__hero-greating-wrap',
        //         start: `top top+=${cvUnit(50, 'rem') + document.querySelector('.header__name').offsetHeight}`,
        //         end: `top top+=${document.querySelector('.header__name').offsetHeight}`,
        //         scrub: true
        //     }
        // });

        // document.querySelector('.header__name').removeAttribute('style');

        // gsap.set('.header__name', { yPercent: 100, autoAlpha: 1, duration: 0 })
        // tlShowHeader
        //     .to('.header__name', { yPercent: 0, duration: 1, ease: 'none' })
        //     .to('.header__greating', { y: document.querySelector('.header__name').offsetHeight * -1, duration: 1, ease: 'none' }, 0)
        //     .to('.home__hero-name', { autoAlpha: 0, duration: 0, ease: 'none' })
        //     .to('.header__name', { autoAlpha: 1, duration: 0, ease: 'none' }, '<=0')

        // tlHiddenGreating
        //     .fromTo('.header__greating', { autoAlpha: 1 }, { autoAlpha: 0, duration: 1, ease: 'none' })

        onCleanup(() => {
            // tl.kill();
            // tlShowHeader.kill();
            // tlHiddenGreating.kill();
        });
    })
    return <div ref={scriptRef} class="divScript"></div>
}

export default HeroScript;