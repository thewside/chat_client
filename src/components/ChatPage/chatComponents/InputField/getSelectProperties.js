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
    
    const extentSelection = Number(selection?.extentNode?.parentElement?.parentElement?.dataset?.index);

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
        extentSelection: extentSelection
    };
}