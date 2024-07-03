import { For } from "solid-js";

const ProjectListing = (props) => {
    return (
        <div class="home__project-listing grid">
            <div class="home__project-slide">
                <div class="home__project-slide-item-wrap">
                    <div class="home__project-slide-item">
                        <div class="home__project-slide-item-progress">
                            <div class="home__project-slide-item-progress-inner"></div>
                        </div>
                        <div class="home__project-slide-item-img">
                            <img class="img img-fill" src={props.data[2].thumbnail.src} alt={props.data[0].thumbnail.alt} />
                        </div>
                    </div>
                </div>
                <div class="home__project-slide-item-wrap">
                    <div class="home__project-slide-item">
                        <div class="home__project-slide-item-progress">
                            <div class="home__project-slide-item-progress-inner"></div>
                        </div>
                        <div class="home__project-slide-item-img">
                            <img class="img img-fill" src={props.data[2].thumbnail.src} alt={props.data[0].thumbnail.alt} />
                        </div>
                    </div>
                </div>
                <div class="home__project-slide-item-wrap active">
                    <div class="home__project-slide-item">
                        <div class="home__project-slide-item-progress">
                            <div class="home__project-slide-item-progress-inner"></div>
                        </div>
                        <div class="home__project-slide-item-img">
                            <img class="img img-fill" src={props.data[2].thumbnail.src} alt={props.data[0].thumbnail.alt} />
                        </div>
                    </div>
                </div>
                <div class="home__project-slide-item-wrap">
                    <div class="home__project-slide-item">
                        <div class="home__project-slide-item-progress">
                            <div class="home__project-slide-item-progress-inner"></div>
                        </div>
                        <div class="home__project-slide-item-img">
                            <img class="img img-fill" src={props.data[2].thumbnail.src} alt={props.data[0].thumbnail.alt} />
                        </div>
                    </div>
                </div>
            </div>
            <div class="home__project-name">
                <div class="fs-20 fw-med home__project-pagination">
                    <span class="cl-txt-title">03 </span><span class="cl-txt-disable">/ 04</span>
                </div>
                <h4 class="heading h5 fw-med upper cl-txt-title">{props.data[2].title}</h4>
            </div>
            <div class="home__project-thumbnail">
                <img class="img img-fill" src={props.data[2].thumbnail.src} alt={props.data[0].thumbnail.alt} />
                {props.blur}
            </div>
            <div class="home__project-sub-info">
                <div class="home__project-year">
                    <p class="cl-txt-desc fw-med home__project-label">Year</p>
                    <div class="heading h5 fw-med cl-txt-title">{props.data[2].year}</div>
                </div>
                <div class="home__project-role">
                    <p class="cl-txt-desc fw-med home__project-label">Role</p>
                    <div class="home__project-role-listing">
                        <For each={props.data[2].role}>
                            {(role) => <p class="fs-20 cl-txt-sub">{role}</p>}
                        </For>
                    </div>
                </div>
            </div>
            <div class="home__project-desc">
                <p class="cl-txt-desc fw-med home__project-label">Description</p>
                <p class="fs-20 cl-txt-sub">{props.data[2].desc}</p>

                <a href={props.data[2].link} class="cl-txt-orange arrow-hover home__project-link">
                    <span class="txt-link fs-20 cl-txt-orange">All projects</span>
                    {props.arrows}
                </a>
            </div>
        </div>
    )
}

export default ProjectListing;