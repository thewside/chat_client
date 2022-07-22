export const EmoteComponent = ({id, src, className}) => {
    return (
        <div
            key={id}
        >
            <img key={id} data-emote={`tf-container-${id}`} draggable={false} className={className} src={src} alt="" ></img>
        </div>
    )
}