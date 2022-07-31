export const rewrite = params => {
    const {
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
    if (e.keyCode > 0 && e.keyCode < 8){
        e.preventDefault();
        return
    }
    if (e.keyCode > 8 && e.keyCode < 32){
        e.preventDefault();
        return
    }
    if (e.keyCode > 32 && e.keyCode < 37){
        e.preventDefault();
        return
    }
    if (e.keyCode > 36 && e.keyCode < 41){
        return
    }
    if (e.keyCode > 39 && e.keyCode < 47){
        return
    }
    if (e.keyCode > 90 && e.keyCode < 96){
        e.preventDefault();
        return
    }
    if (e.keyCode > 111 && e.keyCode < 184){
            e.preventDefault();
            return
    }

    if(leftIndex !== rightIndex ){
        e.preventDefault();
        //left right more
        console.log("another index and between words")
        const newContent = (leftElemTextContent?.textContent.slice(0, rangePositionLeft) || "") + e.key +
        (rightElemTextContent?.textContent.slice(rangePositionRight, rightElemTextContent?.textContent.length) || "");
        setInputCollection(() => {
            let result = inputCollection;
            result = [
                ...inputCollection.slice(0, leftIndex),
                    { type: "text", index: 0, value: newContent  },
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
            console.log(prev)
            return {
                ...prev,
                indexRange: [0, 0],
                inputRange: [0, 0],
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

}