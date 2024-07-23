import { createSignal, Index, onMount } from "solid-js";
import Swiper from 'swiper';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

const ProjectListing = (props) => {
    let swiperRef;
    const [index, setIndex] = createSignal({ curr: 0, prev: -1 });

    const handleActive = (idx) => {
        // console.log(idx)
        if (idx === index().curr) return;
        // console.log(first)
        setIndex({ curr: idx, prev: index().curr });
    }

    onMount(() => {
        if (!swiperRef) return;
        gsap.registerPlugin(ScrollTrigger);

        // swiperRef.querySelectorAll('[data-swiper]').forEach((item) => {
        //     let swiperAttr = item.getAttribute('data-swiper');
        //     if (swiperAttr == 'swiper') {
        //         item.classList.add('swiper');
        //     }
        //     else {
        //         item.classList.add(`swiper-${swiperAttr}`);
        //     }
        // });

        // let swiperEl = new Swiper(swiperRef, {
        //     slidesPerView: 1,
        // })

        const numberOfBreakPoints = props.data.length;
        const step = 1 / numberOfBreakPoints;
        const breakPoints = Array.from({ length: numberOfBreakPoints + 1 }, (_, index) => parseFloat((index * step).toPrecision(2)));
        const onUpdateProgress = (progress) => {
            for (let i = 0; i < breakPoints.length - 1; i++) {
                const startPoint = breakPoints[i];
                const endPoint = breakPoints[i + 1];

                if (progress >= startPoint && progress < endPoint) {
                    let idx = Math.floor(progress * props.data.length)
                    handleActive(idx);
                }
            }
        }

        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.projects__listing',
                start: 'top top',
                end: 'bottom bottom',
                scrub: true,
                markers: true,
                onUpdate(self) {
                    onUpdateProgress(self.progress);
                }
            },
            defaults: {
                ease: 'none'
            }
        })
        let thumbnails = document.querySelectorAll('.project__thumbnail-img');

        thumbnails.forEach((thumbnail, idx) => {
            tl
                .set(thumbnails[idx], { zIndex: props.data.length - idx, transformOrigin: 'top left', duration: 0 })
                .fromTo(thumbnails[idx], { scale: 1, transformOrigin: 'top left' }, { scale: 0, duration: 1 }, "<=0")
                .fromTo(thumbnails[idx === props.data.length - 1 ? 0 : idx + 1], { scale: 0, transformOrigin: 'top left' }, { scale: 1, transformOrigin: 'bottom right', duration: 1 }, "<=0")
        })
        gsap.set(thumbnails, { scale: (i) => i !== 0 ? 0 : 1, transformOrigin: (i) => i !== 0 ? 'bottom right' : 'top left' });
    })

    // createEffect(() => {

    // })
    return (
        <div class="projects__listing-main grid" >
            <h2 className="heading h3 fw-semi cl-txt-title upper project__name">{props.data[index().curr].title}</h2>
            <p class="project__desc">{props.data[index().curr].desc}</p>
            <div class="project__info">
                <div class="project__role">
                    <p class="fw-med cl-txt-desc project-item-label">Role</p>
                    <For each={props.data[index().curr].roles}>
                        {(role) => <p class="cl-txt-sub">{role}</p>}
                    </For>
                </div>
                <div class="project__services">
                    <p class="fw-med cl-txt-desc project-item-label">Services</p>
                    <For each={props.data[index().curr].services}>
                        {(service) => <p class="cl-txt-sub">{service}</p>}
                    </For>
                </div>
                <div class="project__selling">
                    <p class="fw-med cl-txt-desc project-item-label">Selling points</p>
                    <For each={props.data[index().curr].selling_points}>
                        {(points) => <p class="cl-txt-sub">{points}</p>}
                    </For>
                </div>
            </div>
            <p class="fs-20 fw-med cl-txt-sub project__year">© {props.data[index().curr].year}</p>
            <div class="project__thumbnail-wrap" data-cursor-text="View">
                <div className="project__thumbnail" data-swiper="swiper" ref={swiperRef}>
                    <div className="project__thumbnail-listing grid-1-1" data-swiper="wrapper">
                        {props.data.map(({ thumbnail }, idx) => (
                            <div class={`project__thumbnail-img${idx === index().curr ? ' active' : ''}`} data-swiper="slide">
                                <img class="img img-fill" src={thumbnail.src} alt={thumbnail.alt} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ProjectListing;