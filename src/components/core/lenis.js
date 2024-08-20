import Lenis from 'lenis';

let lenis;

function initLenis(options = {}) {
    lenis = new Lenis({
        infinite: true,
        syncTouch: true,
        touchInertiaMultiplier: 5,
        content: window.innerWidth > 767 ? document.documentElement : document.querySelector('.wrapper'),
        wrapper: window.innerWidth > 767 ? document.documentElement : document.querySelector('.wrapper'),
        ...options
    });

    function raf(time) {
        lenis.raf(time)
        requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf);
}

function getLenis(options = {}) {
    if (!lenis) {
        initLenis(options);
    } else if (Object.keys(options).length > 0) {
        // Reinitialize Lenis if new options are provided
        initLenis(options);
    }
    return lenis;
}

let ticking = true;
function applyOnScroll(scrollPos) {
    function headerOnScroll(scrollPos) {
        const header = document.querySelector('header');
        if (!header) return;
        if (scrollPos > (header.offsetHeight * 6) && !header.classList.contains('on-scroll')) {
            header.classList.add("on-scroll");
        }
        else if (scrollPos <= (header.offsetHeight * 6) && header.classList.contains('on-scroll')) {
            header.classList.remove('on-scroll');
        }
        ticking = false;
    }
    headerOnScroll(scrollPos);
}

function reInitLenisScroll(_lenis) {
    _lenis.on('scroll', function (inst) {
        let scrollPos = inst.scroll;
        if (!ticking) {
            requestAnimationFrame(() => {
                applyOnScroll(scrollPos);
            });
            ticking = true;
        }
    })
}

export { initLenis, getLenis, applyOnScroll, reInitLenisScroll }