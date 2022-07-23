export const renderInputCollection = (inputCollection) => {
    console.log("...rendering")
    return inputCollection.map((element, key) => {
        const { type, index, value } = element;
        if(type === "text") {
            return (
                <div
                    key={key}
                    tabIndex={-1}
                    data-index={index}
                    data-type={type}
                    className="input-element"
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                    onDrag={e=>e.preventDefault()}
                >
                    <span
                        className="input-part"
                        tabIndex={-1}
                        contentEditable={true}
                        suppressContentEditableWarning={true}
                        onDrag={e=>e.preventDefault()}
                    >   
                        {value}
                    </span>
                </div>
            )
        }

        if (type === "line-break") {
            return (
                <div
                    key={key}
                    tabIndex={-1}
                    data-index={index}
                    data-type={type}
                    className="input-element-line-break"
                    contentEditable={false}
                    suppressContentEditableWarning={true}
                    onDrag={e => e.preventDefault()}
                    onFocus={e=>e.preventDefault()}
                    onClick={e=>e.preventDefault()}
                >
                    <span
                        className="input-part"
                        tabIndex={-1}
                        contentEditable={false}
                        suppressContentEditableWarning={true}
                        onDrag={e => e.preventDefault()}
                        onFocus={e=>e.preventDefault()}
                        onClick={e=>e.preventDefault()}
                    >
                        {<br key={index + "br"}/>}
                    </span>
                </div>
        )}
        
        if(type === "emote") {
            return (
                <div
                    key={key}
                    tabIndex={-1}
                    data-index={index}
                    data-type={type}
                    className="input-element-emote"
                    contentEditable={false}
                    onDrag={e=>e.preventDefault()}
                    style={{userSelect: 'none'}}
                    >
                    <img
                        className="input-emote-pic"
                        src={value}
                        alt=""
                        tabIndex={-1}
                        contentEditable={false}
                    />
                </div>
            )
        }
    })
};