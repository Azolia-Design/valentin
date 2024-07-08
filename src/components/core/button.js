import gsap from 'gsap';
// import '~/vendors/Greensock/DrawSVG';

const initButton = (state) => {
    gsap.registerPlugin(DrawSVGPlugin, CustomEase)
    let onAnimate = false;

    const CIRCLE = {
        btn: document.querySelectorAll('.btn-circle'),
        svg: document.querySelectorAll('.btn-circle .btn-circle-svg circle')
    }

    if (state === 'render') {
        gsap.set(CIRCLE.svg, { drawSVG: "100% 100%" });
        let tl = gsap.timeline({
            delay: 1.5,
            onComplete() {
                let completeTl = gsap.timeline({ paused: true });
                completeTl
                    .fromTo(CIRCLE.svg,
                        { drawSVG: "100%" },
                        { duration: 0.45, ease: 'power3.in', drawSVG: "0% 0%", onStart: function () { onAnimate = true } },
                    "<")
                    .set(CIRCLE.svg, { drawSVG: "100% 100%" })
                    .to(CIRCLE.svg,
                        { duration: 0.65, ease: 'power4.out', drawSVG: "100% 0%", delay: 0.05, onStart: function () { onAnimate = false }},
                        "< -0.045")

                completeTl.reverse();
                CIRCLE.btn.forEach((el) => {
                    el.addEventListener("mouseenter", () => {
                        if (onAnimate) return;
                        tl.play() && completeTl.play()
                    })
                });
                CIRCLE.btn.forEach((el) => {
                    el.addEventListener("mouseleave", () => {
                        tl.reverse();
                        onAnimate = false;
                        completeTl.reverse();
                    })
                });
            }
        })
        tl.fromTo(CIRCLE.svg, { drawSVG: "100% 100%" }, { duration: 1, ease: CustomEase.create("cubic-bezier", ".64,.14,0,1"), drawSVG: "100% 0%" })
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