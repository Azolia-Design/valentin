import TextTransClip from '~/components/common/TextTransClip';
import { cvUnit } from '~/utils/number';

const HistoryHead = (props) => {
    const LINE_HEIGHT_HEADING = 160 * 0.835;
    const calcHeadingTop = (idx) => cvUnit(160 + (LINE_HEIGHT_HEADING * idx), 'rem');
    const triggerOpts = (idx) => {
        return ({
            trigger: '.sc-about__history',
            start: `top+=${calcHeadingTop(idx)} bottom`,
            end: `top+=${calcHeadingTop(idx + 1)} top+=${(window.innerHeight / 2) + LINE_HEIGHT_HEADING}`
        })
    }
    return (
        <h2 class="upper fix-font about__history-title grid">
            <span class="heading h2 fw-bold about__history-title-txt">
                <TextTransClip triggerOpts={triggerOpts(0)}>I have</TextTransClip>
            </span>
            <span class="heading h2 fw-bold cl-txt-orange about__history-title-txt">
                <TextTransClip triggerOpts={triggerOpts(1)}>8 years</TextTransClip>
            </span>
            <span class="heading h2 fw-bold about__history-title-txt">
                <TextTransClip triggerOpts={triggerOpts(2)}>of Experience</TextTransClip>
            </span>
            <span class="heading h2 fw-bold about__history-title-txt">
                <TextTransClip triggerOpts={triggerOpts(3)}>in <span class="cl-txt-title">fintech</span></TextTransClip>
            </span>
            <span class="heading h2 fw-bold about__history-title-txt">
                <TextTransClip triggerOpts={triggerOpts(4)}>field</TextTransClip>
            </span>
        </h2>
    )
}

export default HistoryHead;