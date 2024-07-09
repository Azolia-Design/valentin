import gsap from 'gsap';
import { createEffect, createSignal, onMount } from "solid-js";
import { getCursor } from '~/components/core/cursor';

function TestimonialItem(props) {
    let itemRef;

    createEffect(() => {
        if (props.isOpen) {
            gsap.to(itemRef.querySelector('.home__testi-item-feedback-wrap'), { maxHeight: itemRef.querySelector('.home__testi-item-feedback.fully').scrollHeight, duration: .4 });
        }
        else {
            gsap.to(itemRef.querySelector('.home__testi-item-feedback-wrap'), { maxHeight: itemRef.querySelector('.home__testi-item-feedback.shorten').offsetHeight, duration: .4 });
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
    const [activeIndex, setActiveIndex] = createSignal(-1);

    const accordionClick = (index) => {
        setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
    };
    return (
        props.data.map((el, idx) => (
            <div class="home__testi-item"
                data-cursor-img={props.plusIc}
                class={`home__testi-item ${activeIndex() === idx ? 'active' : ''}`}
                onClick={(e) => {
                    accordionClick(idx);
                    if (e.target.classList.contains('active')) {
                        getCursor().removeState('-media');
                    }
                    else {
                        getCursor().addState('-media');
                    }
                }}>
                <TestimonialItem data={el} index={idx} isOpen={activeIndex() === idx}/>
                <div class="home__testi-item-image">
                    <img src={el.image.src} alt={el.image.alt} class="home__testi-item-image-main" width={90} height={120} />
                    {props.blur}
                </div>
            </div>
        ))
    )
}

export default Testimonials;