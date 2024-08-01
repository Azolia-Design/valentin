function Content(props) {
    return (
        <a href={`/${props.link}`}>
            {props.children}
        </a>
    )
}
export default Content;