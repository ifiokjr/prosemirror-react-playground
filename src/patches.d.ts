declare module 'prosemirror-dropcursor' {
  import { Plugin, Selection } from 'prosemirror-state';
  import { CSSProperties } from 'react';

  export interface DropCursorOptions {
    color?: string;
    width?: CSSProperties['width'];
  }

  export function dropCursor(options?: DropCursorOptions): Plugin;
}

declare module 'prosemirror-tables' {
  import {
    Node as ProsemirrorNode,
    NodeSpec,
    ResolvedPos,
    Schema,
    Slice,
  } from 'prosemirror-model';
  import {
    EditorState,
    Plugin,
    PluginKey,
    SelectionRange,
    Transaction,
  } from 'prosemirror-state';
  import { NodeView } from 'prosemirror-view';

  export interface TableNodesOptions {
    tableGroup?: string;
    cellContent: string;
    cellAttributes?: { [key: string]: CellAttributes };
  }

  export type getFromDOM = (dom: Element) => any;
  export type setDOMAttr = (value: any, attrs: any) => any;

  export interface CellAttributes {
    default: any;
    getFromDOM?: getFromDOM;
    setDOMAttr?: setDOMAttr;
  }

  export interface TableNodes {
    table: NodeSpec;
    table_row: NodeSpec;
    table_cell: NodeSpec;
    table_header: NodeSpec;
  }

  export function tableNodes(options: TableNodesOptions): TableNodes;

  export interface CellSelectionJSON {
    type: string;
    anchor: number;
    head: number;
  }

  export class CellSelection<S extends Schema = any> {
    constructor($anchorCell: ResolvedPos<S>, $headCell?: ResolvedPos<S>);

    public from: number;
    public to: number;
    public $from: ResolvedPos<S>;
    public $to: ResolvedPos<S>;
    public anchor: number;
    public head: number;
    public $anchor: ResolvedPos<S>;
    public $head: ResolvedPos<S>;
    public $anchorCell: ResolvedPos<S>;
    public $headCell: ResolvedPos<S>;
    public empty: boolean;
    public ranges: Array<SelectionRange<S>>;

    public map(doc: ProsemirrorNode<S>, mapping: any): any;
    public content(): Slice<S>;
    public replace(tr: Transaction<S>, content: Slice<S>): void;
    public replaceWith(tr: Transaction<S>, node: ProsemirrorNode<S>): void;
    public forEachCell(
      f: (node: ProsemirrorNode<S>, pos: number) => void,
    ): void;
    public isRowSelection(): boolean;
    public isColSelection(): boolean;
    public eq(other: any): boolean;
    public toJSON(): CellSelectionJSON;
    public getBookmark(): { anchor: number; head: number };

    public static colSelection<S extends Schema = any>(
      anchorCell: ResolvedPos<S>,
      headCell?: ResolvedPos<S>,
    ): CellSelection<S>;
    public static rowSelection<S extends Schema = any>(
      anchorCell: ResolvedPos<S>,
      headCell?: ResolvedPos<S>,
    ): CellSelection<S>;
    public static create<S extends Schema = any>(
      doc: ProsemirrorNode<S>,
      anchorCell: number,
      headCell?: number,
    ): CellSelection<S>;
    public static fromJSON<S extends Schema = any>(
      doc: ProsemirrorNode<S>,
      json: CellSelectionJSON,
    ): CellSelection<S>;
  }

  export interface Rect {
    left: number;
    top: number;
    right: number;
    bottom: number;
  }

  export class TableMap {
    public width: number;
    public height: number;
    public map: number[];
    public problems?: object[];

    public findCell(pos: number): Rect;
    public colCount(pos: number): number;
    public nextCell(pos: number, axis: string, dir: number): number;
    public rectBetween(a: number, b: number): Rect;
    public cellsInRect(rect: Rect): number[];
    public positionAt(row: number, col: number, table: ProsemirrorNode): number;

