import gsap from 'gsap';
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { createEffect, createSignal, onMount, onCleanup } from "solid-js";
import { getCursor } from '~/components/core/cursor';

function TestimonialItem(props) {
    let itemRef;
    createEffect(() => {
        if (props.isOpen) {
            gsap.to(itemRef.querySelector('.home__testi-item-feedback-wrap'), { height: itemRef.querySelector('.home__testi-item-feedback.fully').scrollHeight, duration: .4 });
        }
        else {
            gsap.to(itemRef.querySelector('.home__testi-item-feedback-wrap'), { height: itemRef.querySelector('.home__testi-item-feedback.shorten').offsetHeight, duration: .4 });
        }
    })
    return (
        <div ref={itemRef} class="home__testi-item-content grid">
            <p class="heading h4 cl-txt-disable fw-thin home__testi-item-order">{(props.index + 1).toString().padStart(2, '0')}.</p>
            <div class="home__testi-item-info">
                <p class="fs-24 fw-med cl-txt-title">{props.data.name}</p>
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
                        accordionClick(idx);
                        const style = getComputedStyle(e.target);
                        const scaleFactor = style.getPropertyValue('--scale-factor').trim();
                        setScaleFactor(scaleFactor);
                        if (e.target.classList.contains('active')) {
                            getCursor().removeState('-media');
                            getCursor().removeState('-stroke');
                            e.target.removeAttribute('data-cursor');
                            e.target.removeAttribute('data-cursor-img');
                        }
                        else {
                            getCursor().addState('-media');
                            getCursor().addState('-stroke');
                            e.target.setAttribute('data-cursor', '-stroke');
                            e.target.setAttribute('data-cursor-img', props.plusIc);
                        }
                    }}>
                    <TestimonialItem data={el} index={idx} scaleFactor={scaleFactor()} isOpen={activeIndex() === idx}/>
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