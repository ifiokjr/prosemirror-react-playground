import {
  joinUp,
  lift,
  setBlockType,
  toggleMark,
  wrapIn,
} from 'prosemirror-commands';
import { redo, undo } from 'prosemirror-history';
import { MenuItemSpec } from 'prosemirror-menu';
import { MarkType, Node as ProsemirrorNode, NodeType } from 'prosemirror-model';
import { wrapInList } from 'prosemirror-schema-list';
import { EditorState, NodeSelection, Transaction } from 'prosemirror-state';

import icons from './icons';
import schema from './schema';

const markActive = (type: MarkType) => (state: EditorState) => {
  const { from, $from, to, empty } = state.selection;

  return empty
    ? !!type.isInSet(state.storedMarks || $from.marks())
    : !!state.doc.rangeHasMark(from, to, type);
};

const blockActive = (type: NodeType, attrs = {}) => (state: EditorState) => {
  const { $from, to, node } = state.selection as NodeSelection;

  if (node) {
    return node.hasMarkup(type, attrs);
  }

  return to <= $from.end() && $from.parent.hasMarkup(type, attrs);
};

const canInsert = (type: NodeType) => (state: EditorState) => {
  const { $from } = state.selection;

  for (let d = $from.depth; d >= 0; d--) {
    const index = $from.index(d);

    if ($from.node(d).canReplaceWith(index, index, type)) {
      return true;
    }
  }

  return false;
};

const promptForURL = () => {
  let url = window && window.prompt('Enter the URL', 'https://');

  if (url && !/^https?:\/\//i.test(url)) {
    url = 'http://' + url;
  }

  return url;
};

export interface IMenuItemSpecJSX extends Partial<MenuItemSpec> {
  content: JSX.Element;
  // title?: string;
}

export interface IMenu {
  [group: string]: { [item: string]: IMenuItemSpecJSX };
}

