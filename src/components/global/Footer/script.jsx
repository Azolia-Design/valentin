import gsap from 'gsap';
import { onMount, onCleanup } from 'solid-js';
import SplitType from 'split-type';
import { initScrollTrigger } from '~/components/core/scrollTrigger';
import { cvUnit } from '~/utils/number';

const FooterScript = () => {
    let scriptRef;

    let allSplitText = [];
    const elements = [
        { selector: '.home__hero-clone-scope li' },
        { selector: '.home__hero-clone-scope-cta' },
        { selector: '.home__hero-clone-greating' },
        { selector: '.home__hero-clone-greating' },
        { selector: '.home__hero-clone-name' },
        { selector: '.home__hero-clone-title-txt' },
        { selector: '.home__hero-clone-intro' }
    ]

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

        let tlInfiniteImg = gsap.timeline({
            scrollTrigger: {
                trigger: '.home-footer-hero',
                start: 'top top+=20%',
                end: 'bottom bottom',
                scrub: true
            }
        })
        tlInfiniteImg
            .to('.footer__bg', {
                scaleY: 5,
                scaleX: 2.5,
                skewX: '-30deg',
                duration: 1,
                ease: 'power2.in'
            })
            .to('.footer__main-image-img.ver-light', { autoAlpha: 0, duration: .5, ease: 'linear' }, "<=.35")
            .to(['.footer__link', '.footer__label'], { autoAlpha: 0, duration: .4, stagger: .01, ease: 'power2.in' }, "<=0")
            .to('.footer__main-image', { scale: 3.5, xPercent: 50, duration: 4, transformOrigin: 'left 40%'  }, "<=0")
            .to('.footer__cta', { autoAlpha: 0, duration: .5, ease: 'linear' }, "<=0")
            .to('.footer__marquee-wrap', { autoAlpha: 0, duration: .5, ease: 'power2.in' }, "<=0.1")
            .to('.footer__main-image-img.ver-mid', { autoAlpha: 0, duration: .5, ease: 'linear' }, "<=.35")
            .to('.footer__title', { autoAlpha: 0, duration: 0 }, "<=0.1")
            .to('.footer__bg', { autoAlpha: 0, duration: .3, ease: 'linear' }, '<=0')
            .to('.footer', { background: 'rgba(255, 255, 255, 0)', duration: 0 }, "<=0")
            .from('.home__hero-clone-bg', { filter: 'blur(4px)', autoAlpha: .4, rotationY: -12, rotateX: 10, rotateZ: -2, scale: .6, duration: 4, transformOrigin: '20% 85%' }, "<=0")
            .to('.footer__main-image', { filter: 'blur(12px)', duration: 1 }, "<=0")
            .to('.footer__main-image', { autoAlpha: 0, duration: .8 }, "<=2.2")

        // elements.forEach((el) => {
        //     let subSplitText = [];

        //     let currSelector = document.querySelectorAll(el.selector);
        //     if (currSelector.length > 0) {
        //         currSelector.forEach((text, idx) => {
        //             let splittext = new SplitType(text, { types: 'lines, words', lineClass: 'split-line unset-margin' });
        //             gsap.set(splittext.words, { autoAlpha: 0, willChange: 'transform, opacity' });
        //             subSplitText.push(splittext);
        //         })
        //     }
        //     else {
        //         let splittext = new SplitType(currSelector, { types: 'lines, words', lineClass: 'split-line' });
        //         gsap.set(splittext.words, { autoAlpha: 0, willChange: 'transform, opacity' });
        //         subSplitText.push(splittext);
        //     }

        //     allSplitText.push(subSplitText); // Push to the sub-array
        // })

        let tlInfiniteText = gsap.timeline({
            scrollTrigger: {
                trigger: '.home-footer-hero',
                start: `bottom-=${cvUnit(200, 'vh')}px bottom`,
                end: 'bottom bottom',
                scrub: true,
                snap: {
                    snapTo: 1,
                }
            }
        })

        tlInfiniteText
            // .to('.home__hero-clone-main', { autoAlpha: 1, duration: 1 })
            .to('.home__hero-clone-bg-under', { autoAlpha: 1, duration: 1 }, "<=.8")
            .to('.home__hero-clone-bg-main', { autoAlpha: 0, duration: 1 }, "<=.8")

        // allSplitText.forEach(el => {
        //     if (el.length > 0) {
        //         el.forEach((splitChild) => {
        //             tlInfiniteText.fromTo(splitChild.words, { yPercent: 70, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 1.5, ease: 'power2.inOut' }, "<=0")
        //         })
        //     }
        //     else {
        //         tlInfiniteText.fromTo(el.words, { yPercent: 70, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 1.5, ease: 'power2.inOut' }, "<=0")
        //     }
        // });


        onCleanup(() => {
            tl.kill();
            tlInfiniteImg.kill();
            tlInfiniteText.kill();
            if (splitedText.isSplit) splitedText.revert();
        });
    })

    return (<div ref={scriptRef} class="divScript"></div>)
}

export default FooterScript;