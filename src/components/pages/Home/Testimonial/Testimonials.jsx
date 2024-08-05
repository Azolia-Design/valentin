import gsap from 'gsap';
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { createEffect, createSignal, onMount, onCleanup } from "solid-js";
import { getCursor } from '~/components/core/cursor';

function TestimonialItem(props) {
    let itemRef;
    createEffect(() => {
        let animationTrigger = (height) => ({ height: height, duration: .4, onComplete() { props.wrap.classList.remove('animating') } })
        gsap.to(itemRef.querySelector('.home__testi-item-feedback-wrap'),
            props.isOpen
                ? animationTrigger(itemRef.querySelector('.home__testi-item-feedback.fully').scrollHeight)
                : animationTrigger(itemRef.querySelector('.home__testi-item-feedback.shorten').offsetHeight)
        );
    })
    return (
        <div ref={itemRef} class="home__testi-item-content grid">
            <span class='line'></span>
            <p class="heading h4 cl-txt-disable fw-thin home__testi-item-order">{(props.index + 1).toString().padStart(2, '0')}.</p>
            <div class="home__testi-item-info">
                <p class="fs-24 fw-med cl-txt-title home__testi-item-name">{props.data.name}</p>
                <p class="cl-txt-sub">{props.data.position}</p>
            </div>
            <div class="fs-24 fw-thin home__testi-item-feedback-wrap">
                <div class="home__testi-item-feedback shorten">
                    <div class="home__testi-item-feedback-txt"
                        >{props.data.feedback}</div>
                </div>
                <div class="home__testi-item-feedback fully">
                    <div class="home__testi-item-feedback-txt">{props.data.feedback}</div>
                </div>
            </div>
            <div class="home__testi-item-toggle">
                <span></span>
                <span></span>
            </div>
        </div>
    )
}
function Testimonials(props) {
    let containerRef;
    const [activeIndex, setActiveIndex] = createSignal(-1);
    const [scaleFactor, setScaleFactor] = createSignal(1);

    const accordionClick = (index) => {
        setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
    };
    onMount(() => {
        if (!containerRef) return;

        gsap.registerPlugin(ScrollTrigger);
        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.home__testi-listing',
                start: 'top bottom',
                end: 'bottom bottom',
                scrub: true
            }
        });

        tl.to('.home__testi-item', { '--scale-factor': '1', duration: 1, stagger: .03 })

        onCleanup(() => tl.kill());
    })
    return (
        <div class="home__testi-listing-inner" ref={containerRef}>
            {props.data.map((el, idx) => (
                <div class="home__testi-item"
                    data-cursor="-stroke"
                    data-cursor-img={props.plusIc}
                    class={`home__testi-item ${activeIndex() === idx ? 'active' : ''}`}
                    onClick={(e) => {
                        if (containerRef.classList.contains('animating')) return;
                        containerRef.classList.add('animating');

                        accordionClick(idx);
                        const style = getComputedStyle(e.target);
                        const scaleFactor = style.getPropertyValue('--scale-factor').trim();
                        setScaleFactor(scaleFactor);

                        if (window.innerWidth > 991) {
                            document.querySelectorAll('.home__testi-item').forEach((el, i) => {
                                if (i === idx) {
                                    if (e.target.classList.contains('active')) {
                                        el.removeAttribute('data-cursor');
                                        el.removeAttribute('data-cursor-img');
                                        requestAnimationFrame(() => {
                                            getCursor().removeState('-media');
                                            getCursor().removeState('-stroke');
                                        })
                                    }
                                    else {
                                        el.setAttribute('data-cursor', '-stroke');
                                        el.setAttribute('data-cursor-img', props.plusIc);
                                        requestAnimationFrame(() => {
                                            getCursor().addState('-media');
                                            getCursor().addState('-stroke');
                                        })
                                    }
                                }
                                else {
                                    el.setAttribute('data-cursor', '-stroke');
                                    el.setAttribute('data-cursor-img', props.plusIc);
                                }
                            })
                        }
                    }}>
                    <TestimonialItem wrap={containerRef} data={el} index={idx} scaleFactor={scaleFactor()} isOpen={activeIndex() === idx}/>
                    <div class="home__testi-item-image">
                        <img src={el.image.src} alt={el.image.alt} class="home__testi-item-image-main" width={90} height={120} loading="lazy" />
                        {props.blur}
                    </div>
                </div>
            ))}
        </div>

    )
}

export default Testimonials;