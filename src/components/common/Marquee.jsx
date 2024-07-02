import gsap from 'gsap';
import { onMount, onCleanup } from "solid-js";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { getLenis } from '~/components/core/lenis';

const Marquee = (props) => {
    let marqueeRef;
    onMount(() => {
        if (!marqueeRef) return;
        gsap.registerPlugin(ScrollTrigger);

        const q = gsap.utils.selector(marqueeRef);
        const DOM = {
            wrap: q('.marquee'),
            list: q('.marquee-inner'),
            item: q('.marquee-inner-item')
        }
        const marqueeGS = (data) => {
            const { duration, start, stopWhenEnter } = data;
            const direction = {
                right: "-100",
                left: "100"
            };

            let isHover = false;

            let tlMarquee = gsap.timeline({
                repeat: -1,
                // onReverseComplete() {
                //     this.totalTime(this.rawTime() + this.duration() * 10);
                // },
                onUpdate: () => {
                    if (!isHover) {
                        let tlDir = getLenis().direction >= 0 ? 1 : -1;
                        gsap.to(tlMarquee, {timeScale: tlDir * Math.min(Math.max(getLenis().velocity/2, 1), 4), duration: .1, ease: 'none' })
                    }
                }
            })

            let cloneAmount = 2;
            const cloneAdditional = Math.floor(window.innerWidth / DOM.item.offsetWidth);
            if (cloneAdditional >= 1) {
                cloneAmount += cloneAdditional;
            }

            new Array(cloneAmount).fill().forEach((_, index) => {
                let itemClone = DOM.item[0].cloneNode(true);
                DOM.list[0].append(itemClone);
            })

            tlMarquee.fromTo(DOM.wrap[0], { xPercent: '0' }, { xPercent: direction[start || "left"], duration: DOM.wrap[0].offsetWidth / duration, repeat: -1, ease: 'none' })

            if (stopWhenEnter) {
                DOM.wrap[0].addEventListener("pointerenter", (event) => {
                    isHover = true;
                    gsap.to(tlMarquee, { timeScale: 0, ease: 'power1.inOut', duration: 0.3, overwrite: true });
                });
                DOM.wrap[0].addEventListener("pointerleave", (event) => {
                    isHover = false;
                    gsap.to(tlMarquee, { timeScale: 1, ease: 'power1.inOut', duration: 0.3, overwrite: true });
                });
            }

            return tlMarquee;
        }

        let tl = marqueeGS(props.options);
        onCleanup(() => {
            tl.kill();
            DOM.wrap[0].removeEventListener("pointerenter", null);
            DOM.wrap[0].removeEventListener("pointerleave", null);
        });
    })
    return (
        <div ref={marqueeRef} class={props.class}>
            <div class='marquee'>
                <div class="marquee-inner">
                    <div class="marquee-inner-item">
                        {props.children}
                    </div>
                    <div class="marquee-inner-item">
                        {props.children}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Marquee;
