import { toggleList, unwrapList } from './utils';
import { isBlockActive } from 'volto-slate/utils';
import { Editor } from 'slate';

/**
 * Uses the old toggleList function to toggle lists on or off or from a type to another.
 * @param {Editor} editor The editor to which to apply the change.
 * @param {string} format A list type.
 */
export const localToggleList = (editor, format) => {
  toggleList(editor, {
    typeList: format,
    isBulletedActive: !!isBlockActive(editor, 'ul'),
    isNumberedActive: !!isBlockActive(editor, 'ol'),
  });
};

/**
 * @summary Turns off any list type.
 * @param {Editor} editor The editor to which to apply the change.
 * @returns The result of the inner call to the function `unwrapList`.
 */
const preFormat = (editor) => {
  return unwrapList(editor, false, {
    unwrapFromList: false,
  });
};

/**
 * The autoformat rules created by this plugin for the Markdown language.
 */
export const autoformatRules = [
  {
    type: 'h2',
    markup: '#',
    // preFormat,
  },
  {
    type: 'h3',
    markup: '##',
    // preFormat,
  },
  {
    type: 'li',
    markup: ['*', '-', '+'],
    preFormat,
    format: (editor) => {
      localToggleList(editor, 'ul');
    },
  },
  {
    type: 'li',
    markup: ['1.', '1)'],
    preFormat,
    format: (editor) => {
      localToggleList(editor, 'ol');
    },
  },
  {
    type: 'blockquote',
    markup: ['>'],
    // preFormat,
  },
  {
    type: 'bold',
    between: ['**', '**'],
    mode: 'inline',
    insertTrigger: true,
  },
  {
    type: 'bold',
    between: ['__', '__'],
    mode: 'inline',
    insertTrigger: true,
  },
  {
    type: 'italic',
    between: ['*', '*'],
    mode: 'inline',
    insertTrigger: true,
  },
  {
    type: 'italic',
    between: ['_', '_'],
    mode: 'inline',
    insertTrigger: true,
  },
  {
    type: 'strikethrough',
    between: ['~~', '~~'],
    mode: 'inline',
    insertTrigger: true,
  },
];
