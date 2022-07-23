import { useState, useEffect, useRef, useMemo } from "react";
import { renderInputCollection } from "./renderInput";
import { getSelectProperties } from "./getSelectProperties";

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

    const [selectProperties, setSelectProperties] = useState({
        indexAfterRemovalElement: 0,
        previousElemLength:       0,
        inputRange: [],
        indexRange: [],

    });




    const accessToDelete = useRef(false)
    const getElementByIndex = index => inputContent.current?.childNodes[index]?.firstChild?.childNodes[0];

    useEffect(() => {
        const startSelectionIndex = selectProperties.indexAfterRemovalElement;
        const startSelectionElemLength = selectProperties.previousElemLength;
        const inputWhichShouldBeSelect = getElementByIndex(startSelectionIndex - 2);
        if(inputWhichShouldBeSelect){
            const range = document.createRange();
            range.setStart(inputWhichShouldBeSelect, startSelectionElemLength);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }

        const observer = new MutationObserver(mutationRecors => {
            mutationRecors.forEach(elem => {
                const type = elem.type;
                const targetText = elem.target;
                if (type === "characterData" || type === "childList") {
                    const { index } = getSelectProperties("focusNode");
                    if (inputCollection[index]) {
                        setInputCollection(() => {
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
            characterData: true,
            attributes: true
        });

        return () => observer.disconnect();

    }, [inputCollection, setInputCollection]);



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
                        const {selection, index, textElem, elemHasIndex, startPointSelection, endPointSelection} = getSelectProperties("focusNode");
                        const indexElement = index;
                        const focusElemLength = textElem?.length;

                        if(e.ctrlKey && e.keyCode === 90) {
                            return e.preventDefault()
                        }

                        if(e.shiftKey && e.key === "Enter") {
                            e.preventDefault()
                            setInputCollection(() => {
                                let newInputCollection = inputCollection;
                                const elemIndex = Number(elemHasIndex)
                                if (isNaN(elemIndex)) return newInputCollection
                                const firstPart = textElem.substring(0, startPointSelection);
                                const secondPart = textElem.slice(startPointSelection);

                                if (startPointSelection > 0 && startPointSelection < textElem.length) {
                                    console.log("between (all)")
                                    newInputCollection = [
                                        ...inputCollection.slice(0, elemIndex),
                                            { type: "text"      , index: 0, value: firstPart},
                                            { type: "line-break", index: 1, value: ""},
                                            { type: "text"      , index: 2, value: secondPart},
                                        ...inputCollection.slice(elemIndex + 1, inputCollection.length)
                                    ];
                                }
                                if(startPointSelection === textElem.length && elemIndex === inputCollection.length - 1) {
                                    console.log("right (last input)")
                                    newInputCollection = [...inputCollection,
                                        { type: "line-break" , index: 0, value: emotesList.bm.src },
                                        { type: "text"  , index: 1, value: ""}
                                    ]
                                }

                                if(startPointSelection === 0 && elemIndex === 0){
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
    
                                if (startPointSelection === 0 && elemIndex > 0) {
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
    
                                if (elemIndex >= 0 && elemIndex < inputCollection.length - 1 && startPointSelection === textElem.length) {
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
                            const leftIndex  = selectProperties.indexRange[0];
                            const rightIndex = selectProperties.indexRange[1];

                            if(inputCollection.length === 1 && focusElemLength === 0) {
                                setInputCollection(()=>{
                                    inputCollection[0].value = ""
                                    return [...inputCollection]
                                })
                            }
                            if(startPointSelection < 1 && endPointSelection >= 1 && indexElement === 0) {
                                accessToDelete.current = false;
                            }
                            if(startPointSelection < 1 && endPointSelection < 1 && indexElement === 0) {
                                accessToDelete.current = true
                            }
                            if(accessToDelete.current && startPointSelection > 0) {
                                accessToDelete.current = false
                            }
                            if(accessToDelete.current && indexElement > 0) {
                                accessToDelete.current = false
                            }
                            if(accessToDelete.current) return e.preventDefault();

                            if(startPointSelection === 0 && leftIndex === rightIndex) {
                                e.preventDefault();
                                console.log("cut")
                                setInputCollection(() => {
                                    let result = inputCollection
                                    inputCollection.splice(indexElement - 1, 2)
                                    result = inputCollection.map((element, newIndex) => {
                                        const { type, index, value } = element;
                                        if (indexElement - 2 === index) {
                                            return { type: type, index: newIndex, value: value + " " + textElem }
                                        }
                                        return { type: type, index: newIndex, value: value };
                                    })
                                    return [...result]
                                })
                                const {index} = getSelectProperties("focusNode");
                                const previousElem = getElementByIndex(index - 2);
                                setSelectProperties(prev=>{
                                    return {
                                        ...prev,
                                        indexAfterRemovalElement: index || 0,
                                        previousElemLength: previousElem?.length || 0
                                    }
                                })
                            }
                            
                            // if(leftIndex !== rightIndex){
                            //     e.preventDefault()
                            //     console.log(selectProperties)
                            //     setInputCollection(() => {
                            //         let result = inputCollection;
                            //         result = [
                            //             ...inputCollection.slice(leftIndex, rightIndex),
                            //             ...inputCollection
                            //         ]
                            //         return [...result];
                            //     })
                            // }
                        }
                        
                        
                        if(e.key === "Enter"){
                            e.preventDefault()
                            console.log(inputCollection);
                            return
                        }
                    }}

                    onSelect={ ()=> {
                        const {extentSelection, index, startPointSelection, endPointSelection} = getSelectProperties("anchorNode");
                        
                        const sortIndex = [index, extentSelection].sort((a, b) => a - b);
                        let sortRanges;
                        if(sortIndex[0] === index) {
                            sortRanges = [endPointSelection, startPointSelection];
                        };
                        if(sortIndex[1] === index){
                            sortRanges = [startPointSelection, endPointSelection];
                        };

                        setSelectProperties(prev => {
                            return {...prev, 
                                indexRange: sortIndex  || [0, 0],
                                inputRange: sortRanges || [0, 0]
                            }
                        });
                    }}
                >
                    {renderInputCollection(inputCollection)}
                </div>
            </div>
        </div>
    )
}
