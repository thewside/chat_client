export const cutWithDeleteKey = async params => {
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
        focusNodeIndex,
        getSelectProperties,
        getElementByIndex,
        setSelectProperties,
        setInputCollection,
        selectProperties,
    } = params;

    let result = inputCollection;
    let leftElemTextContent = getElementByIndex(leftIndex);
    let rightElemTextContent = getElementByIndex(rightIndex);

    const getItemTypeByIndex = index => {
        return inputCollection[index].type
    }
    const typeElem = getItemTypeByIndex(leftIndex);
    if(typeElem === "emote") {
        leftElemTextContent = getElementByIndex(leftIndex + 1);
    }

console.log(rangePositionLeft)
console.log(focusElemLength)
console.log(leftElemTextContent);
console.log(rightElemTextContent)
console.log(selection)


    //del every emote/linebreak element on last position
    if (focusNodeIndex > 0 && 
        rangePositionLeft === 0 && 
        rangePositionRight === 0 &&
        focusElemLength > 0
        ) {
        e.preventDefault();
        console.log("del before every emote/linebreak element")
        const prevElem = getElementByIndex(focusNodeIndex);
        const nextElem = getElementByIndex(focusNodeIndex + 2);
        setInputCollection(() => {
            // const rightElemTextContent = getElementByIndex(rightIndex + 2)?.textContent || "";
            const newContent = (prevElem?.textContent || "") + (nextElem?.textContent || "");
            result = [
                ...inputCollection.slice(0, leftIndex),
                { type: "text", index: 0, value: newContent},
                ...inputCollection.slice(leftIndex + 3)
            ]
            return [...result].map((e, newIndex) => {
                const { type, value } = e;
                return { type: type, index: newIndex, value: value }
            })
        })

        const { index } = getSelectProperties();
        const previousElem = getElementByIndex(index);
        setSelectProperties(prev => {
            return {
                ...prev,
                indexAfterRemovalElement: index + 2,
                previousElemLength: previousElem?.length
            }
        })
        return
    };

    // rangePositionLeft === 0 &&
    // rangePositionRight === 0

    if(leftIndex === rightIndex && 
        rangePositionLeft === leftElemTextContent?.textContent?.length && 
        rangePositionRight === rightElemTextContent?.textContent?.length) {
        console.log("delete emote")
        let rightElemTextContent = getElementByIndex(rightIndex + 2);
        setInputCollection(() => {
            let result = inputCollection;
            result = [
                ...inputCollection.slice(0, focusNodeIndex),
                    { type: "text", index: 0, value: (leftElemTextContent?.textContent.slice(0, rangePositionLeft) || "") + (rightElemTextContent?.textContent.slice(0, rangePositionLeft) || "")},
                ...inputCollection.slice(focusNodeIndex + 3, inputCollection.length)
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
        rangePositionLeft === 0 && 
        rangePositionRight === 0
        ) {
        console.log("delete emote")
        setInputCollection(() => {
            let result = inputCollection;
            result = [
                ...inputCollection.slice(0, focusNodeIndex),
                ...inputCollection.slice(focusNodeIndex + 2, inputCollection.length)
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
        leftElemTextContent === 0 && 
        rightElemTextContent === 0
        ) {
        console.log("delete empty before emote")
        setInputCollection(() => {
            let result = inputCollection;
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

    if(leftIndex !== rightIndex){
        e.preventDefault();
        console.log("another index and between words");
        const newContent = (leftElemTextContent?.textContent.slice(0, rangePositionLeft) || "") + 
        (rightElemTextContent?.textContent.slice(rangePositionRight, rightElemTextContent?.textContent.length) || "");
        
        setInputCollection(() => {
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
                indexAfterRemovalElement: index,            // || 0,
                previousElemLength: previousElem?.length    // || 0
            }
        })
        return
    };

    if(rangePositionLeft === textElemFocusNode.length &&
        rangePositionRight === 0 && leftIndex !== rightIndex) {
        console.log("select right to left different ranges")
        setInputCollection(() => {
            const difference = rightIndex - leftIndex;
            const newValue = (leftElemTextContent?.textContent || "") + (rightElemTextContent?.textContent || "")
            result = [
                ...inputCollection.slice(0, focusNodeIndex),
                    { type: "text", index: 0, value: newValue},
                ...inputCollection.slice(focusNodeIndex + difference + 1, inputCollection.length)
            ]
            return [...result].map((e, newIndex) => {
                const { type, value } = e;
                return { type: type, index: newIndex, value: value }
            })
        })
        selection.removeAllRanges();
        return
    };

    // console.log(inputCollection) // all array

    // console.log(leftIndex,"left selection index position")  // selection index position
    // console.log(rightIndex,"right selection index position")

    // console.log(rangePositionLeft,"selection symbol position") // selection symbol position
    // console.log(rangePositionRight,"selection symbol position")

    // console.log(textElemFocusNode, "textElemFocusNode")
    // console.log(focusElemLength, "focusElemLength")

    // console.log(leftElemTextContent, "leftElemTextContent")
    // console.log(rightElemTextContent, "rightElemTextContent")
    
    // console.log(startPointSelection, "startPointSelection")
    // console.log(endPointSelection, "endPointSelection")

    // console.log(inputCollection.length , "inputCollection.length")
    // console.log(focusElemLength, "focusElemLength")
}