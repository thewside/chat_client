export const getSelectProperties = () => {
    const selection = window.getSelection();
    const focusNode = selection.focusNode;
    const anchorNode = selection.anchorNode;
    const inputElement = focusNode?.parentElement;
    const inputElementContainer = focusNode?.parentElement?.parentElement;
    const textElemFocusNode = selection.focusNode?.textContent;
    const textElemAnchorNode = selection.anchorNode?.textContent;
    const focusElemType  = selection.focusNode?.dataset?.type;
    const anchorElemType = selection.anchorNode?.dataset?.type;
    const focusNodeIndex  = Number(
        selection?.focusNode?.parentElement?.parentElement?.dataset?.index || 
        selection?.focusNode?.parentElement?.dataset?.index||
        selection?.focusNode?.dataset?.index
        );
    const anchorNodeIndex = Number(
        selection?.anchorNode?.parentElement?.parentElement?.dataset?.index || 
        selection?.anchorNode?.parentElement?.dataset?.index ||
        selection?.anchorNode?.dataset?.index);
    const startPointSelection = selection.focusOffset;
    const endPointSelection = selection.anchorOffset;
    const anchorNodeElem = selection.anchorNode;
    const focusNodeElem  = selection.focusNode;
    return {
        selection: selection, 
        focusNode: focusNode, 
        anchorNode: anchorNode,
        index: anchorNodeIndex,
        elemHasIndex: toString(anchorNodeIndex),
        inputElement: inputElement,
        inputElementContainer: inputElementContainer,
        startPointSelection: startPointSelection, 
        endPointSelection: endPointSelection,
        textElemFocusNode: textElemFocusNode,
        textElemAnchorNode:textElemAnchorNode,
        focusElemType: focusElemType,
        anchorElemType: anchorElemType,
        anchorNodeElem: anchorNodeElem,
        focusNodeElem: focusNodeElem,
        focusNodeIndex: focusNodeIndex,
        anchorNodeIndex: anchorNodeIndex,
    };
}