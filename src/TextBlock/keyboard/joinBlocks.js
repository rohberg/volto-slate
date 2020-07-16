import { serializeNodesToText } from 'volto-slate/editor/render';
import { Editor } from 'slate';
import {
  // isCursorInList,
  getPreviousVoltoBlock,
  getNextVoltoBlock,
  isCursorAtBlockStart,
  isCursorAtBlockEnd,
  mergeSlateWithBlockBackward,
  mergeSlateWithBlockForward,
} from 'volto-slate/utils';

export function joinWithPreviousBlock({ editor, event }) {
  // TODO: read block values not from editor properties, but from block
  // properties

  if (!isCursorAtBlockStart(editor)) return;
  const blockProps = editor.getBlockProps();
  const {
    block,
    index,
    properties,
    saveSlateBlockSelection,
    onChangeBlock,
    onDeleteBlock,
    onSelectBlock,
  } = blockProps;

  const [otherBlock = {}, otherBlockId] = getPreviousVoltoBlock(
    index,
    properties,
  );

  if (otherBlock['@type'] !== 'slate') return;

  event.stopPropagation();
  event.preventDefault();

  mergeSlateWithBlockBackward(editor, otherBlock);

  const selection = JSON.parse(JSON.stringify(editor.selection));
  const combined = JSON.parse(JSON.stringify(editor.children));

  // TODO: don't remove undo history, etc
  // Should probably save both undo histories, so that the blocks are split,
  // the undos can be restored??
  // TODO: after Enter, the current filled-with-previous-block
  // block is visible for a fraction of second

  const cursor = getBlockEndAsRange(otherBlock, selection);
  console.log('cursor', cursor, combined);
  saveSlateBlockSelection(otherBlockId, cursor);

  // setTimeout ensures setState has been successfully executed in Form.jsx.
  // See https://github.com/plone/volto/issues/1519
  setTimeout(() => {
    onChangeBlock(otherBlockId, {
      '@type': 'slate',
      value: combined,
      plaintext: serializeNodesToText(combined || []),
    });
    setTimeout(() => {
      onDeleteBlock(block, false);
      onSelectBlock(otherBlockId);
    }, 100);
  });

  return true;
}

export function joinWithNextBlock({ editor, event }) {
  //   getNextBlock,
  //   getBlockStartAsRange,
  //   isCursorAtBlockEnd,
  //   mergeSlateWithBlockForward,
  // TODO: read block values not from editor properties, but from block
  // properties

  if (!isCursorAtBlockEnd(editor)) return;

  const blockProps = editor.getBlockProps();
  const {
    block,
    index,
    properties,
    saveSlateBlockSelection,
    onChangeBlock,
    onDeleteBlock,
    onSelectBlock,
  } = blockProps;

  const [otherBlock = {}, otherBlockId] = getNextVoltoBlock(index, properties);

  if (otherBlock['@type'] !== 'slate') return;

  event.stopPropagation();
  event.preventDefault();

  mergeSlateWithBlockForward(editor, otherBlock);

  const selection = JSON.parse(JSON.stringify(editor.selection));
  const combined = JSON.parse(JSON.stringify(editor.children));

  // TODO: don't remove undo history, etc
  // Should probably save both undo histories, so that the blocks are split,
  // the undos can be restored??
  // TODO: after Enter, the current filled-with-previous-block
  // block is visible for a fraction of second

  const cursor = getBlockStartAsRange(otherBlock, selection);
  console.log('cursor', cursor, combined);
  saveSlateBlockSelection(otherBlockId, cursor);

  // setTimeout ensures setState has been successfully executed in Form.jsx.
  // See https://github.com/plone/volto/issues/1519
  setTimeout(() => {
    onChangeBlock(otherBlockId, {
      '@type': 'slate',
      value: combined,
      plaintext: serializeNodesToText(combined || []),
    });
    setTimeout(() => {
      onDeleteBlock(block, false);
      onSelectBlock(otherBlockId);
    });
  });

  return true;
}

/*
 * Join current block with neighbor block, if the blocks are compatible.
 */
export function joinWithNeighborBlock(
  getNeighborVoltoBlock,
  getCursorPosition,
  isValidOp,
  mergeOp,
) {
  return ({ editor, event }) => {
    // TODO: read block values not from editor properties, but from block
    // properties
    const blockProps = editor.getBlockProps();
    const {
      block,
      index,
      properties,
      saveSlateBlockSelection,
      onChangeBlock,
      onDeleteBlock,
      onSelectBlock,
    } = blockProps;

    const [otherBlock = {}, otherBlockId] = getNeighborVoltoBlock(
      index,
      properties,
    );

    if (!isValidOp(editor)) return;

    if (otherBlock['@type'] !== 'slate') return;

    event.stopPropagation();
    event.preventDefault();

    mergeOp(editor, otherBlock);

    const selection = JSON.parse(JSON.stringify(editor.selection));
    const combined = JSON.parse(JSON.stringify(editor.children));

    // TODO: don't remove undo history, etc
    // Should probably save both undo histories, so that the blocks are split,
    // the undos can be restored??
    // TODO: after Enter, the current filled-with-previous-block
    // block is visible for a fraction of second

    const cursor = getCursorPosition(otherBlock, selection);
    console.log('cursor', cursor, combined);
    saveSlateBlockSelection(otherBlockId, cursor);

    // setTimeout ensures setState has been successfully executed in Form.jsx.
    // See https://github.com/plone/volto/issues/1519
    setTimeout(() => {
      onChangeBlock(otherBlockId, {
        '@type': 'slate',
        value: combined,
        plaintext: serializeNodesToText(combined || []),
      });
      setTimeout(() => {
        onDeleteBlock(block, false);
        onSelectBlock(otherBlockId);
      });
    });

    return true;
  };
}

function getBlockEndAsRange(block, selection) {
  const { value } = block;
  const location = [value.length - 1];
  const editor = { children: value };
  const path = Editor.last(editor, location)[1];
  const [leaf, leafpath] = Editor.leaf(editor, path);
  const offset = (leaf.text || '').length;
  return {
    anchor: { path: leafpath, offset },
    focus: { path: leafpath, offset },
  };
}

function getBlockStartAsRange(block, selection) {
  return selection;
}

// export const joinWithPreviousBlock = joinWithNeighborBlock(
// getPreviousBlock,
// getBlockEndAsRange,
// isCursorAtBlockStart,
// mergeSlateWithBlockBackward,
//   getPreviousBlock,
//   getBlockEndAsRange,
//   isCursorAtBlockStart,
//   mergeSlateWithBlockBackward,
// );
//
// export const joinWithNextBlock = joinWithNeighborBlock(
//   getNextBlock,
//   getBlockStartAsRange,
//   isCursorAtBlockEnd,
//   mergeSlateWithBlockForward,
// );
