import Swup from 'swup';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import gsap from 'gsap';

import { getCursor, initMouseFollower } from './cursor';
import { getLenis } from './lenis';
import initButton from './button';

import SwupJsPlugin from '@swup/js-plugin';
import SwupRouteNamePlugin from '@swup/route-name-plugin';
import { checkIsPostPage } from '~/utils/permalinks';

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

function resetTransition(url) {
    function projectTransition() {
        const transitionDOM = (attr) => document.querySelector(`.project__transition [data-project-${attr}]`)

        if (!checkIsPostPage(url)) {
            document.querySelector('.project__transition').removeAttribute('style');
            document.querySelector('.project__transition .project__thumbnail-img-inner')?.remove();

            transitionDOM('name').innerHTML = '';
            transitionDOM('name').removeAttribute('style');

            transitionDOM('info').innerHTML = '';
            transitionDOM('info').removeAttribute('style');

            transitionDOM('year').innerHTML = '';
            transitionDOM('year').removeAttribute('style');
        }
    }

    projectTransition();
}

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
        ]
    });

    swup.hooks.on('page:view', (visit) => {
        console.log('New page loaded:', visit.to.url);

        resetTransition(visit.to.url);
        forceScrollTop();
        if (window.innerWidth > 991) {
            initMouseFollower();
        }
    });

    swup.hooks.on('enable', () => {
        initButton("render");
    })

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
}

function getSwup() {
    if (!swup) {
        initSwup();
    }
    return swup;
}

export { initSwup, getSwup }