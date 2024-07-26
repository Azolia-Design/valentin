import { createSignal, onCleanup, onMount } from "solid-js";
import gsap from 'gsap';
import SplitType from "split-type";

const ProjectListing = (props) => {
    let swiperRef;
    const [index, setIndex] = createSignal({ curr: 0, prev: -1 });

    let allSplitText = [];
    let elements = [
        { selector: '.project__name-txt' },
        { selector: '.project__desc-txt', options: { duration: 1 } },
        { selector: '.project__year-txt' },
        { selector: '.project__role-listing', options: { duration: 1 } },
        { selector: '.project__services-listing', options: { duration: 1 } },
        { selector: '.project__selling-listing', options: { duration: 1 } }
    ]

    onMount(() => {
        gsap.set('.project__thumbnail-img', {
            scale: (i) => i !== 0 ? 0 : 1,
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

        onChangeIndex(0);
        document.querySelector('.projects__listing-main').classList.remove('animating');

        onCleanup(() => elements.forEach(({ selector }) => SplitType.revert(selector)));
    })

    const animationsText = (direction, nextValue) => {
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
                        .to(allSplitText[idx][index().curr][0].words, { yPercent: yOffSet.out, autoAlpha: 0, duration: 0.8, ease: 'power2.inOut', ...el.options }, '<=0');
                }
            }

            if (allSplitText[idx][nextValue].length !== 1) {
                allSplitText[idx][nextValue].forEach((splittext) => {
                    let tlChild = gsap.timeline({});
                    tlChild
                        .set(splittext.words, { yPercent: yOffSet.in, autoAlpha: 0 })
                        .to(splittext.words, { yPercent: 0, autoAlpha: 1, duration: 0.3, ease: 'power2.inOut', ...el.options }, '<=0');
                    });
            } else {
                tl
                    .set(allSplitText[idx][nextValue][0].words, { yPercent: yOffSet.in, autoAlpha: 0 }, `-=${el.options?.duration || .8}`)
                    .to(allSplitText[idx][nextValue][0].words, { yPercent: 0, autoAlpha: 1, duration: 0.8, ease: 'power2.inOut', ...el.options }, "<=0");
            }
        })
    }

    const animationThumbnail = (direction, nextValue) => {
        if (direction === 0) return;
        let thumbnails = document.querySelectorAll('.project__thumbnail-img');

        let transformOrigin = {
            out: direction > 0 ? 'top left' : 'bottom right',
            in: direction > 0 ? 'bottom right' : 'top left'
        }

        let tl = gsap.timeline({})
        tl
            .set(thumbnails[index().curr], { transformOrigin: transformOrigin.out, duration: 0 })
            .fromTo(thumbnails[index().curr], {
                scale: 1,
                transformOrigin: transformOrigin.out,

                // '--clipping': '100%',
            }, {
                scale: 0,
                duration: 1.1,
                ease: 'power2.inOut'
                // '--clipping': '0%',
            })
            .fromTo(thumbnails[nextValue], {
                scale: 0,
                transformOrigin: transformOrigin.out
                // '--clipping': '0%',
            }, {
                scale: 1,
                transformOrigin: transformOrigin.in,
                duration: 1.1,
                ease: 'power2.inOut',
                onComplete() {
                    document.querySelector('.projects__listing-main').classList.remove('animating');
                }
                // '--clipping': '100%',
            }, "<=0")
    }

    const onChangeIndex = (direction) => {
        if (document.querySelector('.projects__listing-main').classList.contains('animating')) return;

        document.querySelector('.projects__listing-main').classList.add('animating');

        let nextValue = index().curr + direction < 0 ? props.data.length - 1 : index().curr + direction > props.data.length - 1 ? 0 : index().curr + direction;
        animationsText(direction, nextValue);
        animationThumbnail(direction, nextValue);
        setIndex({ curr: nextValue, prev: index().curr });
    }

    return (
        <div class="projects__sticky">
            <div class="container">
                <div class="projects__listing-main grid" >
                    <div class="project__name">
                        <div class="grid-1-1">
                            {props.data.map(({ title }, idx) => <h2 className={`heading h3 fw-semi cl-txt-title upper project__name-txt${idx === index().curr ? ' active' : ''}`} innerHTML={title}></h2>)}
                        </div>
                    </div>
                    <div class="project__desc">
                        <div class="grid-1-1">
                            {props.data.map(({ desc }, idx) => <p className={`project__desc-txt${idx === index().curr ? ' active' : ''}`}>{desc}</p>)}
                        </div>
                    </div>
                    <div class="project__info">
                        <div class="project__role">
                            <p class="fw-med cl-txt-desc project-item-label">Role</p>
                            <div class="grid-1-1">
                                {props.data.map(({ roles }, idx) => (
                                    <div class={`project__role-listing${idx === index().curr ? ' active' : ''}`}>
                                        <For each={roles}>
                                            {(role) => <p class="cl-txt-sub">{role}</p>}
                                        </For>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div class="project__services">
                            <p class="fw-med cl-txt-desc project-item-label">Services</p>
                            <div class="grid-1-1">
                                {props.data.map(({ services }, idx) => (
                                    <div class={`project__services-listing${idx === index().curr ? ' active' : ''}`}>
                                        <For each={services}>
                                            {(service) => <p class="cl-txt-sub">{service}</p>}
                                        </For>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div class="project__selling">
                            <p class="fw-med cl-txt-desc project-item-label">Selling points</p>
                            <div class="grid-1-1">
                                {props.data.map(({ selling_points }, idx) => (
                                    <div class={`project__selling-listing${idx === index().curr ? ' active' : ''}`}>
                                        <For each={selling_points}>
                                            {(points) => <p class="cl-txt-sub">{points}</p>}
                                        </For>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div class="fs-20 fw-med cl-txt-sub project__year">© <div class="grid-1-1">{props.data.map(({ year }, idx) => <span class="project__year-txt">{year}</span>)}</div></div>
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
                    <div class="project__pagination">
                        <div class="project__pagination-main">
                            {props.data.map(({ thumbnail }, idx) => (
                                <div class="project__pagination-item-wrap">
                                    <div class="project__pagination-item">
                                        <div class="project__pagination-item-progress">
                                            <div className="project__pagination-item-progress-inner"></div>
                                        </div>
                                        <div class="project__pagination-item-img">
                                            <img class="img" src={thumbnail.src} alt={thumbnail.alt} width={66} height={94} loading="lazy" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div class="fs-20 fw-bold project__pagination-number">
                            <span class="line"></span>
                            <span class="cl-txt-title">{(index().curr + 1).toString().padStart(2, '0')} </span><span class="cl-txt-disable">/ {props.data.length.toString().padStart(2, '0')}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="projects__navigation">
                <div class="projects__navigation-area prev" onClick={() => onChangeIndex(-1)} data-cursor="-nav" data-cursor-img={props.arrows.prev.src}></div>
                <div class="projects__navigation-area next" onClick={() => onChangeIndex(1)} data-cursor="-nav" data-cursor-img={props.arrows.next.src}></div>
            </div>
        </div>
    )
}
export default ProjectListing;