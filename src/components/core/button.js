import gsap from 'gsap';
import { easeInOutQuint } from '~/utils/easing';

const initButton = (state) => {
    if (state === 'render') {
        document.querySelectorAll('.btn-circle').forEach(function (btn) {
            let onAnimate = false;
            let svg = btn.querySelector('.btn-circle-svg circle');

            gsap.set(svg, { drawSVG: "100% 100%" });
            let tl = gsap.timeline({
                delay: 1.5,
                onComplete() {
                    let completeTl = gsap.timeline({ paused: true });
                    completeTl
                        .fromTo(svg,
                            { drawSVG: "100%" },
                            { duration: 0.45, ease: 'power3.in', drawSVG: "0% 0%", onStart: function () { onAnimate = true } },
                        "<")
                        .set(svg, { drawSVG: "100% 100%" })
                        .to(svg,
                            { duration: 0.65, ease: 'power4.out', drawSVG: "100% 0%", delay: 0.05, onStart: function () { onAnimate = false }},
                            "< -0.045")

                    completeTl.reverse();
                    btn.addEventListener("mouseenter", () => {
                        if (onAnimate) return;
                        tl.play() && completeTl.play()
                    })
                    btn.addEventListener("mouseleave", () => {
                        tl.reverse();
                        onAnimate = false;
                        completeTl.reverse();
                    })
                }
            })
            tl.fromTo(svg, { drawSVG: "100% 100%" }, { duration: 1, ease: gsap.parseEase(easeInOutQuint), drawSVG: "100% 0%" })
        })

        document.querySelectorAll("[data-magnetic]").forEach(function (el) {
            el.classList.add("magnt");
            if (el.classList.contains("magnt")) {
                el.addEventListener("mousemove", function (e) {
                    let r = .4;
                    let rect = el.getBoundingClientRect(),
                    xTarget = e.pageX - rect.left,
                    yTarget = e.pageY - rect.top,
                    topPos = window.pageYOffset || document.documentElement.scrollTop;
                    gsap.to(el, { x: (xTarget - rect.width / 2) * r, y: (yTarget - rect.height / 2 - topPos) * r, ease: "power2", duration: 0.6 });
                })
                el.addEventListener("mouseleave", function () {
                    gsap.to(el, { scale: 1, x: 0, y: 0, ease: "power3", duration: 0.8 });
                });
            }
        });
    }
}

export default initButton;