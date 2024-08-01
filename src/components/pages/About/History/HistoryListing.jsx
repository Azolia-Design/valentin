import { For, onCleanup, onMount } from "solid-js";
import { lerp, cvUnit, inView } from "~/utils/number";
import Swiper from 'swiper';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { createGlow } from "~/components/core/cursor";

const HistoryListing = (props) => {
    let historiesRef;
    onMount(() => {
        if (!historiesRef) return;
        gsap.registerPlugin(ScrollTrigger);
        // let swiperEl = new Swiper(historiesRef, {
        //     slidesPerView: 3,
        // })

        let itemWidth = document.querySelector('.about__history-item').offsetWidth;
        let distance = (itemWidth * props.data.length) - historiesRef.offsetWidth;

        gsap.set('stick-block', { height: distance * 2 });
        gsap.set('.sc-about__history', { display: 'flex', flexDirection: 'column-reverse' });
        gsap.set('.about__history', { position: 'static' });

        requestAnimationFrame(() => {
            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: '.about__history',
                    start: `bottom-=${cvUnit(100, 'rem')} bottom`,
                    end: `bottom-=${cvUnit(100, 'rem')} top`,
                    scrub: 1.2,
                }
            })

            tl
            .fromTo('.about__history-listing .swiper-wrapper', { x: 0 }, { x: -distance, ease: 'none' });
            requestAnimationFrame(() => {
                gsap.set('.sc-about__history, .about__history', { clearProps: 'all' });
            })
        })

        createGlow();

        let border = document.querySelector('.about__history-body .border-inner');

        const gGetter = (property) => (el) => gsap.getProperty(el, property);
        const gSetter = (property, unit = '') => (el) => gsap.quickSetter(el, property, unit);

        const xGetter = gGetter('x');
        const yGetter = gGetter('y');
        const xSetter = gSetter('x', 'px');
        const ySetter = gSetter('y', 'px');

        const maxXMove = document.querySelector('.about__history-body').offsetWidth / 2;
        const maxYMove = document.querySelector('.about__history-body').offsetHeight / 2;

        const borderMove = () => {
            let targetPos = {
                x: xGetter('.mf-cursor'),
                y: yGetter('.mf-cursor')
            };
            let rect = document.querySelector('.about__history-body').getBoundingClientRect();

            const runBorder = () => {
                let xMove = targetPos.x - (rect.left + maxXMove);
                let yMove = targetPos.y - (rect.top - maxYMove);

                let limitBorderXMove = Math.max(Math.min(xMove, maxXMove * 2), -maxXMove * 2);
                let limitBorderYMove = Math.max(Math.min(yMove, maxYMove), -maxYMove);

                xSetter(border)(lerp(xGetter(border), limitBorderXMove, .55));
                ySetter(border)(lerp(yGetter(border), limitBorderYMove, .55));
            }

            if (inView(document.querySelector('.about__history-body'))) {
                runBorder();
            }
            requestAnimationFrame(borderMove);
        }
        requestAnimationFrame(borderMove);
    })
    return (
        <div ref={historiesRef} class="swiper about__history-listing">
            <div class="swiper-wrapper">
                <For each={props.data.reverse()}>
                    {(item) => (
                        <div class="swiper-slide about__history-item">
                            <span class="line"></span>
                            <div class="about__history-item-content">
                                <div class="about__history-item-position">
                                    <p class="fs-24 fw-med">{item.position.title}</p>
                                    <p class="cl-txt-desc">{item.position.type}</p>
                                </div>
                                <div class="about__history-item-company">
                                    <p class="fw-med">{item.company.name}</p>
                                    <p class="cl-txt-desc">{item.company.location}</p>
                                </div>
                                <div class="about__history-item-period">
                                    <div>
                                        <p class="cl-txt-desc">From</p>
                                        <p class="fs-20 fw-med">{item.period.from}</p>
                                    </div>
                                    <div>
                                        <p class="cl-txt-desc">To</p>
                                        <p class="fs-20 fw-med">{item.period.to}</p>
                                    </div>
                                </div>
                            </div>
                            <ul class="ruler-x">
                                <For each={new Array(13)}>
                                    {(dash) => <li></li>}
                                </For>
                            </ul>
                        </div>
                    )}
                </For>
            </div>
        </div>
    )
}

export default HistoryListing;