import { useState, useEffect, useRef, useMemo } from "react";

const resize = e => {
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
};
//config
//import fetchFunc imitation
const emotesList = {
    tf: {
        src: "https://media.discordapp.net/attachments/846725159938424862/996708538221076570/unknown.png?width=452&height=452",
        id: "1"
    },
    cf: {
        src: "https://media.discordapp.net/attachments/934438151768903761/989675633464463400/n0D7v.gif",
        id: "2"
    },
    bm: {
        src: "https://media.discordapp.net/attachments/846725159938424862/996708538221076570/unknown.png?width=452&height=452",
        id: "3"
    }
};

export const InputField = () => {
    const inputContent = useRef();
    
    const [inputCollection, setInputCollection] = useState([
        { type: "text"        , index: 0, value: "123456789056222222222222222222222222222222222222222222222222222222222227890" },
        { type: "line-break"  , index: 1, value: "" },
        { type: "text"        , index: 2, value: "qwe" },
        { type: "emote"       , index: 3, value: emotesList.bm.src },
        { type: "text"        , index: 4, value: "-uityi" },
        { type: "emote"       , index: 5, value: emotesList.bm.src },
        { type: "text"        , index: 6, value: "z" },
    ]);
    const [clearAction, setClearAction] = useState(false);

    const [chosenEmoji, setChosenEmoji] = useState(null);
    const onEmojiClick = (event, emojiObject) => {
      setChosenEmoji(emojiObject);
    };

    const [selectInputs, setSelectInputs] = useState([]);

    const getSelectProperties = nodeType => {
        const selection = window.getSelection();
        const focus = selection[nodeType]; //focusNode, extentNode, anchorNode
        const elemHasIndex = focus?.parentElement?.parentElement?.dataset.index || focus?.parentElement?.dataset.index;
        const index = Number(elemHasIndex);
        const inputElement = focus?.parentElement;
        const inputElementContainer = focus?.parentElement?.parentElement;
        const textElem = focus?.textContent;
        const [startSelection, endSelection] = [selection.focusOffset, selection.anchorOffset].sort((a, b) => a - b);
        
        return {
            selection: selection, 
            focus: focus, 
            index: index,
            elemHasIndex:elemHasIndex,
            inputElement: inputElement,
            inputElementContainer: inputElementContainer,
            startSelection: startSelection, 
            endSelection: endSelection,
            textElem: textElem,
        };
    }

    const accessToDelete = useRef(false)
    useEffect(() => {
        const observer = new MutationObserver(mutationRecors=>{
            const {index} = getSelectProperties("focusNode")

            mutationRecors.forEach(elem=>{
                const type = elem.type;
                const targetText = elem.target;
                if(type === "characterData" || type === "childList") {
                    if(inputCollection[index]){
                            setInputCollection(()=>{
                                const inputText = targetText?.parentElement?.textContent;
                                inputCollection[index].value = inputText
                                return inputCollection
                            })
                    }
                }
                })
        });

        observer.observe(inputContent.current, {
            childList: true,
            subtree: true,
            characterData: true
        });

        return () => observer.disconnect();

    }, [inputCollection, setInputCollection]);

    const renderInputCollection = (inputCollection) => {
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
                            {<br key={index + 1+"br"}/>}
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

    return (
        <div>
            <div>
                <img
                    style={{
                        width:"50px",
                        height: "50px"
                    }}
                    onClick={ e =>{
                        //e.target - id emote, src, etc
                        setInputCollection(() => {
                            
                            const {selection, index, focus, elemHasIndex} = getSelectProperties("focusNode");
                            
                            let newInputCollection;
                            if (!elemHasIndex) {
                                newInputCollection = ([
                                    ...inputCollection,
                                        { type: "emote" , index: 0, value: emotesList.bm.src },
                                        { type: "text"  , index: 1, value: ""},
                                ]);
                                selection.removeAllRanges();
                                return newInputCollection.map((element, newIndex) => {
                                    const { type, index, value } = element;
                                    return { type: type, index: newIndex, value: value };
                                })
                            }

                            const elemIndex = Number(elemHasIndex);
                            const caretPosition = selection?.anchorOffset;
                            const textElem = selection.anchorNode.textContent;
                            const firstPart = textElem.substring(0, caretPosition);
                            const secondPart = textElem.slice(caretPosition);
                            

                            if(caretPosition === 0 && elemIndex === 0){
                                console.log("left (first input)")
                                selection.anchorNode.textContent = "";
                                newInputCollection= ([
                                    ...inputCollection.slice(0, elemIndex),
                                        { type: "text"  , index: 0, value: ""},
                                        { type: "emote" , index: 1, value: emotesList.bm.src  },
                                        { type: "text"  , index: 2, value: secondPart},
                                    ...inputCollection.slice(elemIndex + 1, inputCollection.length)
                                ]);
                            }

                            if (caretPosition === 0 && elemIndex > 0) {
                                console.log("left (not first input)")
                                selection.anchorNode.textContent = "";
                                newInputCollection = ([
                                    ...inputCollection.slice(0, elemIndex),
                                        { type: "text"  , index: 0, value: ""},
                                        { type: "emote" , index: 1, value: emotesList.bm.src },
                                        { type: "text"  , index: 2, value: secondPart},
                                    ...inputCollection.slice(elemIndex + 1, inputCollection.length)
                                ]);
                            }
                            
                            if (elemIndex === inputCollection.length - 1 && caretPosition === textElem.length) {
                                console.log("right (last input)")
                                newInputCollection = ([
                                    ...inputCollection,
                                        { type: "emote" , index: 0, value: emotesList.bm.src },
                                        { type: "text"  , index: 1, value: ""},
                                ]);
                            }

                            if (elemIndex >= 0 && elemIndex < inputCollection.length - 1 && caretPosition === textElem.length) {
                                console.log("right (not last input)")
                                newInputCollection = [
                                    ...inputCollection.slice(0, elemIndex + 1),
                                    { type: "emote", index: 0, value: emotesList.tf.src },
                                    { type: "text",  index: 999, value: "" },
                                    ...inputCollection.slice(elemIndex + 1, inputCollection.length)
                                ];
                            }

                            if (caretPosition > 0 && caretPosition < textElem.length) {
                                console.log("between (all)")
                                newInputCollection = [
                                    ...inputCollection.slice(0, elemIndex),
                                        { type: "text"  , index: 0, value: firstPart},
                                        { type: "emote" , index: 1, value: emotesList.bm.src },
                                        { type: "text"  , index: 2, value: secondPart},
                                    ...inputCollection.slice(elemIndex + 1, inputCollection.length)
                                ];
                            }
                            selection.removeAllRanges();
                            const result = newInputCollection.map((elem, newIndex) => {
                                const { type, index, value } = elem;
                                if(index === 999){
                                    const elemNode = focus?.parentElement?.parentElement;
                                    const elemWithFakeText = elemNode?.nextElementSibling?.nextElementSibling;
                                    if(!elemWithFakeText) return { type: type, index: newIndex, value: value }
                                    const elemWithText = elemWithFakeText?.firstChild;
                                    elemWithText.textContent = "";
                                }
                                return { type: type, index: newIndex, value: value };
                            })
                            return [...result]
                        });
                    }}
                    src={emotesList.bm.src}
                    alt=""
                ></img>
                <div
                    className="input-container"
                    ref={inputContent}
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                    onFocus={e => e.preventDefault()}
                    onBlur={e => e.preventDefault()}
                    onKeyDown={e => {
                        const {selection, focus, index, inputElement, inputText, textElem, elemHasIndex, startSelection, endSelection} = getSelectProperties("focusNode");
                        const indexElement = index;
                        const focusElemLength = textElem?.length;


                        if(e.ctrlKey && e.keyCode === 90) {
                            return e.preventDefault()
                        }

                        if(e.shiftKey && e.key === "Enter") {
                            e.preventDefault()
                            setInputCollection(() => {
                                let newInputCollection = inputCollection;
                                const loseFirstElemFocusIndexTest =  Number(focus?.firstChild?.dataset?.index);
                                const elemIndex = Number(elemHasIndex)
                                console.log(loseFirstElemFocusIndexTest)
                                if (isNaN(elemIndex)) return newInputCollection
                                const firstPart = textElem.substring(0, startSelection);
                                const secondPart = textElem.slice(startSelection);
                                // if(elemIndex === inputCollection.length - 1) {
                                //     console.log(1234)
                                //     console.log(startSelection)
                                //     console.log(endSelection)
                                //     console.log(textElem.length)
                                // }
                                if (startSelection > 0 && startSelection < textElem.length) {
                                    console.log("between (all)")
                                    newInputCollection = [
                                        ...inputCollection.slice(0, elemIndex),
                                            { type: "text"      , index: 0, value: firstPart},
                                            { type: "line-break", index: 1, value: ""},
                                            { type: "text"      , index: 2, value: secondPart},
                                        ...inputCollection.slice(elemIndex + 1, inputCollection.length)
                                    ];
                                }
                                if(startSelection === textElem.length && elemIndex === inputCollection.length - 1) {
                                    console.log("right (last input)")
                                    newInputCollection = [...inputCollection,
                                        { type: "line-break" , index: 0, value: emotesList.bm.src },
                                        { type: "text"  , index: 1, value: ""}
                                    ]
                                }

                                if(startSelection === 0 && elemIndex === 0){
                                    console.log("left (first input)")
                                    e.preventDefault();
                                    newInputCollection= ([
                                        ...inputCollection.slice(0, elemIndex),
                                            { type: "text"  , index: 0, value: ""},
                                            { type: "line-break" , index: 1, value: emotesList.bm.src  },
                                            { type: "text"  , index: 2, value: secondPart},
                                        ...inputCollection.slice(elemIndex + 1, inputCollection.length)
                                    ]);
                                }
    
                                if (startSelection === 0 && elemIndex > 0) {
                                    console.log("left (not first input)")
                                    selection.anchorNode.textContent = "";
                                    newInputCollection = ([
                                        ...inputCollection.slice(0, elemIndex),
                                            { type: "text"        , index: 0, value: firstPart},
                                            { type: "line-break"  , index: 0, value: ""},
                                            { type: "text"        , index: 2, value: secondPart},
                                        ...inputCollection.slice(elemIndex + 1, inputCollection.length)
                                    ]);
                                }
    
                                if (elemIndex >= 0 && elemIndex < inputCollection.length - 1 && startSelection === textElem.length) {
                                    console.log("right (not last input)")
                                    newInputCollection = [
                                        ...inputCollection.slice(0, elemIndex + 1),
                                        { type: "line-break"  , index: 0, value: ""},
                                        { type: "text"        , index: 2, value: ""},
                                        ...inputCollection.slice(elemIndex + 1, inputCollection.length)
                                    ];
                                }
    
                                selection.removeAllRanges();
                                const result = newInputCollection.map((elem, newIndex) => {
                                    const { type, index, value } = elem;
                                    return { type: type, index: newIndex, value: value };
                                })
                                return [...result]
                            });
                            return
                        }



                        if (e.key === "Backspace") {
                            if(inputCollection.length === 1 && focusElemLength === 0) {
                                setInputCollection(()=>{
                                    inputCollection[0].value = ""
                                    return [...inputCollection]
                                })
                            }
                            if(startSelection < 1 && endSelection >= 1 && indexElement === 0) {
                                accessToDelete.current = false;
                            }
                            if(startSelection < 1 && endSelection < 1 && indexElement === 0) {
                                accessToDelete.current = true
                            }
                            if(accessToDelete.current && startSelection > 0) {
                                accessToDelete.current = false
                            }
                            if(accessToDelete.current && indexElement > 0) {
                                accessToDelete.current = false
                            }
                            if(accessToDelete.current) return e.preventDefault();

                            if(startSelection === 0) {
                                const rightElemContent = textElem;
                                const previousElement = focus?.parentElement?.parentElement?.previousElementSibling//?.previousElementSibling;
                                const previousElementChild = previousElement?.firstChild?.childNodes[0];
                                e.preventDefault();
                                setInputCollection(() => {
                                    let result = inputCollection
                                    inputCollection.splice(indexElement - 1, 2)
                                    result = inputCollection.map((element, newIndex) => {
                                        const { type, index, value } = element;
                                        if (indexElement - 2 === index) {
                                            return { type: type, index: newIndex, value: value + " " + rightElemContent }
                                        }
                                        return { type: type, index: newIndex, value: value };
                                    })
                                    return [...result]
                                })
                                if(previousElementChild){
                                    const textLength = previousElementChild.textContent.length;
                                    const rightElemContentLength = focus.textContent.length;
                                    const newCaretPosition = textLength - rightElemContentLength < 0 ? 0 : textLength - rightElemContentLength;
                                    const resultElem = e.target.childNodes[indexElement - 2].firstChild;

                                    const range = document.createRange();
                                    const sel = window.getSelection();
                                    range.setStart(resultElem.childNodes[0], 2);
                                    range.collapse(true);
                                    sel.removeAllRanges();
                                    sel.addRange(range);
                                }
                            }
                        }
                        
                        
                        if(e.key === "Enter"){
                            e.preventDefault()
                            console.log(inputCollection);
                            return
                        }
                    }}
                    onSelect={ e=> {
                            
                        const {selection, focus, index, startSelection} = getSelectProperties("anchorNode");
                        // console.log(selection)
                        // console.log(focus)
                        // console.log(index)
                        // console.log(startSelection)

                        // const selection = window.getSelection();
                        // const focus = selection.anchorNode;
                        // const elemHasIndex = focus?.parentElement?.parentElement?.dataset.index || focus?.parentElement?.dataset.index
                        // const index = Number(elemHasIndex)
                        // console.log(index)
                    }}
                    onKeyUp={e=>{
                        if(e.key === "ArrowRight" || e.key === "ArrowLeft") {
                            
                            const {selection, focus, index, startSelection} = getSelectProperties("extentNode");
                            // console.log(selection)
                            // console.log(focus)
                            // console.log(index)

                            // console.log(startSelection)
                            // const selection = window.getSelection();
                            // const focus = selection.extentNode; 
                            // const elemHasIndex = focus?.parentElement?.parentElement?.dataset.index || focus?.parentElement?.dataset.index
                            // const index = Number(elemHasIndex)
                            // console.log(index)
                        }
                    }}
                    onMouseUp={e=>{
                        const {selection, focus, index, startSelection} = getSelectProperties("focusNode");
                        // console.log(selection)
                        // console.log(focus)
                        // console.log(index)
                        // console.log(startSelection)
                    }}
                >
                    {renderInputCollection(inputCollection)}
                </div>
            </div>
        </div>
    )
}
