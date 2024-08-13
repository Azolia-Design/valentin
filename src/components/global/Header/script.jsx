import gsap from 'gsap';
import { onMount, onCleanup } from 'solid-js';
import { initScrollTrigger } from '~/components/core/scrollTrigger';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

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

        initScrollTrigger();

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

        if (window.location.pathname !== '/') {
            gsap.fromTo('.header__name', { autoAlpha: 1, yPercent: -200 }, { autoAlpha: 1, yPercent: -100, duration: 1, ease: 'power2.inOut' })
        }
        else {
            gsap.to('.header__greating', { autoAlpha: 1, ease: 'power2.inOut' });
        }

        onCleanup(() => {
            document.querySelector('.header__toggle').removeEventListener('click', navToggleHandler);
            document.querySelectorAll('.nav__menu-link').forEach((el) => el.removeEventListener('click', menuLinkHandler));
        })
    })
    return (<div ref={scriptRef} class="divScript"></div>)
}
export default HeaderScript;
