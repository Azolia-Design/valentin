import { register } from 'swiper/element/bundle';
import { For, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import gsap from 'gsap';
import SplitType from 'split-type';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { getLenis } from '~/components/core/lenis';
import Truncate from '~/components/common/TruncateText';

const ProjectListing = (props) => {
    let containerRef;
    const [activeSlide, setActiveSlide] = createSignal(0);
    const [swiper, setSwiper] = createSignal(null);

    const setupSwiper = {
        loop: true,
		slidesPerView: 1,
		spaceBetween: 0,
        effect: "fade",
        onSwiperInit: (e) => {
            setSwiper(e.detail[0]);
            requestAnimationFrame(() => handleActiveSlide(0, true));
        },
        onSwiperSlideChange: ({ detail }) => {
            // setActiveSlide(detail[0].activeIndex);
		}
    }

    let allSplitText = [];
    let elements = [
        { selector: '.home__project-name-txt', splitBy: 'words' },
        { selector: '.home__project-year-txt', splitBy: 'chars', options: { duration: .6 } },
        { selector: '.home__project-desc-txt', splitBy: 'words', options: { duration: 1, stagger: .02 } },
        { selector: '.home__project-role-listing-inner', splitBy: 'words', options: { duration: 1, stagger: .02 } }
    ]

    const numberOfBreakPoints = props.data.length;
    const step = 1 / numberOfBreakPoints;
    const breakPoints = Array.from({ length: numberOfBreakPoints + 1 }, (_, index) => parseFloat((index * step).toPrecision(2)));
    const onUpdateProgress = (progress) => {
        for (let i = 0; i < breakPoints.length - 1; i++) {
            const startPoint = breakPoints[i];
            const endPoint = breakPoints[i + 1];

            if (progress >= startPoint && progress < endPoint) {
                let idx = Math.floor(progress * 3)
                // console.log(idx)
                handleActiveSlide(idx);
            }
        }
    }

    const scrollToIndex = (index) => {
        console.log('scroll to', index)
        const rect = document.querySelector('.home__project-main').getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        getLenis().scrollTo(rect.top + scrollTop + (window.innerHeight * index))

        // function toLabel(duration, timeline, label) {
        //     getLenis().stop()
        //     const yStart = $('.home-benefit').offset().top - $('.header').outerHeight()
        //     const now = timeline.progress()
        //     timeline.seek(label)
        //     const goToProgress = timeline.progress()
        //     timeline.progress(now)
        //     lenis.scrollTo(yStart + (timeline.scrollTrigger.end - timeline.scrollTrigger.start) * goToProgress, {
        //         duration: duration,
        //         force: true,
        //     })
        // }
    }

    onMount(() => {
        if (!containerRef) return;
        register();

        gsap.registerPlugin(ScrollTrigger);
        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.home__project-main',
                start: 'top top',
                end: 'bottom bottom',
                scrub: true,
                // snap: breakPoints,
                onUpdate(self) {
                    onUpdateProgress(self.progress);
                }
            }
        })

        elements.forEach((el) => {
            let elementSplitText = []; // Declare a new sub-array for each element

            document.querySelectorAll(el.selector).forEach((text, idx) => {
                let subSplitText = [];

                if (text.querySelectorAll('p').length > 0) {
                    text.querySelectorAll('p').forEach((paragraph) => {
                        let splittext = new SplitType(paragraph, { types: `lines, ${el.splitBy}`, lineClass: 'split-line' });
                        gsap.set(splittext[el.splitBy], { autoAlpha: 0 });
                        subSplitText.push(splittext);
                    });
                } else {
                    let splittext = new SplitType(text, { types: `lines, ${el.splitBy}`, lineClass: 'split-line' });
                    gsap.set(splittext[el.splitBy], { autoAlpha: 0 });
                    subSplitText.push(splittext);
                }

                elementSplitText.push(subSplitText); // Push to the sub-array
            });

            allSplitText.push(elementSplitText); // Push the sub-array to the main array
        });

        onCleanup(() => tl.kill());
    });

    const handleActiveSlide = (index, firstInit = false) => {
        if (((index === activeSlide()) || index >= props.data.length) && !firstInit) return;
        let prevIndex = activeSlide();
        console.log(index)

        let yOffSet = {
            out: index - prevIndex >= 0 ? -70 : 70,
            in: index - prevIndex >= 0 ? 70 : -70
        }

        elements.forEach((el, idx) => {
            let tl = gsap.timeline({});

            if (allSplitText[idx][prevIndex].length !== 1) {
                allSplitText[idx][prevIndex].forEach((splittext) => {
                    let tlChild = gsap.timeline({});
                    tlChild.set(splittext[el.splitBy], { yPercent: 0, autoAlpha: 1 })
                        .to(splittext[el.splitBy], { yPercent: yOffSet.out, autoAlpha: 0, duration: 0.3, stagger: 0.04, ease: 'power3.inOut', ...el.options }, '<=0');
                });
            } else {
                tl
                    .set(allSplitText[idx][prevIndex][0][el.splitBy], { yPercent: 0, autoAlpha: 1 })
                    .to(allSplitText[idx][prevIndex][0][el.splitBy], { yPercent: yOffSet.out, autoAlpha: 0, duration: 0.8, stagger: 0.04, ease: 'power3.inOut', ...el.options }, '<=0');
            }

            if (allSplitText[idx][index].length !== 1) {
                allSplitText[idx][index].forEach((splittext) => {
                    let tlChild = gsap.timeline({});
                    tlChild
                        .set(splittext[el.splitBy], { yPercent: yOffSet.in, autoAlpha: 0 })
                        .to(splittext[el.splitBy], { yPercent: 0, autoAlpha: 1, duration: 0.3, stagger: 0.04, ease: 'power3.inOut', ...el.options }, '<=0');
                    });
            } else {
                tl
                    .set(allSplitText[idx][index][0][el.splitBy], { yPercent: yOffSet.in, autoAlpha: 0 })
                    .to(allSplitText[idx][index][0][el.splitBy], { yPercent: 0, autoAlpha: 1, duration: 0.8, stagger: 0.04, ease: 'power3.inOut', ...el.options }, '<=0');
            }
        })
        console.log("curr", index)
        console.log("prev", prevIndex)
        if (index - prevIndex >= 0) {
            swiper().slideTo(index);
            nextAnimation(index)
        }
        else {
            prevAnimation(prevIndex);
        }
        setActiveSlide(index);

    }


    const nextAnimation = (index) => {
        const DELAY = 10;

        const slides = document.querySelectorAll('.home__project-thumbnail-img')
        const slide = slides[index];
        const img = slide.querySelector('img');

        gsap.set(slide, { clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)' });
        gsap.set(img, { scale: 2, top: '4em' });

        let tlNext = gsap.timeline({});
        tlNext
            .to(slide, { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)", duration: 2, ease: 'power4.inOut' })
            .to(img, { scale: 1, top: '0%', duration: 2, ease: 'power3.inOut' }, 0)
            .to(slide, { clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)", duration: 2, ease: 'power4.inOut' }, 0)
            // .to(DOM.title.words, { yPercent: 0, duration: 2, ease: 'power3.inOut' }, 0);

        // const progressBar = document.querySelectorAll('.home__project-slide-item-progress-inner')[activeSlide()];

        // gsap.set(progressBar, { rotation: 0 })
        // gsap.to(progressBar, {
        //     duration: DELAY, ease: 'none', rotation: 360, clearProps: 'all', onComplete: () => {
        //         let nextIndex = activeSlide() + 1;
        //         if (nextIndex < props.data.length) {
        //             handleActiveSlide(nextIndex);
        //         }
        //     }
        // })
    }

    const prevAnimation = (index) => {
        const slides = document.querySelectorAll('.home__project-thumbnail-img')
        const slide = slides[index];
        const img = slide.querySelector('img');

        gsap.set(slide, { clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)" })
        gsap.set(img, { scale: 1, top: '0%' });
        // gsap.set(DOM.title.words, { yPercent: 0 });

        let tlPrev = gsap.timeline({});

        tlPrev
            .to(slide, { clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)', duration: 2, ease: 'power4.inOut' })
            .to(img, { scale: 2, top: '4em', duration: 2, ease: 'power3.inOut' }, 0)
            // .to(DOM.title.words, { yPercent: -100, duration: 2, ease: 'power3.inOut' }, 0);
    }

    return (
        <div ref={containerRef} class="home__project-listing grid">
            <div class="home__project-slide">
                {props.data.map((project, idx) => (
                    <div
                        onClick={() => {
                            // handleActiveSlide(idx);
                            scrollToIndex(idx);
                        }}
                        class={`home__project-slide-item-wrap${idx == activeSlide() ? ' active' : ''}`}>
                        <div class="home__project-slide-item">
                            <div class="home__project-slide-item-progress">
                                <div class="home__project-slide-item-progress-inner"></div>
                            </div>
                            <div class="home__project-slide-item-img">
                                <img class="img" src={project.thumbnail.src} alt={project.thumbnail.alt} width={692} height={903} loading="lazy" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div class="home__project-name">
                <div class="fs-20 fw-med home__project-pagination">
                    <span class="cl-txt-title">{(activeSlide() + 1).toString().padStart(2, '0')} </span><span class="cl-txt-disable">/ {props.data.length.toString().padStart(2, '0')}</span>
                </div>
                <div class="grid-1-1">
                    <For each={props.data}>
                        {(project) => (
                            <h4 class="heading h5 fw-med upper cl-txt-title home__project-name-txt" >{project.title}</h4>
                        )}
                    </For>
                </div>
            </div>
            <div class="home__project-thumbnail" data-cursor-text="View">
                <div class="home__project-thumbnail-wrap">
                    <swiper-container class='swiper-container' {...setupSwiper}>
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
                </div>
                {/* {props.blur} */}
            </div>
            <div class="home__project-sub-info">
                <div class="home__project-year">
                    <p class="cl-txt-desc fw-med home__project-label">Year</p>
                    <div class="grid-1-1">
                        <For each={props.data}>
                            {(project) => (
                                <div class="heading h5 fw-med cl-txt-title home__project-year-txt">{project.year}</div>
                            )}
                        </For>
                    </div>
                </div>
                <div class="home__project-role">
                    <p class="cl-txt-desc fw-med home__project-label">Role</p>
                    <div class="home__project-role-listing">
                        <div class="grid-1-1">
                            <For each={props.data}>
                                {(project) => (
                                    <div class="home__project-role-listing-inner">
                                        <For each={project.role}>
                                            {(role) => <p class="fs-20 cl-txt-sub">{role}</p>}
                                        </For>
                                    </div>
                                )}
                            </For>
                        </div>
                        {/* <For each={props.data[2].role}>
                            {(role) => <p class="fs-20 cl-txt-sub">{role}</p>}
                        </For> */}
                    </div>
                </div>
            </div>
            <div class="home__project-desc">
                <p class="cl-txt-desc fw-med home__project-label">Description</p>
                <div class="grid-1-1">
                    <For each={props.data}>
                        {(project) => (
                            <p class="fs-20 cl-txt-sub home__project-desc-txt">{project.desc}</p>
                        )}
                    </For>
                </div>
                <a href={props.data[activeSlide()].link} class="cl-txt-orange arrow-hover home__project-link">
                    <span class="txt-link fs-20 cl-txt-orange">All projects</span>
                    {props.arrows}
                </a>
            </div>
        </div>
    )
}

export default ProjectListing;