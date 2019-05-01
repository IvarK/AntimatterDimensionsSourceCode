"use strict";

function setSelectionRange(el, pos) {
  const setSelection = pos.end && pos.end !== pos.start;
  let length = 0;
  const range = document.createRange();
  const it = domIterator(el)
    .select(Node.TEXT_NODE)
    .revisit(false);
  let next;
  let startindex;
  const start =
    pos.start > el.textContent.length ? el.textContent.length : pos.start;
  const end = pos.end > el.textContent.length ? el.textContent.length : pos.end;
  const atStart = pos.atStart;
  while ((next = it.next())) {
    const olen = length;
    length += next.textContent.length;
    // Set start point of selection
    const atLength = atStart ? length > start : length >= start;
    if (!startindex && atLength) {
      startindex = true;
      range.setStart(next, start - olen);
      if (!setSelection) {
        range.collapse(true);
        makeSelection(el, range);
        break;
      }
    }

    // Set end point of selection
    if (setSelection && length >= end) {
      range.setEnd(next, end - olen);
      makeSelection(el, range);
      break;
    }
  }
}

function getSelectionRange(el) {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;
  const indexes = {};
  const range = selection.getRangeAt(0);
  const clone = range.cloneRange();
  clone.selectNodeContents(el);
  clone.setEnd(range.endContainer, range.endOffset);
  indexes.end = clone.toString().length;
  clone.setStart(range.startContainer, range.startOffset);
  indexes.start = indexes.end - clone.toString().length;
  indexes.atStart = clone.startOffset === 0;
  indexes.commonAncestorContainer = clone.commonAncestorContainer;
  indexes.endContainer = clone.endContainer;
  indexes.startContainer = clone.startContainer;
  return indexes;
}

function makeSelection(el, range) {
  const selection = window.getSelection();
  el.focus();
  selection.removeAllRanges();
  selection.addRange(range);
}