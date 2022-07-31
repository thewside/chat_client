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
    const rightElemTextContent = getElementByIndex(rightIndex);

    const leftElemTextContentFocusNode = getElementByIndex(focusNodeIndex);
    const rightElemTextContentFocusNode = getElementByIndex(focusNodeIndex - 2);
    
    //del every emote/linebreak element on 0 position
    if(focusNodeIndex > 0 && 
        rangePositionLeft === 0 && 
        rangePositionRight === 0 &&
        focusElemLength > 0
        ){
            e.preventDefault();
            console.log("del before every emote/linebreak element")
            setInputCollection(() => {
                let result = inputCollection;
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
    if(focusNodeIndex > 0 && focusElemLength === 0 && !textElemFocusNode) {
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

    // if(rangePositionLeft === textElemFocusNode.length &&
    //     rangePositionRight === 0 && leftIndex !== rightIndex) {

    // difference indexes and between words
    if(leftIndex !== rightIndex //&&
    //    rangePositionLeft > 0 && 
    //    rangePositionRight > 0 
       ){
        e.preventDefault();
        //left right more
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



    console.log(selection)
    console.log(inputCollection) // all array
    
    console.log(focusNodeIndex , "focusNodeIndex")
    console.log(anchorNodeIndex, "anchorNodeIndex")

    console.log(leftIndex ,"leftIndex  left  sel index pos")  // selection index position
    console.log(rightIndex,"rightIndex right sel index pos")

    console.log(rangePositionLeft, "rangePositionLeft  sel symb pos") // selection symbol position
    console.log(rangePositionRight,"rangePositionRight sel symb pos")

    console.log(textElemFocusNode, "textElemFocusNode")
    console.log(focusElemLength, "focusElemLength")

    console.log(leftElemTextContent, "leftElemTextContent")
    console.log(rightElemTextContent, "rightElemTextContent")
    
    console.log(startPointSelection, "startPointSelection")
    console.log(endPointSelection, "endPointSelection")

    console.log(inputCollection.length , "inputCollection.length")

    // if( leftIndex === rightIndex && 
    //     rangePositionLeft === rangePositionRight &&  
    //     rightElemTextContent.tagName === "BR"){
    //        e.preventDefault()
    // }

    // // if( leftIndex === inputCollection.length && 
    // //     rightIndex === inputCollection.length && 
    // //     rangePositionLeft === leftElemTextContent.textContent.length && 
    // //     rangePositionRight === rightElemTextContent.textContent.length){
    // //        e.preventDefault()
    // // }

    // //clear elem text when press if one symbol remains
    // if(inputCollection.length === 1 && focusElemLength === 0) {
    //     setInputCollection(()=>{
    //         inputCollection[0].value = ""
    //         return [...inputCollection]
    //     })
    // };

   

    // // ???
    // if(startPointSelection === 0 && leftIndex !== rightIndex) {
    //     e.preventDefault();
    //     console.log("del qwe");
    //     setInputCollection(() => {
    //         let result = inputCollection
    //         inputCollection.splice(indexElement - 1, 2)
    //         result = inputCollection.map((element, newIndex) => {
    //             const { type, index, value } = element;
    //             if (indexElement - 2 === index) {
    //                 return { type: type, index: newIndex, value: value + " " + textElemFocusNode }
    //             }
    //             return { type: type, index: newIndex, value: value };
    //         })
    //         return [...result]
    //     })
    //     const {index} = getSelectProperties();
    //     const previousElem = getElementByIndex(index - 2);
    //     setSelectProperties(prev=>{
    //         return {
    //             ...prev,
    //             indexAfterRemovalElement: index,            // || 0,
    //             previousElemLength: previousElem?.length    // || 0
    //         }
    //     })
    // }
    

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