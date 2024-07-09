import { register } from 'swiper/element/bundle';
import { For, createEffect, createSignal, onMount } from "solid-js";
import gsap from 'gsap';

const ProjectListing = (props) => {
    let containerRef;
    const [activeSlide, setActiveSlide] = createSignal(0);
    const [swiper, setSwiper] = createSignal(null);

    const setupSwiper = {
		loop: true,
		slidesPerView: 1,
		spaceBetween: 0,
		effect: "fade",
		allowTouchMove: false,
        onSwiperInit: (e) => {
            setSwiper(e.detail[0]);
        },
        onSwiperSlideChange: ({ detail }) => {
            setActiveSlide(detail[0].realIndex);
		}
    }

    onMount(() => {
        if (!containerRef) return;
        register();
    });

    createEffect(() => {
        if (!containerRef) return;

        const tlImg = gsap.timeline({});
        tlImg.seek(0);

        const animTransImg = (index) => {
            const DOM = {
                img: document.querySelectorAll('.home__project-thumbnail-img')[index],
                progressBar: document.querySelectorAll('.home__project-slide-item-progress-inner')[index]
            }
            tlImg
                .set(DOM.img, { x: -50, autoAlpha: 0 }, 0)
                .set(DOM.progressBar, { rotation: 0 })
                .to(DOM.img, { x: 0, autoAlpha: 1, duration: 0.8 }, 0)
                .to(DOM.progressBar, { duration: 8, ease: 'none', rotation: 360, clearProps: 'all' }, 0)
                .set(DOM.img, { x: 0, autoAlpha: 1 })
                .to(DOM.img, {
                    x: 50, autoAlpha: 0, duration: 0.8,
                    onComplete: () => {
                        if (swiper()) swiper().slideNext();
                    }
                }, "<=0.1")
        }

        animTransImg(activeSlide());
    }, [activeSlide()]);

    return (
        <div ref={containerRef} class="home__project-listing grid">
            <div class="home__project-slide">
                {props.data.map((project, idx) => (
                    <div class={`home__project-slide-item-wrap${idx == activeSlide() ? ' active' : ''}`}>
                        <div class="home__project-slide-item">
                            <div class="home__project-slide-item-progress">
                                <div class="home__project-slide-item-progress-inner"></div>
                            </div>
                            <div class="home__project-slide-item-img">
                                <img class="img" src={project.thumbnail.src} alt={project.thumbnail.alt} width={692} height={"auto"} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div class="home__project-name">
                <div class="fs-20 fw-med home__project-pagination">
                    <span class="cl-txt-title">{(activeSlide() + 1).toString().padStart(2, '0')} </span><span class="cl-txt-disable">/ 04</span>
                </div>
                <h4 class="heading h5 fw-med upper cl-txt-title">{props.data[activeSlide()].title}</h4>
            </div>
            <div class="home__project-thumbnail" data-cursor-text="View">
                <swiper-container {...setupSwiper}>
                    <For each={props.data}>
                        {(project) => (
                            <swiper-slide>
                                <div class="home__project-thumbnail-img">
                                    <img class="img img-fill" src={project.thumbnail.src} alt={project.thumbnail.alt} />
                                </div>
                            </swiper-slide>
                        )}
                    </For>
                </swiper-container>
                {props.blur}
            </div>
            <div class="home__project-sub-info">
                <div class="home__project-year">
                    <p class="cl-txt-desc fw-med home__project-label">Year</p>
                    <div class="heading h5 fw-med cl-txt-title">{props.data[activeSlide()].year}</div>
                </div>
                <div class="home__project-role">
                    <p class="cl-txt-desc fw-med home__project-label">Role</p>
                    <div class="home__project-role-listing">
                        <For each={props.data[2].role}>
                            {(role) => <p class="fs-20 cl-txt-sub">{role}</p>}
                        </For>
                    </div>
                </div>
            </div>
            <div class="home__project-desc">
                <p class="cl-txt-desc fw-med home__project-label">Description</p>
                <p class="fs-20 cl-txt-sub">{props.data[activeSlide()].desc}</p>

                <a href={props.data[activeSlide()].link} class="cl-txt-orange arrow-hover home__project-link">
                    <span class="txt-link fs-20 cl-txt-orange">All projects</span>
                    {props.arrows}
                </a>
            </div>
        </div>
    )
}

export default ProjectListing;