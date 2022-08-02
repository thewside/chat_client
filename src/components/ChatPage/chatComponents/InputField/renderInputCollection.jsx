export const renderInputCollection = (inputCollection) => {
    // console.log("...rendering")
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
                    onDrag={e => e.preventDefault()}
                    onFocus={e=>e.preventDefault()}
                    onClick={e=>e.preventDefault()}
                    onKeyDown={e=>e.preventDefault()}
                    onMouseDown={e=>e.preventDefault()}
                    onSelect={e=>e.preventDefault()}
                >
                    <span
                        className="input-part"
                        tabIndex={-1}
                        contentEditable={false}
                        draggable={false}
                        onMouseDown={e=>e.preventDefault()}
                        onDrag={e => e.preventDefault()}
                        onFocus={e=>e.preventDefault()}
                        onClick={e=>e.preventDefault()}
                        onKeyDown={e=>e.preventDefault()}
                        onSelect={e=>e.preventDefault()}
                    >
                    <span key={index + "line-break"}/>

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
                    onMouseDown={e=>e.preventDefault()}
                    contentEditable={false}
                    onFocus={e=>e.preventDefault()}
                    onKeyDown={e=>e.preventDefault()}
                >   
                        <img
                            tabIndex={-1}
                            className="input-emote-pic"
                            src={value}
                            alt=""
                            draggable={false}
                            onMouseDown={e=>e.preventDefault()}
                            onFocus={e=>e.preventDefault()}
                            onKeyDown={e=>e.preventDefault()}
                        />
                </div>
            )
        }
    })
};