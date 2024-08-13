import gsap from 'gsap';
import { onMount, onCleanup } from 'solid-js';
import { initScrollTrigger } from '~/components/core/scrollTrigger';

const ServicesScript = () => {
    let scriptRef;

    onMount(() => {
        if (!scriptRef) return;
        initScrollTrigger();

        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.about__daily',
                start: 'top bottom',
                end: 'top top',
                scrub: true
            }
        })
        tl.from('.about__daily-img-inner', { yPercent: window.innerWidth > 767 ? -20 : -10, duration: 1, ease: 'linear' });

        const serviceItems = document.querySelectorAll('.about__service-item');
        const handleToggle = (e) => {
            const el = e.currentTarget;
            const content = el.querySelector('.about__service-item-desc');

            requestAnimationFrame(() => {
                if (el.classList.contains('active')) {
                gsap.to(content, {
                    height: 0,
                    duration: 0.3,
                    ease: 'power2.inOut',
                    onStart() {
                    el.classList.remove('active');
                    }
                });
            } else {
                gsap.timeline()
                    .to('.about__service-item.active .about__service-item-desc', {
                        height: 0,
                        duration: 0.5,
                        ease: 'power2.inOut',
                        onStart() {
                        document.querySelectorAll('.about__service-item.active').forEach(item => {
                            item.classList.remove('active');
                        });
                        el.classList.add('active');
                        }
                    })
                    .to(content, {
                        height: content.scrollHeight,
                        duration: 0.5,
                        ease: 'power2.inOut'
                    }, "<=.1");
            }});
        };

        if (window.innerWidth <= 991) {
            serviceItems.forEach(el => {
                el.addEventListener('click', handleToggle);
            });
        }
        onCleanup(() => {
            tl.kill();
            serviceItems.forEach(el => {
                el.removeEventListener('click', handleToggle);
            });
        });
    })

    return <div ref={scriptRef} class="divScript"></div>
}
export default ServicesScript;