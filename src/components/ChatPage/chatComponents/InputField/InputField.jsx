import { useState, useEffect, useRef, useMemo } from "react";
import { renderInputCollection } from "./renderInput";
import { getSelectProperties } from "./getSelectProperties";
import { useCallback } from "react";
import { pickEmote } from "./pickEmote";
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
        { type: "text"        , index: 0, value: "123456789056222222222222222222222222222222222222222222222222222222222227890" },
        { type: "line-break"  , index: 1, value: "" },
        { type: "text"        , index: 2, value: "qwe" },
        { type: "emote"       , index: 3, value: emotesList.bm.src },
        { type: "text"        , index: 4, value: "-uityi" },
        { type: "emote"       , index: 5, value: emotesList.bm.src },
        { type: "text"        , index: 6, value: "z" },
    ]);
    
    const [selectProperties, setSelectProperties] = useState({
        selectedInput: null,
        indexAfterRemovalElement: 0,
        previousElemLength:       0,
        inputRange: [],
        indexRange: [],
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
            range.setStart(inputWhichShouldBeSelect, startSelectionElemLength);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            sel.removeAllRanges();
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputCollection, setInputCollection]);

    const resultInput = useMemo(()=> renderInputCollection(inputCollection), [inputCollection]);
    
    useEffect(()=>{
        // console.log(selectProperties.indexRange)
        // console.log(selectProperties.inputRange)
    }, [selectProperties]);

    const selectHandler = useCallback(() => {
        const { extentSelection, index, startPointSelection, endPointSelection } = getSelectProperties("anchorNode");
        // if(startPointSelection === endPointSelection) return
        const sortIndex = [index, extentSelection].sort((a, b) => a - b);
        let sortRanges;
        if (sortIndex[0] === index) {
            sortRanges = [endPointSelection, startPointSelection];
        };
        if (sortIndex[1] === index) {
            sortRanges = [startPointSelection, endPointSelection];
        };
        setSelectProperties(prev => {
            return {
                ...prev,
                indexRange: sortIndex ,
                inputRange: sortRanges
            }
        })
    }, []);


    useEffect(()=>{
        window.addEventListener("mouseup", selectHandler);
        return () => window.removeEventListener("mouseup", selectHandler);
    }, [])

    return (
        <div>
            <div>
                <img
                    style={{width:"50px", height: "50px"}}
                    onClick={e =>{
                        pickEmote(inputCollection, setInputCollection); // create emote changer
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
                    onSelect={ e =>{
                        if(e.nativeEvent.which === 1) return e.preventDefault()
                        selectHandler()
                    }}
                    onKeyDown={e => {
                        const {selection, index, textElem, elemHasIndex, startPointSelection, endPointSelection} = getSelectProperties("focusNode");
                        const leftIndex  = selectProperties.indexRange[0];
                        const rightIndex = selectProperties.indexRange[1];
                        const rangePositionLeft  = selectProperties?.inputRange[0];
                        const rangePositionRight = selectProperties?.inputRange[1];
                        const leftElemTextContent = getElementByIndex(leftIndex);
                        const indexElement = index;
                        const focusElemLength = textElem?.length;
                        const rightElemTextContent = getElementByIndex(rightIndex);

                        if(e.repeat) {
                            return stopRepeating(startPointSelection, leftElemTextContent, e, e.keyCode)
                        }

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
                                    const { type, value } = elem;
                                    return { type: type, index: newIndex, value: value };
                                })
                                return [...result]
                            });
                            return
                        }
                        if(e.key === "ArrowLeft" || e.key === "ArrowUp"|| e.key === "ArrowDown") {
                            if(startPointSelection === 0) {
                                e.preventDefault();
                            }
                        }
                        if(e.key === "ArrowRight" || e.key === "ArrowUp"|| e.key === "ArrowDown") {
                            if(startPointSelection === leftElemTextContent.length) {
                                e.preventDefault();
                            }
                        }
                        if (e.key === "Backspace") {
                            console.log(leftIndex)
                            console.log(rightIndex)
                            console.log(rangePositionLeft)
                            console.log(rangePositionRight)

                            if(leftIndex === 0 && rightIndex === 0 && 
                                rangePositionLeft === 0 && rangePositionRight === 0){
                                   e.preventDefault()
                            }

                            // if(leftIndex === inputCollection.length && rightIndex === inputCollection.length && 
                            //     rangePositionLeft === leftElemTextContent.textContent.length && rangePositionRight === rightElemTextContent.textContent.length){
                            //        e.preventDefault()
                            // }

                            if(leftIndex > 0 && rightIndex > 0 && 
                                rangePositionLeft === 0 && rangePositionRight === 0){
                                    e.preventDefault();
                                    console.log("del from right side")
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
                                            indexAfterRemovalElement: index,            // || 0,
                                            previousElemLength: previousElem?.length    // || 0
                                        }
                                    })
                            }
                            if(inputCollection.length === 1 && focusElemLength === 0) {
                                setInputCollection(()=>{
                                    inputCollection[0].value = ""
                                    return [...inputCollection]
                                })
                            };

                            if(startPointSelection === 0 && leftIndex !== rightIndex) {
                                e.preventDefault();
                                console.log("del qwe");
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
                                        indexAfterRemovalElement: index,            // || 0,
                                        previousElemLength: previousElem?.length    // || 0
                                    }
                                })
                            }

                            if(leftIndex !== rightIndex){
                                e.preventDefault();
                                const newContent = leftElemTextContent?.textContent.slice(0, rangePositionLeft) + 
                                rightElemTextContent?.textContent.slice(rangePositionRight, rightElemTextContent.textContent.length);
                                setInputCollection(() => {
                                    let result = inputCollection;
                                    result = [
                                        ...inputCollection.slice(0, leftIndex),
                                            { type: "text", index: 0, value: newContent},
                                        ...inputCollection.slice(rightIndex + 1, inputCollection.length)
                                    ]
                                    return [...result].map((e,newIndex)=>{
                                        const { type, value} = e;
                                        return { type: type, index: newIndex, value: value}
                                    })
                                })
                                selection.removeAllRanges();
                            }
                            if(leftIndex === rightIndex && rangePositionLeft === 0 && rangePositionRight === rightElemTextContent.length){
                                e.preventDefault();
                                console.log("select all on element (right to left)")
                                console.log(leftIndex, "leftindex")

                                // inputSelected.current = true;
                                
                                // const rightElemTextContent = getElementByIndex(rightIndex + 2);
                                // const newContent = leftElemTextContent.textContent + rightElemTextContent?.textContent;
                                // setInputCollection(() => {
                                //     let result = inputCollection;
                                //     result = [
                                //         ...inputCollection.slice(0, leftIndex + 1),
                                //             { type: "text", index: 0, value: rightElemTextContent.textContent || ""},
                                //         ...inputCollection.slice(rightIndex + 3, inputCollection.length)
                                //     ]
                                //     return [...result].map((e,newIndex)=>{
                                //         const { type, value} = e;
                                //         return { type: type, index: newIndex, value: value}
                                //     })
                                // })
                                setInputCollection(() => {
                                    let result = inputCollection;
                                    result = [
                                        ...inputCollection.slice(0, leftIndex),
                                            { type: "text", index: 0, value: ""},
                                        ...inputCollection.slice(rightIndex + 1, inputCollection.length)
                                    ]
                                    return [...result]
                                    // .map((e,newIndex)=>{
                                    //     const { type, value} = e;
                                    //     return { type: type, index: newIndex, value: value}
                                    // })
                                })
                                selection.removeAllRanges();
                            }
                        }
                        
                        if(e.key === "Enter"){
                            e.preventDefault()
                            console.log(inputCollection);
                            return
                        }
                    }}

                    onClick={e => {
                        const datasetType = e.target.dataset.type || e.target.parentElement.dataset.type;
                        if (datasetType === "emote") {
                            e.preventDefault();
                            return
                        }
                        const { index } = getSelectProperties("focusNode")
                        if (selectProperties.selectedInput !== index) {
                            console.log("yes")
                            setSelectProperties(() => {
                                return {
                                    ...selectProperties,
                                    selectedInput: null
                                }
                            })
                        }
                    }}

                    onDoubleClick={e=>{
                        e.preventDefault();
                        const datasetType = e.target.dataset.type || e.target.parentElement.dataset.type;
                        if(datasetType === "emote") {
                            e.preventDefault();
                            return
                        }
                        const firstIndex = selectProperties.indexRange[0];
                        const firstElem = getElementByIndex(0);
                        const leftElem = getElementByIndex(firstIndex);
                        const lastElem = getElementByIndex(inputCollection.length - 1);
                        const range = new Range();
                        const {selection, index} = getSelectProperties("focusNode")

                        console.log(selectProperties.selectedInput);
                        console.log(index);

                        if (selectProperties.selectedInput === index &&
                            selection.focusOffset === leftElem.textContent.length) {

                            selection.removeAllRanges();
                            range.setStart(firstElem, 0);
                            range.setEnd(lastElem, lastElem.textContent.length);
                            selection.addRange(range);
                            console.log("double click select all ");
                            return
                        };
                        
                        if (selection.focusOffset === leftElem.textContent.length) {

                            selection.removeAllRanges();
                            range.setStart(leftElem, 0);
                            range.setEnd(leftElem, leftElem.textContent.length);
                            selection.addRange(range);
                            console.log("double click select part")
                                
                            setSelectProperties(()=>{
                                return {...selectProperties,
                                    selectedInput: index
                                }
                            })
                            
                            return
                        }
                    }}
                >
                    {resultInput}
                </div>
            </div>
        </div>
    )
}
