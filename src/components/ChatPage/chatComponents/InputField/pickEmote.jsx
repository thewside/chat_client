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
export const pickEmote = async (params) => {



    //e.target - id emote, src, etc
    const {
        e,
        selection,
        focusNode,
        leftIndex,
        rightIndex,
        rangePositionLeft,
        rangePositionRight,
        inputCollection,
        elemHasIndex,

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

    let newInputCollection = inputCollection;
    const leftElemTextContent = getElementByIndex(leftIndex);
    const rightElemTextContent = getElementByIndex(rightIndex);

    console.log(selectProperties)
    console.log(leftIndex);
    console.log(rightIndex);
    console.log(rangePositionLeft);
    console.log(rangePositionRight);
    console.log(leftIndex === focusNodeIndex)

    if(isNaN(focusNodeIndex)){
        await setInputCollection(() => {
            newInputCollection = ([
                ...inputCollection,
                { type: "emote", index: 0, value: emotesList.bm.src },
                { type: "text", index: 1, value: "" },
            ]);
            return [...newInputCollection].map((element, newIndex) => {
                const { type, value } = element;
                return { type: type, index: newIndex, value: value };
            });
        });
        
        const lastElement = getElementByIndex(inputCollection.length - 1)
        if(!lastElement) return
        const range = document.createRange();
        range.setStart(lastElement, lastElement?.length);
        selection.removeAllRanges();
        selection.addRange(range);
        return
    }

    if (leftIndex === 0 &&
        rangePositionLeft === 0 && 
        rangePositionRight === 0
        ){
        console.log("left (first input)")
        await setInputCollection(prev => {
            newInputCollection = ([
                ...inputCollection.slice(0, leftIndex),
                { type: "text", index: 0, value: "" },
                { type: "emote", index: 1, value: emotesList.bm.src },
                { type: "text", index: 2, value: (rightElemTextContent?.textContent.slice(rangePositionRight, rightElemTextContent?.textContent.length) || "") },
                ...inputCollection.slice(leftIndex + 1, inputCollection.length)
            ]);
            
            return [...newInputCollection].map((element, newIndex) => {
                const { type, value } = element;
                return { type: type, index: newIndex, value: value };
            })
        })
        
        const firstElem = getElementByIndex(leftIndex);
        let text = firstElem?.textContent;
        if(text) firstElem.textContent = "";
        return
    };

    if (leftIndex > 0 &&
        rangePositionLeft === 0 && 
        rangePositionRight === 0
        ){
        console.log("left (not first input)")
        await setInputCollection(()=>{
            newInputCollection = ([
                ...inputCollection.slice(0, leftIndex),
                    { type: "text"  , index: 0, value: ""},
                    { type: "emote" , index: 1, value: emotesList.bm.src },
                    { type: "text"  , index: 2, value: (rightElemTextContent?.textContent.slice(rangePositionRight, rightElemTextContent?.textContent.length) || "")},
                ...inputCollection.slice(leftIndex + 1, inputCollection.length)
            ]);
            return [...newInputCollection].map((element, newIndex) => {
                const { type, value } = element;
                return { type: type, index: newIndex, value: value };
            })
        })
        const firstElem = getElementByIndex(leftIndex);
        let text = firstElem?.textContent;
        if(text) firstElem.textContent = "";
        return
    }

    if (leftIndex === inputCollection.length - 1 && 
        rangePositionRight === rightElemTextContent?.textContent?.length
        ) {
        console.log("right (last input)")
        setInputCollection(() => {
            newInputCollection = ([
                ...inputCollection,
                { type: "emote", index: 0, value: emotesList.bm.src },
                { type: "text", index: 1, value: "" },
            ]);
            return [...newInputCollection].map((element, newIndex) => {
                const { type, value } = element;
                return { type: type, index: newIndex, value: value };
            });
        });
        return
    }

    if (leftIndex >= 0 && 
        leftIndex < inputCollection.length - 1 && 
        rangePositionRight === rightElemTextContent?.textContent?.length) {
        console.log("right (not last input)")
        setInputCollection(() => {
            newInputCollection = [
                ...inputCollection.slice(0, leftIndex + 1),
                { type: "emote", index: 0, value: emotesList.tf.src },
                { type: "text", index: 999, value: "" },
                ...inputCollection.slice(leftIndex + 1, inputCollection.length)
            ];
            return [...newInputCollection].map((element, newIndex) => {
                const { type, value } = element;
                return { type: type, index: newIndex, value: value };
            });
            
        });
        const firstElem = getElementByIndex(leftIndex + 2);
        let text = firstElem?.textContent;
        if(text) firstElem.textContent = "";
        return
    }

    if (rangePositionLeft > 0 && rangePositionRight < rightElemTextContent?.textContent?.length) {
        console.log("between (all)")
        //fix  split one itemElement and several itemElements
        await setInputCollection(() => {
            newInputCollection = [
                ...inputCollection.slice(0, leftIndex),
                { type: "text", index: 0, value: (leftElemTextContent?.textContent.slice(0, rangePositionLeft) || "") },
                { type: "emote", index: 1, value: emotesList.bm.src },
                { type: "text", index: 2, value: (rightElemTextContent?.textContent.slice(rangePositionRight, rightElemTextContent?.textContent.length) || "") },
                ...inputCollection.slice(leftIndex + 1, inputCollection.length)
            ];
            return [...newInputCollection].map((element, newIndex) => {
                const { type, value } = element;
                return { type: type, index: newIndex, value: value };
            });
        });

        //need fix
        selection.removeAllRanges();
        //rememb pos and clear left element 
    }

    // if (endPointSelection === 0 && textElemFocusNode?.length === 0) {
    //     console.log("between emotes")
    //     setInputCollection(() => {
    //         const newIndex = Number(selection.anchorNode.parentElement.dataset.index);
    //         newInputCollection = [
    //             ...inputCollection.slice(0, newIndex),
    //             { type: "text", index: 999, value: "" },
    //             { type: "emote", index: 0, value: emotesList.tf.src },
    //             ...inputCollection.slice(newIndex, inputCollection.length)
    //         ];
    //         return [...newInputCollection].map((element, newIndex) => {
    //             const { type, value } = element;
    //             return { type: type, index: newIndex, value: value };
    //         });
    //     })
    //     const firstElem = getElementByIndex(leftIndex);
    //     let text = firstElem?.textContent;
    //     if (text) firstElem.textContent = "";
    //     return
    // }

    

}