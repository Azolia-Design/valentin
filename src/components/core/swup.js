import Swup from 'swup';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import gsap from 'gsap';

import { getCursor, initMouseFollower } from './cursor';
import { getLenis } from './lenis';
import initButton from './button';

import SwupParallelPlugin from '@swup/parallel-plugin';
import SwupJsPlugin from '@swup/js-plugin';
import SwupPreloadPlugin from '@swup/preload-plugin';
import SwupRouteNamePlugin from '@swup/route-name-plugin';

let swup;

function forceScrollTop() {
    getLenis().scrollTo("top", { duration: .001 });
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    } else {
        window.addEventListener('pageshow', function(event) {
            if (!event.persisted) {
                window.scrollTo(0, 0);
            }
        });
    }
}

function updateHeader() {
    const links = document.querySelectorAll('.header__menu-link');
    Array.prototype.forEach.call(links, function (link) {
        link.classList.remove("active");
        link.getAttribute('href') === window.location.pathname && link.classList.add("active");
    });
}

function enterTransition(containers) {
    const nextContainer = containers.next;
    const prevContainer = containers.previous;

    function onComplete() {
        console.log("xong roi dcm")
    }
    const tl = gsap.timeline({
        defaults: {
            duration: 1,
            ease: 'power2.inOut'
		},
		onComplete: onComplete
    });
    tl
        .fromTo(nextContainer, { autoAlpha: 0 }, { autoAlpha: 1 })
        // .to(DOM.transMask, { yPercent: 80 }, 0)
        // .to(nextContainer, { autoAlpha: 1 });
    return tl;
}

function leaveTransition(containers) {
    const nextContainer = containers.next;
    const prevContainer = containers.previous;

    const tl = gsap.timeline({
        defaults: {
            duration: 10,
            ease: 'power2.inOut'
        },
    });

    tl
        .to(nextContainer, { autoAlpha: 0 })

    return tl;
}

// const pageTransition = [
//     {
//         from: '(.*)',
//         to: '(.*)',
//         // out: (done) => {
//         //     console.log('outttt')
//         //     setTimeout(done, 2000);
//         // },
//         // in: (done) => {
//         //     console.log('innnn')
//         //     done();
//         // },
//         out: () => {
//             console.log('outttt')

//             await gsap.to('.is', { opacity: 0, duration: 1 });
//         },
//         in: async () => {
//             console.log('innnn')

//             // await gsap.fromTo('#swup', { opacity: 0 }, { opacity: 1, duration: 1 });

//             const next = document.querySelector('main');
//             const prev = document.querySelector('main + main');

//             console.log(next)
//             console.log(prev)
//             await Promise.all([
//                 gsap.fromTo(prev, { scale: 1 },{ scale: 0, duration: 1, overwrite: true, clearProps: 'all' }),
//                 gsap.fromTo(next, { scale: 0 }, { scale: 1, duration: 1, overwrite: true, clearProps: 'all' })
//             ]);
//         }
//     }
// ]

function initSwup() {
    swup = new Swup({
        containers: ['main'],
        plugins: [
            new SwupRouteNamePlugin({
                routes: [
                    { name: 'home', path: '/' },
                    { name: 'projects', path: '/projects' },
                    { name: 'project', path: '/project/:slug' },
                    { name: 'any', path: '(.*)' }
                ]
            })
            // new SwupJsPlugin({
            //     animations: [
            //         {
            //             from: '(.*)', // matches any route
            //             to: '(.*)', // matches any route
            //             out: async (done) => {
            //                 console.log('oyyyy')
            //                 await gsap.fromTo(document.querySelector('main'), { opacity: 1 }, {opacity: 0, duration: 5, onComplete: () => {done()}})
            //                 // setTimeout(done, 2000);
            //             }, // immediately continues
            //             in: async (done) => {
            //                 console.log('oyyyy22222')
            //                 gsap.fromTo(document.querySelector('main'), { opacity: 0 }, {opacity: 1, duration: 1}).then(done)
            //             } // immediately continues
            //           }
            // ] }),
            // new SwupParallelPlugin({ containers: ['main'] }),
            // new SwupPreloadPlugin()
        ]
    });

    swup.hooks.on('page:view', (visit) => {
        console.log('New page loaded:', visit.to.url);

        forceScrollTop();
        initMouseFollower();
        initButton("render");
    });

    swup.hooks.on('visit:start', (visit) => {
        console.log("visit:start", window.location.href)
    });


    swup.hooks.on('content:replace', () => {
        updateHeader();
        forceScrollTop();
        ScrollTrigger.getAll().forEach((e) => e.kill());
        ScrollTrigger.clearMatchMedia();
        getCursor().destroy();
    }, { before: true });


    // swup.hooks.before('content:insert', (visit, { containers }) => {
    //     console.log("insert", document.querySelectorAll('.main').length);
    //     // function check() {
    //         // requestAnimationFrame(check)
    //     // }
    //     // requestAnimationFrame(check)
    //     // enterTransition(containers[0]);
    //     // console.log(containers)

    //     // for (const { next } of containers) {
    //     //     // console.log('About to insert container', next);
    //     // }
    // });
    // swup.hooks.before('content:remove', (visit, { containers }) => {
    //     console.log("remove", containers);

    //     // for (const { remove } of containers) {
    //     //     console.log('About to remove containers', remove);
    //     // }
    //     // leaveTransition(containers[0])
    // });
}

function getSwup() {
    if (!swup) {
        initSwup();
    }
    return swup;
}

export { initSwup, getSwup }