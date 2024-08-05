import { register } from 'swiper/element/bundle';
import { For, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import gsap from 'gsap';
import SplitType from 'split-type';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { getLenis } from '~/components/core/lenis';
import Truncate from '~/components/common/TruncateText';
import BreakMultipleLine from '~/components/common/BreakMultipleLine.astro';


const ProjectListing = (props) => {
    let containerRef;
    const [activeSlide, setActiveSlide] = createSignal(0);
    const [index, setIndex] = createSignal({ curr: 0, prev: -1 });
    // const [swiper, setSwiper] = createSignal(null);

    // const setupSwiper = {
    //     loop: true,
	// 	slidesPerView: 1,
	// 	spaceBetween: 0,
    //     effect: "fade",
    //     onSwiperInit: (e) => {
    //         setSwiper(e.detail[0]);
    //         requestAnimationFrame(() => handleActiveSlide(0, true));
    //     },
    //     onSwiperSlideChange: ({ detail }) => {
    //         // setActiveSlide(detail[0].activeIndex);
	// 	}
    // }

    let allSplitText = [];
    let elements = [
        { selector: '.home__project-name-txt' },
        { selector: '.home__project-pagination-txt' },
        { selector: '.home__project-year-txt', optionsIn: { duration: 1 }, optionsOut: { duration: 1 }},
        { selector: '.home__project-desc-txt', optionsIn: { duration: 1 }, optionsOut: { duration: 1 } },
        { selector: '.home__project-role-listing-inner', isArray: true, optionsIn: { duration: 1, delay: .2 }, optionsOut: { duration: 1 } }
    ]

    const numberOfBreakPoints = props.data.length;
    const step = 1 / numberOfBreakPoints;
    const halfStep = step / 2;
    const breakPoints = Array.from({ length: numberOfBreakPoints + 1 }, (_, index) => parseFloat((index * step).toPrecision(2)));
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

    const onUpdateProgress = (progress) => {
        for (let i = 0; i < breakPoints.length - 1; i++) {
            // const startPoint = breakPoints[i];
            // const midPoint = startPoint + halfStep;
            // const endPoint = breakPoints[i + 1];

            const startPoint = breakPoints[i];
            const endPoint = breakPoints[i + 1];

            if (progress >= startPoint && progress < endPoint) {
                let idx = Math.floor(progress * props.data.length)
                onChangeIndex(idx);
            }
        }
    };

    onMount(() => {
        if (!containerRef) return;
        register();

        gsap.registerPlugin(ScrollTrigger);


        let thumbTlOptions = {
            trigger: window.innerWidth > 991 ? '.home__project-main' : '.home__project-wrap',
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
            markers: true
        }
        let tlTrans = gsap.timeline({
            scrollTrigger: {
                ...thumbTlOptions,
                onUpdate(self) {
                    onUpdateProgress(self.progress);
                },
            },
            defaults: {
                ease: 'none'
            },
        })

        let tlScale = gsap.timeline({
            scrollTrigger: thumbTlOptions,
            defaults: {
                ease: 'power2.inOut'
            },
        })

        let thumbnails = document.querySelectorAll('.home__project-thumbnail-img');

        thumbnails.forEach((thumbnail, idx) => {
            if (idx + 1 < props.data.length) {
                tlTrans
                    .set(thumbnails[idx], {
                        '--clipOut': '100%',
                        '--clipIn': '0%',
                        '--imgTrans': '0%',
                        '--imgDirection': '-1',
                        duration: 0
                    })
                    .fromTo(thumbnails[idx], {
                        '--clipOut': '100%',
                        '--clipIn': '0%',
                        '--imgTrans': '0%',
                        '--imgDirection': '-1',
                    }, {
                        '--clipOut': '0%',
                        '--clipIn': '0%',
                        '--imgTrans': '100%',
                        '--imgDirection': '-1',
                        duration: 1,
                    }, '<=0')
                    .fromTo(thumbnails[idx + 1], {
                        '--clipIn': '100%',
                        '--clipOut': '100%',
                        '--imgTrans': '100%',
                        '--imgDirection': '1',
                    }, {
                        '--clipIn': '0%',
                        '--clipOut': '100%',
                        '--imgTrans': '0%',
                        '--imgDirection': '1',
                        duration: 1
                    }, "<=0")

                tlScale
                    .set(thumbnails[idx], {
                        '--imgScale': '1',
                        duration: 0
                    })
                    .fromTo(thumbnails[idx], {
                        '--imgScale': '1',
                    }, {
                        '--imgScale': '.6',
                        duration: 1,
                    }, '<=0')
                    .fromTo(thumbnails[idx + 1], {
                        '--imgScale': '1.4',
                    }, {
                        '--imgScale': '1',
                        duration: 1
                        }, "<=0")
            }
        })

        gsap.set(thumbnails, {
            zIndex: (i) => props.data.length - i
        });


        elements.forEach((el) => {
            let elementSplitText = []; // Declare a new sub-array for each element

            containerRef.querySelectorAll(el.selector).forEach((text, idx) => {
                let subSplitText = [];

                if (text.querySelectorAll('p').length > 0) {
                    text.querySelectorAll('p').forEach((paragraph) => {
                        let splittext = new SplitType(paragraph, { types: 'lines, words', lineClass: 'split-line' });
                        gsap.set(splittext.words, { autoAlpha: 0 });
                        subSplitText.push(splittext);
                    });
                } else {
                    let splittext = new SplitType(text, { types: 'lines, words', lineClass: 'split-line' });
                    gsap.set(splittext.words, { autoAlpha: 0 });
                    subSplitText.push(splittext);
                }

                elementSplitText.push(subSplitText); // Push to the sub-array
            });

            allSplitText.push(elementSplitText); // Push the sub-array to the main array

        });

        animationsText(0)

        onCleanup(() => {
            tlTrans.kill()
            tlScale.kill()
        });
    });

    const animationsText = (newValue) => {
        let yOffSet = {
            out: newValue - index().curr > 0 ? -70 : 70,
            in:  newValue - index().curr > 0 ? 70 : -70
        }
        elements.forEach((el, idx) => {
            let tl = gsap.timeline({});

            if (el.isArray) {
                allSplitText[idx][index().curr].forEach((splittext) => {
                    let tlChild = gsap.timeline({});
                    tlChild.set(splittext.words, { yPercent: 0, autoAlpha: 1 })
                        .to(splittext.words, { yPercent: yOffSet.out, autoAlpha: 0, duration: 0.3, ease: 'power2.inOut', ...el.optionsOut }, '<=0');
                });
            } else {
                tl
                    .set(allSplitText[idx][index().curr][0].words, { yPercent: 0, autoAlpha: 1 })
                    .to(allSplitText[idx][index().curr][0].words, { yPercent: yOffSet.out, autoAlpha: 0, duration: 0.8, ease: 'power2.inOut', ...el.optionsOut }, '<=0');
            }

            if (el.isArray) {
                allSplitText[idx][newValue].forEach((splittext) => {
                    let tlChild = gsap.timeline({});
                    tlChild
                        .set(splittext.words, { yPercent: yOffSet.in, autoAlpha: 0 })
                        .to(splittext.words, { yPercent: 0, autoAlpha: 1, duration: 0.3, ease: 'power2.inOut', ...el.optionsIn }, '<=0');
                    });
            } else {
                tl
                    .set(allSplitText[idx][newValue][0].words, { yPercent: yOffSet.in, autoAlpha: 0 }, `-=${newValue - index().curr === 0 ? 0 : el.optionsIn?.duration || .8}`)
                    .to(allSplitText[idx][newValue][0].words, { yPercent: 0, autoAlpha: 1, duration: 0.8, ease: 'power2.inOut', delay: .2, ...el.optionsIn }, "<=0");
            }
        })
    }


    const onChangeIndex = (newIndex) => {
        if (newIndex !== index().curr && newIndex < props.data.length) {
            animationsText(newIndex);
            setIndex({ curr: newIndex, prev: index().curr });
        };
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
                        class={`home__project-slide-item-wrap${idx == index().curr ? ' active' : ''}`}>
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
                <div class="home__project-name-wrap">
                    <div class="fs-20 fw-med home__project-pagination">
                        <div class="grid-1-1">
                            {props.data.map((_, idx) => (
                                <span class="cl-txt-title home__project-pagination-txt">{(idx + 1).toString().padStart(2, '0')} </span>
                            ))}
                        </div>
                        <span class="cl-txt-disable">/ {props.data.length.toString().padStart(2, '0')}</span>
                    </div>
                    <div class="grid-1-1">
                        <For each={props.data}>
                            {(project) => (
                                <h4 class="heading h5 fw-med upper cl-txt-title home__project-name-txt" innerHTML={project.title}/>
                            )}
                        </For>
                    </div>
                </div>
                <div class="home__project-year mod-tablet">
                    <p class="cl-txt-desc fw-med home__project-label">Year</p>
                    <div class="grid-1-1">
                        <For each={props.data}>
                            {(project) => (
                                <div class="heading h5 fw-med cl-txt-title home__project-year-txt">{project.year}</div>
                            )}
                        </For>
                    </div>
                </div>
            </div>
            <div class="home__project-thumbnail">
                <div class="home__project-thumbnail-wrap">
                    <div class='home__project-thumbnail-listing grid-1-1'>
                        {props.data.map(({ thumbnail, link }, idx) => (
                            <a href={link} class="home__project-thumbnail-img" data-cursor-text="View">
                                <div class="home__project-thumbnail-img-wrap">
                                    <div class="home__project-thumbnail-img-inner">
                                        <img class="img img-fill" src={thumbnail.src} alt={thumbnail.alt} />
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
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
                                        <For each={project.roles}>
                                            {(role) => <p class="fs-20 cl-txt-sub">{role}</p>}
                                        </For>
                                    </div>
                                )}
                            </For>
                        </div>
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
                <a href='/projects' class="cl-txt-orange arrow-hover home__project-link">
                    <span class="txt-link fs-20 cl-txt-orange">All projects</span>
                    {props.arrows}
                </a>
            </div>
        </div>
    )
}

export default ProjectListing;