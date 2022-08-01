export const addLinebreak = params  => {
    const {
        e,
        selection,
        focusNode,
        leftIndex,
        rightIndex,
        rangePositionLeft,
        rangePositionRight,
        inputCollection,
        textElemFocusNode,
        focusElemLength,
        startPointSelection,
        endPointSelection,
        getSelectProperties,
        getElementByIndex,
        setSelectProperties,
        setInputCollection,
        focusNodeIndex,
        anchorNodeIndex,
        selectProperties,
    } = params;
    


    const leftElemTextContent  = getElementByIndex(leftIndex);
    const rightElemTextContent = getElementByIndex(rightIndex);
    
    let newInputCollection = inputCollection;
    if (startPointSelection > 0 && startPointSelection < textElemFocusNode.length) {
        console.log("between (all)")
        setInputCollection(() => {
            newInputCollection = [
                ...inputCollection.slice(0, focusNodeIndex),
                    { type: "text"      , index: 0, value: (leftElemTextContent?.textContent.slice(0, rangePositionLeft) || "")},
                    { type: "line-break", index: 1, value: ""},
                    { type: "text"      , index: 2, value: (rightElemTextContent?.textContent.slice(rangePositionRight, rightElemTextContent?.textContent.length) || "")},
                ...inputCollection.slice(focusNodeIndex + 1, inputCollection.length)
            ];
            return [...newInputCollection].map((elem, newIndex) => {
                const { type, value } = elem;
                return { type: type, index: newIndex, value: value };
            })
        })
    }

    if(startPointSelection === textElemFocusNode.length && focusNodeIndex === inputCollection.length - 1) {
        console.log("right (last input)")
        setInputCollection(() => {
            newInputCollection = [...inputCollection,
                { type: "line-break" , index: 0, value: "" },
                { type: "text"  , index: 1, value: ""}
            ]
            return [...newInputCollection].map((elem, newIndex) => {
                const { type, value } = elem;
                return { type: type, index: newIndex, value: value };
            })
        })
    }

    if(startPointSelection === 0 && focusNodeIndex >= 0){
        console.log("left")
        e.preventDefault();
        setInputCollection(() => {
            newInputCollection= ([
                ...inputCollection.slice(0, focusNodeIndex),
                    { type: "text"  , index: 0, value: ""},
                    { type: "line-break" , index: 1, value: ""  },
                    { type: "text"  , index: 2, value: (rightElemTextContent?.textContent.slice(rangePositionRight, rightElemTextContent?.textContent.length) || "")},
                ...inputCollection.slice(focusNodeIndex + 1, inputCollection.length)
            ]);
            return [...newInputCollection].map((elem, newIndex) => {
                const { type, value } = elem;
                return { type: type, index: newIndex, value: value };
            })
        })
    }

    if(startPointSelection === textElemFocusNode.length && focusNodeIndex >= 0){
        console.log("left")
        e.preventDefault();
        setInputCollection(() => {
            newInputCollection= ([
                ...inputCollection.slice(0, focusNodeIndex),
                    { type: "text"  , index: 0, value: (leftElemTextContent?.textContent.slice(0, rangePositionLeft) || "")},
                    { type: "line-break" , index: 1, value: ""  },
                    { type: "text"  , index: 2, value: ""},
                ...inputCollection.slice(focusNodeIndex + 1, inputCollection.length)
            ]);
            return [...newInputCollection].map((elem, newIndex) => {
                const { type, value } = elem;
                return { type: type, index: newIndex, value: value };
            })
        })
    }
}