import { onMount, onCleanup } from 'solid-js';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

const ServicesScript = () => {
    let scriptRef;

    onMount(() => {
        if (!scriptRef) return;
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

        if (window.innerWidth <= 991) {
            document.querySelectorAll('.about__service-item').forEach((el) => {
                el.addEventListener("click", function (e) {
                    let content = el.querySelector('.about__service-item-desc');
                    requestAnimationFrame(() => {
                        if (el.classList.contains('active')) {
                            gsap.to(content, {
                                height: 0, duration: .3, ease: 'power2.inOut',
                                onStart() {
                                    el.classList.remove('active');
                                }
                            });
                        }
                        else {
                            gsap
                                .timeline()
                                .to('.about__service-item:not(active) .about__service-item-desc', {
                                    height: 0, duration: .5, ease: 'power2.inOut',
                                    start() {
                                        document.querySelectorAll('.about__service-item:not(active)').forEach(el => el.classList.remove('active'));
                                        el.classList.add('active');
                                    }
                                })
                                .to(content, {
                                    height: el.querySelector('.about__service-item-desc').scrollHeight, duration: .5, ease: 'power2.inOut'
                                }, "<=.1");
                        }
                    })
                })
            })
        }

        onCleanup(() => tl.kill());
    })

    return <div ref={scriptRef} class="divScript"></div>
}
export default ServicesScript;