import gsap from 'gsap';
import { onMount, onCleanup } from 'solid-js';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { cvUnit } from '~/utils/number';

const HeaderScript = () => {
    let scriptRef;

    const toggleNav = () => {
        let elActive = document.querySelector('.header__toggle .current');
        gsap.to(elActive, {
            yPercent: -100, autoAlpha: 0, duration: 0.5, ease: 'power2.inOut',
            onStart() {
                document.querySelector('.header__toggle').classList.add('ev-none');
                elActive.classList.remove('current');
            }
        });

        const elNonActive = document.querySelector('.header__toggle :not(.current)');
        gsap.set(elNonActive, { yPercent: 100, autoAlpha: 0, duration: 0 });
        gsap.to(elNonActive, {
            yPercent: 0, autoAlpha: 1, duration: 0.5, ease: 'power2.inOut',
            onComplete() {
                document.querySelector('.header__toggle').classList.remove('ev-none');
            }
        });
        elNonActive.classList.add('current');
    }

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

        let nav = document.querySelector('.nav');

        const navToggleHandler = (e) => {
            toggleNav();
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
            } else {
                nav.classList.add('active');
            }
        };

        const menuLinkHandler = (e) => {
            setTimeout(() => {
                toggleNav();
                if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                }
            }, 500);
        };

        if (window.innerWidth <= 767) {
            document.querySelector('.header__toggle').addEventListener('click', navToggleHandler);
            document.querySelectorAll('.nav__menu-link').forEach((el) => el.addEventListener('click', menuLinkHandler));
        }

        onCleanup(() => {
            tl.kill();
            document.querySelector('.header__toggle').removeEventListener('click', navToggleHandler);
            document.querySelectorAll('.nav__menu-link').forEach((el) => el.removeEventListener('click', menuLinkHandler));
        })
    })
    return (<div ref={scriptRef} class="divScript"></div>)
}
export default HeaderScript;
