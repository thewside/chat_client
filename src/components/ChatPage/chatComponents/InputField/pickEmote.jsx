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
export const pickEmote = params =>{
     //e.target - id emote, src, etc
     const {inputCollection, setInputCollection} = params;
     setInputCollection(() => {
        const {selection, focus, endPointSelection, elemHasIndex, index, textElemAnchorNode} = getSelectProperties();
        
        let newInputCollection;
        if (!elemHasIndex) {
            newInputCollection = ([
                ...inputCollection,
                    { type: "emote" , index: 0, value: emotesList.bm.src },
                    { type: "text"  , index: 1, value: ""},
            ]);
            selection.removeAllRanges();
            return newInputCollection.map((element, newIndex) => {
                const { type, value } = element;
                return { type: type, index: newIndex, value: value };
            })
        }

        const elemIndex = index;
        const caretPosition = endPointSelection;
        const firstPart = textElemAnchorNode?.substring(0, caretPosition);
        const secondPart = textElemAnchorNode?.slice(caretPosition);

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
        
        if (elemIndex === inputCollection.length - 1 && caretPosition === textElemAnchorNode.length) {
            console.log("right (last input)")
            newInputCollection = ([
                ...inputCollection,
                    { type: "emote" , index: 0, value: emotesList.bm.src },
                    { type: "text"  , index: 1, value: ""},
            ]);
        }

        if (elemIndex >= 0 && elemIndex < inputCollection.length - 1 && caretPosition === textElemAnchorNode.length) {
            console.log("right (not last input)")
            newInputCollection = [
                ...inputCollection.slice(0, elemIndex + 1),
                { type: "emote", index: 0, value: emotesList.tf.src },
                { type: "text",  index: 999, value: "" },
                ...inputCollection.slice(elemIndex + 1, inputCollection.length)
            ];
        }

        if (caretPosition > 0 && caretPosition < textElemAnchorNode.length) {
            console.log("between (all)")
            newInputCollection = [
                ...inputCollection.slice(0, elemIndex),
                    { type: "text"  , index: 0, value: firstPart},
                    { type: "emote" , index: 1, value: emotesList.bm.src },
                    { type: "text"  , index: 2, value: secondPart},
                ...inputCollection.slice(elemIndex + 1, inputCollection.length)
            ];
        }
        if(caretPosition === 0 && textElemAnchorNode.length === 0){
            console.log("between emotes")
            selection.anchorNode.textContent = "";
            const newIndex = Number(selection.anchorNode.parentElement.dataset.index);
            newInputCollection = [
                ...inputCollection.slice(0, newIndex),
                { type: "text",  index: 999, value: "" },
                { type: "emote", index: 0, value: emotesList.tf.src },
                ...inputCollection.slice(newIndex, inputCollection.length)
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
}