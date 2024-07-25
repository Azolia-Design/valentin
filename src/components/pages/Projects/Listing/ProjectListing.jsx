import { createSignal, onMount } from "solid-js";
import Swiper from 'swiper';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { getLenis } from "~/components/core/lenis";
import SplitType from "split-type";

const ProjectListing = (props) => {
    let swiperRef;
    const [index, setIndex] = createSignal({ curr: 0, prev: -1 });

    const handleActive = (idx) => {
        if (idx === index().curr) return;
        setIndex({ curr: idx, prev: index().curr });
    }

    let allSplitText = [];
    let elements = [
        { selector: '.project__name' },
        { selector: '.project__role-listing', options: { duration: 1 } },
        { selector: '.project__services-listing', options: { duration: 1 } },
        { selector: '.project__selling-listing', options: { duration: 1 } }
        // { selector: '.home__project-year-txt', splitBy: 'chars', options: { duration: .6 } },
        // { selector: '.home__project-desc-txt', splitBy: 'words', options: { duration: 1, stagger: .02 } },
        // { selector: '.home__project-role-listing-inner', splitBy: 'words', options: { duration: 1, stagger: .02 } }
    ]

    onMount(() => {
        if (!swiperRef) return;
        gsap.registerPlugin(ScrollTrigger);

        gsap.set('.projects__listing', { height: `${(props.data.length + 1) * 100}vh` })

        const numberOfBreakPoints = props.data.length;
        const step = 1 / numberOfBreakPoints;
        const halfStep = step / 2;
        const breakPoints = Array.from({ length: numberOfBreakPoints + 1 }, (_, index) => parseFloat((index * step).toPrecision(2)));

        const onUpdateProgress = (progress) => {
            for (let i = 0; i < breakPoints.length - 1; i++) {
                const startPoint = breakPoints[i];
                const midPoint = startPoint + halfStep;
                const endPoint = breakPoints[i + 1];

                if (progress >= startPoint && progress < midPoint) {
                    handleActive(i);
                } else if (progress >= midPoint && progress < endPoint) {
                    let nextIndex = i + 1;
                    if (nextIndex >= props.data.length) {
                        nextIndex = 0; // Loop back to 0
                    }
                    handleActive(nextIndex);
                }
            }
        };

        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.projects__listing',
                start: 'top top',
                end: 'bottom bottom',
                scrub: true,
                onUpdate(self) {
                    onUpdateProgress(self.progress);
                },
                onComplete: () => {
                    console.log("donme")
                }
            },
            defaults: {
                ease: 'none'
            },
        })
        let thumbnails = document.querySelectorAll('.project__thumbnail-img');

        thumbnails.forEach((thumbnail, idx) => {
            tl
                .set(thumbnails[idx], { transformOrigin: 'top left', duration: 0 })
                .fromTo(thumbnails[idx], {
                    scale: 1,
                    transformOrigin: 'top left'
                    // '--clipping': '100%',
                }, {
                    scale: 0,
                    duration: 1
                    // '--clipping': '0%',
                })
                .fromTo(thumbnails[idx === props.data.length - 1 ? 0 : idx + 1], {
                    scale: 0,
                    transformOrigin: 'top left'
                    // '--clipping': '0%',
                }, {
                    scale: 1,
                    transformOrigin: 'bottom right',
                    duration: 1
                    // '--clipping': '100%',
                }, "<=0")
        })

        gsap.set(thumbnails, {
            scale: (i) => i !== 0 ? 0 : 1,
            transformOrigin: (i) => i !== 0 ? 'bottom right' : 'top left',
            zIndex: (i) => props.data.length - i
        });

        elements.forEach((el) => {
            let elementSplitText = []; // Declare a new sub-array for each element

            document.querySelectorAll(el.selector).forEach((text, idx) => {
                let subSplitText = [];

                if (text.querySelectorAll('p').length > 0) {
                    text.querySelectorAll('p').forEach((paragraph) => {
                        let splittext = new SplitType(paragraph, { types: 'lines, words', lineClass: 'split-line' });
                        gsap.set(splittext.words, { autoAlpha: 0, willChange: 'transform, opacity'});
                        subSplitText.push(splittext);
                    });
                } else {
                    let splittext = new SplitType(text, { types: 'lines, words', lineClass: 'split-line' });
                    gsap.set(splittext.words, { autoAlpha: 0, willChange: 'transform, opacity' });
                    subSplitText.push(splittext);
                }

                elementSplitText.push(subSplitText); // Push to the sub-array
            });

            allSplitText.push(elementSplitText); // Push the sub-array to the main array
        });
        console.log(allSplitText)

        onChangeIndex(0);
        document.querySelector('.projects__listing-main').classList.remove('animating');
    })

    const animationsText = (direction) => {
        let yOffSet = {
            out: direction > 0 ? -100 : 100,
            in: direction > 0 ? 100 : -100
        }

        elements.forEach((el, idx) => {
            let tl = gsap.timeline({});

            if (direction !== 0) {
                if (allSplitText[idx][index().curr].length !== 1) {
                    allSplitText[idx][index().curr].forEach((splittext) => {
                        let tlChild = gsap.timeline({});
                        tlChild.set(splittext.words, { yPercent: 0, autoAlpha: 1 })
                            .to(splittext.words, { yPercent: yOffSet.out, autoAlpha: 0, duration: 0.3, ease: 'power2.inOut', ...el.options }, '<=0');
                    });
                } else {
                    tl
                        .set(allSplitText[idx][index().curr][0].words, { yPercent: 0, autoAlpha: 1 })
                        .to(allSplitText[idx][index().curr][0].words, { yPercent: yOffSet.out, autoAlpha: 0, duration: 0.6, ease: 'power2.inOut', ...el.options }, '<=0');
                }
            }

            let nextValue = index().curr + direction < 0 ? props.data.length - 1 : index().curr + direction > props.data.length - 1 ? 0 : index().curr + direction;
            if (allSplitText[idx][nextValue].length !== 1) {
                allSplitText[idx][nextValue].forEach((splittext) => {
                    let tlChild = gsap.timeline({});
                    tlChild
                        .set(splittext.words, { yPercent: yOffSet.in, autoAlpha: 0 })
                        .to(splittext.words, { yPercent: 0, autoAlpha: 1, duration: 0.3, ease: 'power2.inOut', ...el.options }, '<=0');
                    });
            } else {
                tl
                    .set(allSplitText[idx][nextValue][0].words, { yPercent: yOffSet.in, autoAlpha: 0 }, "-=.6")
                    .to(allSplitText[idx][nextValue][0].words, { yPercent: 0, autoAlpha: 1, duration: 0.6, ease: 'power2.inOut', ...el.options }, "<=0");
            }
        })
    }

    const onChangeIndex = (direction) => {
        if (document.querySelector('.projects__listing-main').classList.contains('animating')) return;
        // getLenis().start();

        document.querySelector('.projects__listing-main').classList.add('animating');

        const rect = document.querySelector('.projects__listing').getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        getLenis().scrollTo(rect.top + scrollTop + (window.innerHeight * (index().curr + direction)), {
            duration: 1.5, onComplete() {
                document.querySelector('.projects__listing-main').classList.remove('animating');
                // getLenis().stop();
            }
        })
        animationsText(direction);
    }

    return (
        <div class="projects__sticky">
            <div class="container">
                <div class="projects__listing-main grid" >
                    <div class="grid-1-1">
                        <For each={props.data}>
                            {(project) => (
                                <h2 className="heading h3 fw-semi cl-txt-title upper project__name" innerHTML={project.title}></h2>
                            )}
                        </For>
                    </div>
                    <p class="project__desc">{props.data[index().curr].desc}</p>
                    <div class="project__info">
                        <div class="project__role">
                            <p class="fw-med cl-txt-desc project-item-label">Role</p>
                            <div class="grid-1-1">
                                <For each={props.data}>
                                    {(project) => (
                                        <div class="project__role-listing">
                                            <For each={project.roles}>
                                                {(role) => <p class="cl-txt-sub">{role}</p>}
                                            </For>
                                        </div>
                                    )}
                                </For>
                            </div>
                        </div>
                        <div class="project__services">
                            <p class="fw-med cl-txt-desc project-item-label">Services</p>
                            <div class="grid-1-1">
                                <For each={props.data}>
                                    {(project) => (
                                        <div class="project__services-listing">
                                            <For each={project.services}>
                                                {(service) => <p class="cl-txt-sub">{service}</p>}
                                            </For>
                                        </div>
                                    )}
                                </For>
                            </div>
                        </div>
                        <div class="project__selling">
                            <p class="fw-med cl-txt-desc project-item-label">Selling points</p>
                            <div class="grid-1-1">
                                <For each={props.data}>
                                    {(project) => (
                                        <div class="project__selling-listing">
                                            <For each={project.selling_points}>
                                                {(points) => <p class="cl-txt-sub">{points}</p>}
                                            </For>
                                        </div>
                                    )}
                                </For>
                            </div>
                        </div>
                    </div>
                    <p class="fs-20 fw-med cl-txt-sub project__year">© {props.data[index().curr].year}</p>
                    <div class="project__thumbnail-wrap">
                        <div className="project__thumbnail" ref={swiperRef}>
                            <div className="project__thumbnail-listing grid-1-1">
                                {props.data.map(({ thumbnail }, idx) => (
                                    <a href="#" class={`project__thumbnail-img${idx === index().curr ? ' active' : ''}`} data-cursor-text="View">
                                        <img class="img img-fill" src={thumbnail.src} alt={thumbnail.alt} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="projects__navigation">
                <div class="projects__navigation-area next" onClick={() => onChangeIndex(1)} data-cursor="-nav" data-cursor-img={props.arrows.next.src}></div>
                <div class="projects__navigation-area prev" onClick={() => onChangeIndex(-1)} data-cursor="-nav" data-cursor-img={props.arrows.prev.src}></div>
            </div>
        </div>
    )
}
export default ProjectListing;