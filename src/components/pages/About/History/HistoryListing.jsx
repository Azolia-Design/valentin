import { For, onCleanup, onMount } from "solid-js";
import { cvUnit } from "~/utils/number";
import Swiper from 'swiper';

const HistoryListing = (props) => {
    let swiperRef;
    onMount(() => {
        if (!swiperRef) return;
        let swiperEl = new Swiper(swiperRef, {
            slidesPerView: 3,
            spaceBetween: cvUnit(20, 'rem'),
        })
    })
    return (
        <div ref={swiperRef} class="swiper about__history-listing" data-cursor-text="Drag" data-cursor="-stroke">
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