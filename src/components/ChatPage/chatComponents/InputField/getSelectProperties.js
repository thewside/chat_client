export const getSelectProperties = nodeType => {
    const selection = window.getSelection();
    const focus = selection[nodeType]; //focusNode, extentNode, anchorNode
    const elemHasIndex = focus?.parentElement?.parentElement?.dataset.index || focus?.parentElement?.dataset.index;
    const index = Number(elemHasIndex);
    const inputElement = focus?.parentElement;
    const inputElementContainer = focus?.parentElement?.parentElement;
    const mainContainer = inputElementContainer?.parentElement;
    const textElem = focus?.textContent;
    const startPointSelection = selection.focusOffset;
    const endPointSelection = selection.anchorOffset;
    let extentSelection = Number(selection?.focusNode?.parentElement?.parentElement?.dataset?.index);
    if(isNaN(extentSelection)){
        extentSelection = index
    }
    const emoteElement = focus?.dataset?.type === "emote";
    const emoteIndex = Number(focus?.dataset?.index);
    return {
        selection: selection, 
        focus: focus, 
        index: index,
        elemHasIndex:elemHasIndex,
        inputElement: inputElement,
        inputElementContainer: inputElementContainer,
        startPointSelection: startPointSelection, 
        endPointSelection: endPointSelection,
        textElem: textElem,
        mainContainer: mainContainer,
        extentSelection: extentSelection,
        emoteElement: emoteElement,
        emoteIndex:emoteIndex
    };
}