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

        if (window.innerWidth <= 767) {
            document.querySelector('.header__toggle').addEventListener('click', function (e) {
                let elActive = document.querySelector('.header__toggle .current');
                gsap.to(elActive, {
                    yPercent: -100, autoAlpha: 0, duration: 0.5, ease: 'power2.inOut',
                    onStart() {
                        e.target.classList.add('ev-none');
                        elActive.classList.remove('current');
                    }
                });
                const elNonActive = document.querySelector('.header__toggle :not(.current)');

                gsap.set(elNonActive, { yPercent: 100, autoAlpha: 0, duration: 0 });
                gsap.to(elNonActive, {
                    yPercent: 0, autoAlpha: 1, duration: 0.5, ease: 'power2.inOut',
                    onComplete() {
                        e.target.classList.remove('ev-none');
                    }
                });
                elNonActive.classList.add('current');

                let nav = document.querySelector('.nav');
                if (document.querySelector('.nav').classList.contains('active')) {
                    nav.classList.remove('active');
                }
                else {
                    nav.classList.add('active');
                }
            })
        }
    })
    return (<div ref={scriptRef} class="divScript"></div>)
}
export default HeaderScript;
