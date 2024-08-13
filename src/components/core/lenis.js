import Lenis from 'lenis';

let lenis;

function initLenis() {
    lenis = new Lenis({
        // infinite: true
        content: window.innerWidth > 767 ? document.documentElement : document.querySelector('.wrapper'),
        wrapper: window.innerWidth > 767 ? document.documentElement : document.querySelector('.wrapper')
    });

    function raf(time) {
        lenis.raf(time)
        requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf);
}

function getLenis() {
    if (!lenis) {
        initLenis();
    }
    return lenis;
}

export { initLenis, getLenis }