const menu: IMenu = {
  marks: {
    strong: {
      title: 'Toggle strong',
      content: icons.strong,
      active: markActive(schema.marks.strong),
      run: toggleMark(schema.marks.strong),
    },
    em: {
      title: 'Toggle emphasis',
      content: icons.em,
      active: markActive(schema.marks.em),
      run: toggleMark(schema.marks.em),
    },
    underline: {
      title: 'Toggle underline',
      content: icons.underline,
      active: markActive(schema.marks.underline),
      run: toggleMark(schema.marks.underline),
    },
    code: {
      title: 'Toggle code',
      content: icons.code,
      active: markActive(schema.marks.code),
      run: toggleMark(schema.marks.code),
    },
    subscript: {
      title: 'Toggle subscript',
      content: icons.subscript,
      active: markActive(schema.marks.subscript),
      run: toggleMark(schema.marks.subscript),
    },
    superscript: {
      title: 'Toggle superscript',
      content: icons.superscript,
      active: markActive(schema.marks.superscript),
      run: toggleMark(schema.marks.superscript),
    },
    strikethrough: {
      title: 'Toggle strikethrough',
      content: icons.strikethrough,
      active: markActive(schema.marks.strikethrough),
      run: toggleMark(schema.marks.strikethrough),
    },
    link: {
      title: 'Add or remove link',
      content: icons.link,
      active: markActive(schema.marks.link),
      enable: (state: EditorState) => !state.selection.empty,
      run(state: EditorState, dispatch: (tr: Transaction) => void) {
        if (markActive(schema.marks.link)(state)) {
          toggleMark(schema.marks.link)(state, dispatch);
          return true;
        }

        const href = promptForURL();
        if (!href) {
          return false;
        }

        toggleMark(schema.marks.link, { href })(state, dispatch);
        // view.focus()
        return false;
      },
    },
  },
  blocks: {
    plain: {
      title: 'Change to paragraph',
      content: icons.paragraph,
      active: blockActive(schema.nodes.paragraph),
      enable: setBlockType(schema.nodes.paragraph),
      run: setBlockType(schema.nodes.paragraph),
    },
    code_block: {
      title: 'Change to code block',
      content: icons.code_block,
      active: blockActive(schema.nodes.code_block),
      enable: setBlockType(schema.nodes.code_block),
      run: setBlockType(schema.nodes.code_block),
    },
    h1: {
      title: 'Change to heading level 1',
      content: icons.heading,
      active: blockActive(schema.nodes.heading, { level: 1 }),
      enable: setBlockType(schema.nodes.heading, { level: 1 }),
      run: setBlockType(schema.nodes.heading, { level: 1 }),
    },
    // h2: {
    //   title: 'Change to heading level 2',
    //   content: 'H2',
    //   active: blockActive(schema.nodes.heading, { level: 2 }),
    //   enable: setBlockType(schema.nodes.heading, { level: 2 }),
    //   run: setBlockType(schema.nodes.heading, { level: 2 })
    // },
    blockquote: {
      title: 'Wrap in block quote',
      content: icons.blockquote,
      active: blockActive(schema.nodes.blockquote),
      enable: wrapIn(schema.nodes.blockquote),
      run: wrapIn(schema.nodes.blockquote),
    },
    bullet_list: {
      title: 'Wrap in bullet list',
      content: icons.bullet_list,
      active: blockActive(schema.nodes.bullet_list),
      enable: wrapInList(schema.nodes.bullet_list),
      run: wrapInList(schema.nodes.bullet_list),
    },
    ordered_list: {
      title: 'Wrap in ordered list',
      content: icons.ordered_list,
      active: blockActive(schema.nodes.ordered_list),
      enable: wrapInList(schema.nodes.ordered_list),
      run: wrapInList(schema.nodes.ordered_list),
    },
    lift: {
      title: 'Lift out of enclosing block',
      content: icons.lift,
      enable: lift,
      run: lift,
    },
    join_up: {
      title: 'Join with above block',
      content: icons.join_up,
      enable: joinUp,
      run: joinUp,
    },
  },
  insert: {
    image: {
      title: 'Insert image',
      content: icons.image,
      enable: canInsert(schema.nodes.image),
      run: (state: EditorState, dispatch: (tr: Transaction) => void) => {
        const src = promptForURL();
        if (!src) {
          return false;
        }

        const img = schema.nodes.image.createAndFill({ src });
        if (img) {
          dispatch(state.tr.replaceSelectionWith(img));
          return true;
        }
        return false;
      },
    },
    footnote: {
      title: 'Insert footnote',
      content: icons.footnote,
      enable: canInsert(schema.nodes.footnote),
      run: (state: EditorState, dispatch: (tr: Transaction) => void) => {
        const footnote = schema.nodes.footnote.create();
        dispatch(state.tr.replaceSelectionWith(footnote));
      },
    },
    // hr: {
    //   title: 'Insert horizontal rule',
    //   content: 'HR',
    //   enable: canInsert(schema.nodes.horizontal_rule),
    //   run: (state, dispatch) => {
    //     const hr = schema.nodes.horizontal_rule.create()
    //     dispatch(state.tr.replaceSelectionWith(hr))
    //   }
    // },
    table: {
      title: 'Insert table',
      content: icons.table,
      enable: canInsert(schema.nodes.table),
      run: (state: EditorState, dispatch: (tr: Transaction) => void) => {
        // const { from } = state.selection
        let rowCount = window && Number(window.prompt('How many rows?'));
        let colCount = window && Number(window.prompt('How many columns?'));

        const cells: ProsemirrorNode[] = [];
        while (colCount--) {
          cells.push(
            schema.nodes.table_cell.createAndFill() as ProsemirrorNode,
          );
        }

        const rows: ProsemirrorNode[] = [];
        while (rowCount--) {
          rows.push(schema.nodes.table_row.createAndFill(
            undefined,
            cells as ProsemirrorNode[],
          ) as ProsemirrorNode);
        }

        const table = schema.nodes.table.createAndFill(undefined, rows);
        dispatch(state.tr.replaceSelectionWith(table as ProsemirrorNode));

        // const tr = state.tr.replaceSelectionWith(table)
        // tr.setSelection(Selection.near(tr.doc.resolve(from)))
        // dispatch(tr.scrollIntoView())
        // view.focus()
      },
    },
  },
  history: {
    undo: {
      title: 'Undo last change',
      content: icons.undo,
      enable: undo,
      run: undo,
    },
    redo: {
      title: 'Redo last undone change',
      content: icons.redo,
      enable: redo,
      run: redo,
    },
  },
  // table: {
  // addColumnBefore: {
  //   title: 'Insert column before',
  //   content: icons.after,
  //   active: addColumnBefore, // TOOD: active -> select
  //   run: addColumnBefore
  // },
  // addColumnAfter: {
  //   title: 'Insert column before',
  //   content: icons.before,
  //   active: addColumnAfter, // TOOD: active -> select
  //   run: addColumnAfter
  // }
  // }
};

export default menu;
