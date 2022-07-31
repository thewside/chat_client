import { getSelectProperties } from "./getSelectProperties";

export const selectPart = () => {
    const {selection, anchorNodeElem} = getSelectProperties("focusNode");
    const inputLength = anchorNodeElem.textContent.length;
    const range = new Range();
    selection.removeAllRanges();
    range.setStart(anchorNodeElem, 0);
    range.setEnd(anchorNodeElem, inputLength);
    selection.addRange(range);
}

export const selectAll = params => {
    const {getElementByIndex, inputCollection} = params;
    const { selection } = getSelectProperties("focusNode");
    const firstElem = getElementByIndex(0);
    const lastElem = getElementByIndex(inputCollection.length - 1);
    const range = new Range();
    selection.removeAllRanges();
    range.setStart(firstElem, 0);
    range.setEnd(lastElem, lastElem?.textContent?.length);
    selection.addRange(range);
}
