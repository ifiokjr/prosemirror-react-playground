import { Fragment, Mark, Node, Schema } from 'prosemirror-model';
import { EditorState, Plugin, Selection, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import 'prosemirror-view/style/prosemirror.css';
import React, { Component, ReactNode, Ref } from 'react';
import './Editor.css';

interface IEditorCreateConfig<S extends Schema = any> {
  schema?: S | null;
  doc?: Node<S> | null;
  selection?: Selection<S> | null;
  storedMarks?: Mark[] | null;
  plugins?: Array<Plugin<S>> | null;
}

interface IState {
  editorState: EditorState;
}

interface IRenderProps {
  editor: JSX.Element;
  state: EditorState;
  view: EditorView;
  dispatch(tr: Transaction): void;
}

interface IProps {
  options: IEditorCreateConfig;
  autoFocus?: boolean;
  placeholder: string;
  onChange(content: Fragment): void;
  render?(params: IRenderProps): ReactNode;
}

class Editor extends Component<IProps, IState> {
  public state: IState = {
    editorState: EditorState.create(this.props.options),
  };
  private view?: EditorView;

  public render() {
    const editor = <div ref={this.createEditorView} />;
    return this.props.render
      ? this.props.render({
          state: this.state.editorState,
          dispatch: this.dispatchTransaction,
          editor,
          view: this.view!,
        })
      : editor;
  }

  private createEditorView: Ref<HTMLDivElement> = node => {
    if (!this.view && node) {
      this.view = new EditorView(node, {
        state: this.state.editorState,
        dispatchTransaction: this.dispatchTransaction,
        attributes: {
          placeholder: this.props.placeholder,
        },
      });
      if (this.props.autoFocus) {
        this.view.focus();
      }
    }
  };

  private dispatchTransaction = (transaction: Transaction) => {
    if (!this.view) {
      return;
    }
    // tslint:disable-next-line:no-console
    console.log(transaction);
    const editorState = this.view.state.apply(transaction);
    this.view.updateState(editorState);
    this.setState({ editorState });
    this.props.onChange(editorState.doc.content);
  };
}

export default Editor;
