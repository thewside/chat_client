export const сutTextMessage = params => {
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

    if(inputCollection.length === 1 && focusElemLength === 0 ){
        e.preventDefault();
        if(e.repeat) e.preventDefault();
        return
    }

    const leftElemTextContent  = getElementByIndex(leftIndex);
    const rightElemTextContent = getElementByIndex(rightIndex);;
    let result = inputCollection;
    
    //del every emote/linebreak element on 0 position
    if( focusNodeIndex > 0 && 
        rangePositionLeft === 0 && 
        rangePositionRight === 0 &&
        focusElemLength > 0
        ){
            e.preventDefault();
            console.log("del before every emote/linebreak element")
            setInputCollection(() => {
                inputCollection.splice(leftIndex - 1, 2)
                result = inputCollection.map((element, newIndex) => {
                    const { type, index, value } = element;
                    if (leftIndex - 2 === index) {
                        return { type: type, index: newIndex, value: value + " " + textElemFocusNode }
                    }
                    return { type: type, index: newIndex, value: value };
                })
                return [...result]
            })

            const {index} = getSelectProperties();
            const previousElem = getElementByIndex(index - 2);
            setSelectProperties(prev=>{
                return {
                    ...prev,
                    indexAfterRemovalElement: index,            // || 0,
                    previousElemLength: previousElem?.length    // || 0
                }
            })
            selection.removeAllRanges();
    }

    if(leftIndex === rightIndex && focusElemLength === 0 && startPointSelection === 0) {
        console.log("delete empty before emote")
        setInputCollection(() => {
            result = [
                ...inputCollection.slice(0, focusNodeIndex - 1),
                ...inputCollection.slice(focusNodeIndex + 1, inputCollection.length)
            ]
            // inputCollection.slice(0, focusNodeIndex - 1)
            return [...result].map((e, newIndex) => {
                const { type, value } = e;
                return { type: type, index: newIndex, value: value }
            })
        })
        selection.removeAllRanges();
    }

    if(leftIndex === rightIndex && 
        focusElemLength === 0 && 
        startPointSelection === 1 && 
        endPointSelection === 0
        ) {
        console.log("delete empty before emote with select")
        setInputCollection(() => {
            let result = inputCollection;
            result = [
                ...inputCollection.slice(0, focusNodeIndex),
                ...inputCollection.slice(focusNodeIndex + 2, inputCollection.length)
            ]
            // // inputCollection.slice(0, focusNodeIndex - 1)
            return [...result].map((e, newIndex) => {
                const { type, value } = e;
                return { type: type, index: newIndex, value: value }
            })
        })
        selection.removeAllRanges();
    }

    // difference indexes and between words
    if(leftIndex !== rightIndex){
        e.preventDefault();
        console.log("another index and between words")
        const newContent = (leftElemTextContent?.textContent.slice(0, rangePositionLeft) || "") + 
        (rightElemTextContent?.textContent.slice(rangePositionRight, rightElemTextContent?.textContent.length) || "");
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

        const {index} = getSelectProperties();
        const previousElem = getElementByIndex(index);
        setSelectProperties(prev=>{
            return {
                ...prev,
                indexAfterRemovalElement: index,
                previousElemLength: previousElem?.length
            }
        })
    }

    if(leftIndex === rightIndex && 
        rangePositionRight === 0 && 
        rangePositionLeft === rightElemTextContent?.length){
        e.preventDefault();
        setInputCollection(() => {
            let result = inputCollection;
            result = [
                ...inputCollection.slice(0, leftIndex),
                    { type: "text", index: 0, value: ""},
                ...inputCollection.slice(rightIndex + 1, inputCollection.length)
            ]
            return [...result].map((e,newIndex)=>{
                const { type, value} = e;
                return { type: type, index: newIndex, value: value}
            })
        });

        selection.removeAllRanges();
    };

    if(leftIndex === rightIndex && 
        rangePositionLeft === 0 && 
        rangePositionRight === rightElemTextContent?.length){
        e.preventDefault();
        setInputCollection(() => {
            let result = inputCollection;
            result = [
                ...inputCollection.slice(0, leftIndex),
                    { type: "text", index: 0, value: ""},
                ...inputCollection.slice(rightIndex + 1, inputCollection.length)
            ]
            return [...result].map((e,newIndex)=>{
                const { type, value} = e;
                return { type: type, index: newIndex, value: value}
            })
        });

        selection.removeAllRanges();
    }
}