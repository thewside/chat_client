import { useState, useEffect, useRef, useMemo } from "react";
import { renderInputCollection } from "./renderInput";
import { getSelectProperties } from "./getSelectProperties";
import { useCallback } from "react";
import { pickEmote } from "./pickEmote";
import { selectAll, selectPart } from "./selectionOnClicks";
import { сutTextMessage } from "./сutTextMessage";
import { cutWithDeleteKey } from "./cutWithDeleteKey";
import { rewrite } from "./rewrite";

// const resize = e => {
//     e.target.style.height = 'auto';
//     e.target.style.height = e.target.scrollHeight + 'px';
// };

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
    const getElementByIndex = index => inputContent.current?.childNodes[index]?.firstChild?.childNodes[0];
    
    const [inputCollection, setInputCollection] = useState([
        { type: "text"        , index: 0, value: "1234567890562 222222222227890" },
        { type: "line-break"  , index: 1, value: "" },
        { type: "text"        , index: 2, value: "qwe" },
        { type: "emote"       , index: 3, value: emotesList.bm.src },
        { type: "text"        , index: 4, value: "" },
        { type: "emote"       , index: 5, value: "https://media.discordapp.net/attachments/922941561229160448/1003206634841067520/unknown.png?width=663&height=498" },
        { type: "text"        , index: 6, value: "9" },
    ]);
    
    const [selectProperties, setSelectProperties] = useState({
        indexAfterRemovalElement: 0,
        previousElemLength:       0,
        inputRange: [],
        indexRange: [],
        previousContent: []
    });

    const stopRepeating = (startPointSelection, leftElemTextContent, e, key) => {
        //key === 17 || key === 67 || key === 16
        if(key === 13 ) return e.preventDefault();
        

        //left right
        if(key === 39) {
            if(startPointSelection === leftElemTextContent.length){
                e.preventDefault()
            }
        }
        if(key === 37){
            if(startPointSelection === 0) { 
                e.preventDefault()
            }
        }

        if(key < 37 && key > 90) return e.preventDefault()
    };

    useEffect(() => {
        const startSelectionIndex = selectProperties.indexAfterRemovalElement;
        const startSelectionElemLength = selectProperties.previousElemLength;
        const inputWhichShouldBeSelect = getElementByIndex(startSelectionIndex - 2);
        if(inputWhichShouldBeSelect){
            const range = document.createRange();
            console.dir(inputWhichShouldBeSelect)
            range.setStart(inputWhichShouldBeSelect, startSelectionElemLength);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        }

        const observer = new MutationObserver(mutationRecords => {
            
            mutationRecords.forEach(elem => {
                const type = elem.type;
                const {focusNodeIndex} = getSelectProperties();
                if (type === "characterData" || type === "childList") {
                    if (inputCollection[focusNodeIndex]) {
                        setInputCollection(() => {
                            const inputText = elem.target?.parentElement?.textContent;
                            inputCollection[focusNodeIndex].value = inputText;
                            return inputCollection
                        });
                        // setSelectProperties(prev => {
                        //     const prevLength = prev?.previousContent?.length;
                        //     if(typeof(prevLength) === 'undefined') return prev
                        //     if (prevLength <= 10) {
                        //         selectProperties.previousContent.push([inputCollection])
                        //         return prev
                        //     } else {
                        //         return {
                        //             ...prev,
                        //             previousContent: []
                        //         }
                        //     }
                        // });

                    }
                    if (elem.target?.parentElement?.textContent.length === 0) {
                        inputCollection[focusNodeIndex].value = ""
                    }
                }

                if(type === "childList"){
                    console.log("cl")
                    const firstNode = elem.target.childNodes[0];
                    if(firstNode?.nodeName === "BR"){
                        firstNode?.remove()
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
        
        setSelectProperties(prev => {
            const prevLength = prev?.previousContent?.length;
            if(typeof(prevLength) === 'undefined') return prev
            if (prevLength <= 10) {
                selectProperties.previousContent.push([inputCollection])
                return prev
            } else {
                return {
                    ...prev,
                    previousContent: []
                }
            }
        })

        return () => observer.disconnect();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputCollection, setInputCollection]);

    const resultInput = useMemo(()=> renderInputCollection(inputCollection), [inputCollection]);
    
    useEffect(()=>{
        // console.log(selectProperties.indexRange)
        // console.log(selectProperties.inputRange)
        // console.log(selectProperties.selectedInput)
    }, [selectProperties]);

    const selectHandler = useCallback(e => {
        if(e?.target !== inputContent.current) return e.preventDefault();
        const {
            focusNodeIndex, 
            anchorNodeIndex, 
            startPointSelection, 
            endPointSelection, 
            inputElementContainer
        } = getSelectProperties();

        if(!inputElementContainer) return
        const sortIndex = [anchorNodeIndex, focusNodeIndex].sort((a, b) => a - b);
        let sortRanges;
        if (sortIndex[0] === anchorNodeIndex) {
            sortRanges = [endPointSelection, startPointSelection];
        };
        if (sortIndex[1] === anchorNodeIndex) {
            sortRanges = [startPointSelection, endPointSelection];
        };
        setSelectProperties(prev => {
            return {
                ...prev,
                indexRange: sortIndex,
                inputRange: sortRanges || [0, 0]
            }
        });
    }, []);


    useEffect(()=>{
        window.addEventListener("mouseup", selectHandler);
        return () => window.removeEventListener("mouseup", selectHandler);
    }, [])

    return (
        <div>
            <img
                style={{ width: "50px", height: "50px" }}
                onMouseUp={e => {
                    pickEmote({ inputCollection, setInputCollection });
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
                    if (e.target !== inputContent.current) {
                        e.preventDefault()
                        return 
                    }
                    const {
                        selection,
                        index,
                        focusNode,
                        anchorNode,
                        textElemFocusNode,
                        elemHasIndex,
                        startPointSelection,
                        endPointSelection,
                        focusNodeIndex,
                        anchorNodeIndex
                    } = getSelectProperties();

                    const [leftIndex, rightIndex] = selectProperties.indexRange;
                    const [rangePositionLeft, rangePositionRight] = selectProperties.inputRange;
                    const focusElemLength = textElemFocusNode?.length;

                    const leftElemTextContent = getElementByIndex(leftIndex);
                    const rightElemTextContent = getElementByIndex(rightIndex);
                    const editParams = {
                        e,
                        selection,
                        focusNode,
                        anchorNode,
                        leftIndex,
                        rightIndex,
                        rangePositionLeft,
                        rangePositionRight,
                        inputCollection,
                        textElemFocusNode,
                        focusElemLength,
                        startPointSelection,
                        endPointSelection,
                        leftElemTextContent,
                        rightElemTextContent,
                        focusNodeIndex,
                        anchorNodeIndex,
                        selectProperties,
                        getSelectProperties,
                        setSelectProperties,
                        setInputCollection,
                        getElementByIndex
                    }
                    rewrite(editParams)
                    // if(e.repeat) {
                    //     return stopRepeating(startPointSelection, leftElemTextContent, e, e.keyCode)
                    // }

                    //CTRL + Z
                    // if(e.ctrlKey && e.keyCode === 90) {
                    //     e.preventDefault()
                    //     console.log(selectProperties.previousContent)
                    //     const length = selectProperties.previousContent.length - 2;
                    //     const lastElem = length < 0 ? 0 : length;
                    //     const prevElement = selectProperties.previousContent[lastElem]?.[0];
                    //     if(!prevElement) return
                    //     setInputCollection(prev=>{
                    //         // if(!prevElement) return prev
                    //         return [...prevElement]
                    //     })
                    //     setSelectProperties(prev =>{
                    //         prev.previousContent.pop();
                    //         prev.previousContent.pop();
                    //         return {
                    //             ...prev,
                    //             previousContent:  prev.previousContent
                    //         }
                    //     })
                    // }

                    // if(e.shiftKey && e.key === "Enter") {
                    //     e.preventDefault()
                    //     setInputCollection(() => {
                    //         let newInputCollection = inputCollection;
                    //         const elemIndex = Number(elemHasIndex)
                    //         if (isNaN(elemIndex)) return newInputCollection
                    //         const firstPart = textElemFocusNode.substring(0, startPointSelection);
                    //         const secondPart = textElemFocusNode.slice(startPointSelection);

                    //         if (startPointSelection > 0 && startPointSelection < textElemFocusNode.length) {
                    //             console.log("between (all)")
                    //             newInputCollection = [
                    //                 ...inputCollection.slice(0, elemIndex),
                    //                     { type: "text"      , index: 0, value: firstPart},
                    //                     { type: "line-break", index: 1, value: ""},
                    //                     { type: "text"      , index: 2, value: secondPart},
                    //                 ...inputCollection.slice(elemIndex + 1, inputCollection.length)
                    //             ];
                    //         }

                    //         if(startPointSelection === textElemFocusNode.length && elemIndex === inputCollection.length - 1) {
                    //             console.log("right (last input)")
                    //             newInputCollection = [...inputCollection,
                    //                 { type: "line-break" , index: 0, value: emotesList.bm.src },
                    //                 { type: "text"  , index: 1, value: ""}
                    //             ]
                    //         }

                    //         if(startPointSelection === 0 && elemIndex === 0){
                    //             console.log("left (first input)")
                    //             e.preventDefault();
                    //             newInputCollection= ([
                    //                 ...inputCollection.slice(0, elemIndex),
                    //                     { type: "text"  , index: 0, value: ""},
                    //                     { type: "line-break" , index: 1, value: emotesList.bm.src  },
                    //                     { type: "text"  , index: 2, value: secondPart},
                    //                 ...inputCollection.slice(elemIndex + 1, inputCollection.length)
                    //             ]);
                    //         }

                    //         if (startPointSelection === 0 && elemIndex > 0) {
                    //             console.log("left (not first input)")
                    //             selection.anchorNode.textContent = "";
                    //             newInputCollection = ([
                    //                 ...inputCollection.slice(0, elemIndex),
                    //                     { type: "text"        , index: 0, value: firstPart},
                    //                     { type: "line-break"  , index: 0, value: ""},
                    //                     { type: "text"        , index: 2, value: secondPart},
                    //                 ...inputCollection.slice(elemIndex + 1, inputCollection.length)
                    //             ]);
                    //         }

                    //         if (elemIndex >= 0 && elemIndex < inputCollection.length - 1 && startPointSelection === textElemFocusNode.length) {
                    //             console.log("right (not last input)")
                    //             newInputCollection = [
                    //                 ...inputCollection.slice(0, elemIndex + 1),
                    //                 { type: "line-break"  , index: 0, value: ""},
                    //                 { type: "text"        , index: 2, value: ""},
                    //                 ...inputCollection.slice(elemIndex + 1, inputCollection.length)
                    //             ];
                    //         }

                    //         selection.removeAllRanges();
                    //         const result = newInputCollection.map((elem, newIndex) => {
                    //             const { type, value } = elem;
                    //             return { type: type, index: newIndex, value: value };
                    //         })
                    //         return [...result]
                    //     });
                    //     return
                    // }
                    if (e.key === "Backspace") {
                        сutTextMessage(editParams)
                    }

                    if (e.keyCode === 46) {
                        cutWithDeleteKey(editParams)
                    }
                    if (e.keyCode === 67) {
                        e.preventDefault()
                    }
                    if (e.keyCode === 13) {
                        e.preventDefault();

                        console.log(inputCollection);
                        // console.log(leftIndex, "left selection index position")  // selection index position
                        // console.log(rightIndex,"right selection index position")
                        // console.log(rangePositionLeft,"left selection symbol position") // selection symbol position
                        // console.log(rangePositionRight,"right selection symbol position")

                        // setInputCollection(prev => {
                        //     return [...prev]
                        // })

                        return
                    }
                }}

                onCut={e => {
                    const {
                        selection,
                        index,
                        focusNode,
                        anchorNode,
                        textElemFocusNode,
                        elemHasIndex,
                        startPointSelection,
                        endPointSelection,
                        focusNodeIndex,
                        anchorNodeIndex
                    } = getSelectProperties();
                    console.log(focusNode)
                    if (e.target !== inputContent.current || !focusNode) {
                        e.preventDefault()
                        return
                    }

                    const [leftIndex, rightIndex] = selectProperties.indexRange;
                    const [rangePositionLeft, rangePositionRight] = selectProperties.inputRange;
                    const focusElemLength = textElemFocusNode?.length;

                    const leftElemTextContent = getElementByIndex(leftIndex);
                    const rightElemTextContent = getElementByIndex(rightIndex);
                    const editParams = {
                        e,
                        selection,
                        focusNode,
                        anchorNode,
                        leftIndex,
                        rightIndex,
                        rangePositionLeft,
                        rangePositionRight,
                        inputCollection,
                        textElemFocusNode,
                        focusElemLength,
                        startPointSelection,
                        endPointSelection,
                        leftElemTextContent,
                        rightElemTextContent,
                        focusNodeIndex,
                        anchorNodeIndex,
                        selectProperties,
                        getSelectProperties,
                        setSelectProperties,
                        setInputCollection,
                        getElementByIndex
                    }
                    сutTextMessage(editParams)
                    console.log("cut")
                }}
                onPaste={() => {
                    console.log("paste")
                }}

                onSelect={e => {
                    e.preventDefault()
                    if (e.nativeEvent.which === 1) {
                        e.preventDefault()
                        return
                    }
                    selectHandler(e)
                }}

                onMouseDown={e => {
                    if (e.button === 2) {
                        e.preventDefault();
                        return
                    }
                    if (e.detail === 1) {
                        const { selection } = getSelectProperties();
                        selection.removeAllRanges();
                    }
                    if (e.detail === 3) {
                        selectPart();
                    }
                    if (e.detail === 4) {
                        selectAll({ getElementByIndex, inputCollection });
                    }
                    if (e.detail > 2) {
                        e.preventDefault();
                    }
                }}
            >
                {resultInput}
            </div>
        </div>
    )
}
