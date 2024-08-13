import Lenis from 'lenis';

let lenis;

function initLenis() {
    console.log(typeof document.querySelector('.wrapper'))
    console.log(document.querySelector('.wrapper'))
    lenis = new Lenis({
        // infinite: true
        content: window.innerWidth > 767 ? document.documentElement : document.querySelector('.wrapper'),
        wrapper: window.innerWidth > 767 ? document.documentElement : document.querySelector('.wrapper')
    });
    console.log(lenis)

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