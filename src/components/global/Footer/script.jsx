import gsap from 'gsap';
import { onMount, onCleanup } from 'solid-js';
import SplitType from 'split-type';
import { initScrollTrigger } from '~/components/core/scrollTrigger';

const FooterScript = () => {
    let scriptRef;

    onMount(() => {
        if (!scriptRef) return;

        initScrollTrigger();
        const splitedText = new SplitType('.footer__title', { types: 'lines, words', lineClass: 'split-line' });

        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.footer__title',
                start: 'top+=50% bottom',
                end: 'bottom+=50% bottom',
                scrub: true,
            }
        })

        tl.fromTo(splitedText.words, { autoAlpha: 0 }, { autoAlpha: 1, duration: 5.5, stagger: .4, ease: 'linear' })

        let tlInfinite = gsap.timeline({
            scrollTrigger: {
                trigger: '.home-footer-hero',
                start: 'top top+=20%',
                end: 'bottom bottom',
                scrub: true,
                markers: true
            }
        })


        tlInfinite
            .to('.footer__bg', {
                scaleY: 5,
                scaleX: 2.5,
                skewX: '-20deg',
                duration: 1,
                ease: 'power2.in'
            })
            .to('.footer__main-image-img.ver-light', { autoAlpha: 0, duration: .5, ease: 'linear' }, "<=.35")
            .to(['.footer__link', '.footer__label'], { autoAlpha: 0, duration: .4, stagger: .01, ease: 'power2.in' }, "<=0")
            .to('.footer__main-image', { scale: 3.4, xPercent: 50, duration: 5, transformOrigin: 'left 40%'  }, "<=0")
            .to('.footer__cta', { autoAlpha: 0, duration: .5, ease: 'linear' }, "<=0")
            .to('.footer__marquee-wrap', { autoAlpha: 0, duration: .5, ease: 'power2.in' }, "<=0.1")
            .to('.footer__main-image-img.ver-mid', { autoAlpha: 0, duration: .5, ease: 'linear' }, "<=.35")
            .to('.footer__title', { autoAlpha: 0, duration: 0 }, "<=0.1")
            .to('.footer__bg', { autoAlpha: 0, duration: .3, ease: 'linear' }, '<=0')
            .to('.footer', { background: 'rgba(255, 255, 255, 0)', duration: 0 }, "<=0")
            .from('.home__hero-clone-bg-main', { filter: 'blur(4px)', scale: .6, duration: 5, transformOrigin: '20% 85%' }, "<=0")
            .to('.footer__main-image', { filter: 'blur(15px)', duration: 1 }, "<=0.1")
            // .to('.footer__main-image', { autoAlpha: 0, duration: .5 }, '<=3')

        onCleanup(() => {
            tl.kill();
            // tlInfinite.kill();
            if (splitedText.isSplit) splitedText.revert();
        });
    })

    return (<div ref={scriptRef} class="divScript"></div>)
}

export default FooterScript;