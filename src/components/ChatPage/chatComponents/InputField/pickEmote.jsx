import { getSelectProperties } from "./getSelectProperties";
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
     
    if (endPointSelection === 0 && focusNodeIndex === 0) {
        console.log("left (first input)")
        await setInputCollection(prev => {
            newInputCollection = ([
                ...inputCollection.slice(0, focusNodeIndex),
                { type: "text", index: 0, value: "" },
                { type: "emote", index: 1, value: emotesList.bm.src },
                { type: "text", index: 2, value: (rightElemTextContent?.textContent.slice(rangePositionRight, rightElemTextContent?.textContent.length) || "") },
                ...inputCollection.slice(focusNodeIndex + 1, inputCollection.length)
            ]);
            
            return [...newInputCollection].map((element, newIndex) => {
                const { type, value } = element;
                return { type: type, index: newIndex, value: value };
            })
        })
        
        const firstElem = getElementByIndex(focusNodeIndex);
        let text = firstElem?.textContent;
        if(text) firstElem.textContent = "";
        return
    };
    
    if (endPointSelection === 0 && focusNodeIndex > 0) {
        console.log("left (not first input)")
        await setInputCollection(()=>{
            newInputCollection = ([
                ...inputCollection.slice(0, focusNodeIndex),
                    { type: "text"  , index: 0, value: ""},
                    { type: "emote" , index: 1, value: emotesList.bm.src },
                    { type: "text"  , index: 2, value: (rightElemTextContent?.textContent.slice(rangePositionRight, rightElemTextContent?.textContent.length) || "")},
                ...inputCollection.slice(focusNodeIndex + 1, inputCollection.length)
            ]);
            return [...newInputCollection].map((element, newIndex) => {
                const { type, value } = element;
                return { type: type, index: newIndex, value: value };
            })
        })
        const firstElem = getElementByIndex(focusNodeIndex);
        let text = firstElem?.textContent;
        if(text) firstElem.textContent = "";
        return
    }

    if (focusNodeIndex === inputCollection.length - 1 && endPointSelection === textElemFocusNode?.length) {
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

    if (focusNodeIndex >= 0 && focusNodeIndex < inputCollection.length - 1 && endPointSelection === textElemFocusNode?.length) {
        console.log("right (not last input)")
        setInputCollection(() => {
            newInputCollection = [
                ...inputCollection.slice(0, focusNodeIndex + 1),
                { type: "emote", index: 0, value: emotesList.tf.src },
                { type: "text", index: 999, value: "" },
                ...inputCollection.slice(focusNodeIndex + 1, inputCollection.length)
            ];
            return [...newInputCollection].map((element, newIndex) => {
                const { type, value } = element;
                return { type: type, index: newIndex, value: value };
            });
        });
        return
    }

    if (endPointSelection > 0 && endPointSelection < textElemFocusNode?.length) {
        console.log("between (all)")
        setInputCollection(() => {
            newInputCollection = [
                ...inputCollection.slice(0, focusNodeIndex),
                { type: "text", index: 0, value: (leftElemTextContent?.textContent.slice(0, rangePositionLeft) || "") },
                { type: "emote", index: 1, value: emotesList.bm.src },
                { type: "text", index: 2, value: (rightElemTextContent?.textContent.slice(rangePositionRight, rightElemTextContent?.textContent.length) || "") },
                ...inputCollection.slice(focusNodeIndex + 1, inputCollection.length)
            ];
            return [...newInputCollection].map((element, newIndex) => {
                const { type, value } = element;
                return { type: type, index: newIndex, value: value };
            });
        });
    }

    if (endPointSelection === 0 && textElemFocusNode?.length === 0) {
        console.log("between emotes")
        setInputCollection(() => {
            const newIndex = Number(selection.anchorNode.parentElement.dataset.index);
            newInputCollection = [
                ...inputCollection.slice(0, newIndex),
                { type: "text", index: 999, value: "" },
                { type: "emote", index: 0, value: emotesList.tf.src },
                ...inputCollection.slice(newIndex, inputCollection.length)
            ];
            return [...newInputCollection].map((element, newIndex) => {
                const { type, value } = element;
                return { type: type, index: newIndex, value: value };
            });
        })
        const firstElem = getElementByIndex(focusNodeIndex);
        let text = firstElem?.textContent;
        if (text) firstElem.textContent = "";
        return
    }
}