    public static get(table: ProsemirrorNode): TableMap;
  }

  export function tableEditing(): Plugin;

  export function deleteTable<S extends Schema = any>(
    state: EditorState<S>,
    dispatch?: (tr: Transaction<S>) => void,
  ): boolean;

  export function goToNextCell<S extends Schema = any>(
    direction: number,
  ): (
    state: EditorState<S>,
    dispatch?: (tr: Transaction<S>) => void,
  ) => boolean;

  export function toggleHeaderCell<S extends Schema = any>(
    state: EditorState<S>,
    dispatch?: (tr: Transaction<S>) => void,
  ): boolean;

  export function toggleHeaderColumn<S extends Schema = any>(
    state: EditorState<S>,
    dispatch?: (tr: Transaction<S>) => void,
  ): boolean;

  export function toggleHeaderRow<S extends Schema = any>(
    state: EditorState<S>,
    dispatch?: (tr: Transaction<S>) => void,
  ): boolean;

  export function setCellAttr<S extends Schema = any>(
    name: string,
    value: any,
  ): (
    state: EditorState<S>,
    dispatch?: (tr: Transaction<S>) => void,
  ) => boolean;

  export function splitCell<S extends Schema = any>(
    state: EditorState<S>,
    dispatch?: (tr: Transaction<S>) => void,
  ): boolean;

  export function mergeCells<S extends Schema = any>(
    state: EditorState<S>,
    dispatch?: (tr: Transaction<S>) => void,
  ): boolean;

  export function deleteRow<S extends Schema = any>(
    state: EditorState<S>,
    dispatch?: (tr: Transaction<S>) => void,
  ): boolean;

  export function addRowAfter<S extends Schema = any>(
    state: EditorState<S>,
    dispatch?: (tr: Transaction<S>) => void,
  ): boolean;

  export function addRowBefore<S extends Schema = any>(
    state: EditorState<S>,
    dispatch?: (tr: Transaction<S>) => void,
  ): boolean;

  export function deleteColumn<S extends Schema = any>(
    state: EditorState<S>,
    dispatch?: (tr: Transaction<S>) => void,
  ): boolean;

  export function addColumnAfter<S extends Schema = any>(
    state: EditorState<S>,
    dispatch?: (tr: Transaction<S>) => void,
  ): boolean;

  export function addColumnBefore<S extends Schema = any>(
    state: EditorState<S>,
    dispatch?: (tr: Transaction<S>) => void,
  ): boolean;

  export function columnResizing<S extends Schema = any>(props: {
    handleWidth?: number;
    cellMinWidth?: number;
    View?: NodeView<S>;
  }): Plugin<S>;

  export const columnResizingPluginKey: PluginKey;

  export function updateColumnsOnResize(
    node: ProsemirrorNode,
    colgroup: Element,
    table: Element,
    cellMinWidth: number,
    overrideCol?: number,
    overrideValue?: number,
  ): void;

  export function cellAround<S extends Schema = any>(
    pos: ResolvedPos<S>,
  ): ResolvedPos<S> | null;

  export function isInTable(state: EditorState): boolean;

  export function selectionCell<S extends Schema = any>(
    state: EditorState<S>,
  ): ResolvedPos<S> | null | undefined;

  export function moveCellForward<S extends Schema = any>(
    pos: ResolvedPos<S>,
  ): ResolvedPos<S>;

  export function inSameTable<S extends Schema = any>(
    $a: ResolvedPos<S>,
    $b: ResolvedPos<S>,
  ): boolean;

  export function findCell(
    pos: ResolvedPos,
  ): { top: number; left: number; right: number; buttom: number };

  export function colCount(pos: ResolvedPos): number;

  export function nextCell<S extends Schema = any>(
    pos: ResolvedPos<S>,
    axis: string,
    dir: number,
  ): null | ResolvedPos<S>;
}
