import gsap from 'gsap';
import MouseFollower from "mouse-follower";

MouseFollower.registerGSAP(gsap);
let cursor;

function initMouseFollower() {
    cursor = new MouseFollower({
        speed: 0.85,
        skewing: 2,
        overwrite: true
    })
}

function getCursor() {
    if (!cursor) {
        initMouseFollower();
    }
    return cursor;
}

export { initMouseFollower, getCursor }