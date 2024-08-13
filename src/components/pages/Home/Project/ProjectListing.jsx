import { For, Show, createSignal, onCleanup, onMount } from "solid-js";
import gsap from 'gsap';
import SplitType from 'split-type';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { getLenis } from '~/components/core/lenis';
import Truncate from '~/components/common/TruncateText';
import BreakMultipleLine from '~/components/common/BreakMultipleLine.astro';
import useDimension from '~/components/hooks/useDimension';
import { initScrollTrigger } from '~/components/core/scrollTrigger';

const ProjectListing = (props) => {
    let containerRef;
    const [index, setIndex] = createSignal({ curr: 0, prev: -1 });
    const { isDesktop, isTablet, isMobile } = useDimension();

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
                changeIndexOnScroll(idx);
            }
        }
    };

    onMount(() => {
        if (!containerRef) return;
        initScrollTrigger();

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

        let thumbTlOptions = {
            trigger: window.innerWidth > 991 ? '.home__project-main' : '.home__project-wrap',
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
        }

        let thumbnails = document.querySelectorAll('.home__project-thumbnail-img');
        if (window.innerWidth > 767) {
            let tlTrans = gsap.timeline({
                scrollTrigger: {
                    ...thumbTlOptions,
                    onUpdate(self) {
                        onUpdateProgress(self.progress);
                    },
                    onRefreshInit(self) {
                        requestAnimationFrame(() => {
                            let idx = Math.floor(self.progress * props.data.length)
                            if (idx === 0) {
                                animationText(idx)
                            }
                            else {
                                changeIndexOnScroll(idx === props.data.length ? idx - 1 : idx);
                            }
                        })
                    }
                },
                defaults: {
                    ease: 'none'
                },
                // pause: window.innerWidth > 991 ? false : true
            })

            let tlScale = gsap.timeline({
                scrollTrigger: thumbTlOptions,
                defaults: {
                    ease: 'power2.inOut'
                },
                // pause: window.innerWidth > 991 ? false : true
            })
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
            onCleanup(() => {
                tlTrans.kill();
                tlScale.kill();
            });
        }
        else {
            gsap.set(thumbnails, {
                '--clipOut': (i) => i === 0 ? '100%' : '0%',
                '--clipIn': '0%',
                '--imgTrans': '0%',
                '--imgDirection': '-1'
            });
            animationText(0);
        }

        gsap.set(thumbnails, {
            zIndex: (i) => props.data.length - i
        });

    });

    const animationText = (newValue) => {
        let yOffSet = {
            out: newValue - index().curr > 0 ? -70 : 70,
            in:  newValue - index().curr > 0 ? 70 : -70
        }
        elements.forEach((el, idx) => {
            let tl = gsap.timeline({});

            if ((newValue - index().curr) !== 0) {
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

    const animationThumbnail = (newValue) => {
        let direction = newValue - index().curr;

        let thumbnails = document.querySelectorAll('.home__project-thumbnail-img');

        let tlTrans = gsap.timeline({
            defaults: {
                ease: 'power3.inOut'
            },
        })
        let tlScale = gsap.timeline({
            defaults: {
                ease: 'power2.inOut'
            },
        })
        tlTrans
            .set(thumbnails[index().curr], {
                '--clipOut': '100%',
                '--clipIn': '0%',
                '--imgTrans': '0%',
                '--imgDirection': '-1',
                duration: 0
            })
            .fromTo(thumbnails[index().curr], {
                '--clipOut': '100%',
                '--clipIn': '0%',
                '--imgTrans': '0%',
                '--imgDirection': '-1',
            }, {
                '--clipOut': direction > 0 ? '0%' : '100%',
                '--clipIn': direction > 0 ? '0%' : '100%',
                '--imgTrans': direction > 0 ? '100%' : '-100%',
                '--imgDirection': '-1',
                duration: 1,
                ease: 'power2.inOut'
            })
            .set(thumbnails[newValue], {
                '--clipIn': direction > 0 ? '100%' : '0%',
                '--clipOut': direction > 0 ? '100%' : '0%',
                '--imgTrans': direction > 0 ? '100%' : '-100%',
                '--imgDirection': '1',
                duration: 0
            }, "<=0")
            .fromTo(thumbnails[newValue], {
                '--clipIn': direction > 0 ? '100%' : '0%',
                '--clipOut': direction > 0 ? '100%' : '0%',
                '--imgTrans': direction > 0 ? '100%' : '-100%',
                '--imgDirection': '1'
            }, {
                '--clipIn': '0%',
                '--clipOut': '100%',
                '--imgTrans': '0%',
                '--imgDirection': '1',
                duration: 1,
                ease: 'power2.inOut',
                onComplete() {
                    document.querySelector('.home__project-listing').classList.remove('animating');
                }
            }, "<=0")

        tlScale
            .set(thumbnails[index().curr], {
                '--imgScale': '1',
                duration: 0
            })
            .fromTo(thumbnails[index().curr], {
                '--imgScale': '1',
            }, {
                '--imgScale': '.6',
                duration: 1,
            })
            .set(thumbnails[newValue], {
                '--imgScale': '1.4',
                duration: 0
            }, "<=0")
            .fromTo(thumbnails[newValue], {
                '--imgScale': '1.4',
            }, {
                '--imgScale': '1',
                duration: 1,
            }, "<=0")
    }

    const changeIndexOnClick = (direction) => {
        if (document.querySelector('.home__project-listing').classList.contains('animating')) return;
        let newIndex = index().curr + direction;
        if (newIndex < 0 || newIndex > props.data.length - 1) return;

        document.querySelector('.home__project-listing').classList.add('animating');
        animationText(newIndex);
        animationThumbnail(newIndex);
        setIndex({ curr: newIndex, prev: index().curr });
    }

    const changeIndexOnScroll = (newIndex) => {
        if (newIndex !== index().curr && newIndex < props.data.length) {
            animationText(newIndex);
            setIndex({ curr: newIndex, prev: index().curr });
        };
    }

    return (
        <div ref={containerRef} class="home__project-listing grid">
            <div class="home__project-slide">
                {props.slides}
            </div>
            <div class="home__project-name">
                <div class="home__project-name-wrap">
                    <div class="fs-20 fw-med home__project-pagination">
                        <div class="grid-1-1">
                            {props.data.map((_, idx) => (
                                <span class="cl-txt-title home__project-pagination-txt">{(idx + 1).toString().padStart(2, '0')} </span>
                            ))}
                        </div>
                        <span class="cl-txt-desc">/ {props.data.length.toString().padStart(2, '0')}</span>
                    </div>
                    <div class="grid-1-1">
                        <For each={props.data}>
                            {(project) => (
                                <h4 class="heading h5 fw-med upper cl-txt-title home__project-name-txt" innerHTML={project.title}/>
                            )}
                        </For>
                    </div>
                </div>
                <Show when={isTablet()}>
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
                </Show>
            </div>
            <div class="home__project-thumbnail">
                <div class="home__project-thumbnail-wrap">
                    {props.thumbnails}
                </div>
            </div>
            <div class="home__project-sub-info">
                <Show when={[isDesktop(), isMobile()]}>
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
                </Show>
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
            <div class="home__project-navigation">
                <div className={`home__project-navigation-arrow prev${index().curr === 0 ? ' disable' : ''}`} onClick={() => changeIndexOnClick(-1)}>
                    <div class="ic ic-20">
                        <svg width="100%" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.6 8.00003H14M6.19998 3.80005L2 8.00003L6.19998 12.2" stroke="currentColor" stroke-width="1.13137" stroke-miterlimit="10" stroke-linecap="square"/>
                        </svg>
                    </div>
                </div>
                <div className={`home__project-navigation-arrow next${index().curr === props.data.length - 1 ? ' disable' : ''}`} onClick={() => changeIndexOnClick(1)}>
                    <div className="ic ic-20">
                        <svg width="100%" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.4 8.00003H2M9.79997 3.80005L14 8.00003L9.79997 12.2" stroke="currentColor" stroke-width="1.13137" stroke-miterlimit="10" stroke-linecap="square"/>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProjectListing;