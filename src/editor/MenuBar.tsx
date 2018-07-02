import { map } from 'lodash';
import { EditorState, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import React, { MouseEventHandler, SFC } from 'react';
import { createComponent } from 'react-fela';
import { IMenu, IMenuItemSpecJSX } from './config';

const BarWrapper = createComponent(() => ({
  marginBottom: '5px',
  display: 'flex',
  alignItems: 'baseline',
}));

const GroupSpan = createComponent(() => ({ marginRight: '5px' }), 'span');

const Button = createComponent<{
  active?: boolean;
  onMouseDown: MouseEventHandler<HTMLButtonElement>;
}>(
  ({ active }) => ({
    background: 'white',
    border: 'none',
    fontSize: 'inherit',
    cursor: 'pointer',
    color: active ? 'black' : '#777',
    borderRadius: '0',
    padding: '5px 10px',
    active,
    onHover: {
      color: 'black',
      background: '#f6f6f6',
    },
    onDisabled: {
      color: '#ccc',
    },
  }),
  'button',
  ['onMouseDown'],
);

interface IProps {
  menu: IMenu;
  state: EditorState;
  view: EditorView;
  dispatch(tr: Transaction): void;
}

const MenuBar: SFC<IProps> = ({ menu, children, state, dispatch, view }) => {
  const onMenuMouseDown = (
    item: IMenuItemSpecJSX,
  ): MouseEventHandler<HTMLButtonElement> => e => {
    e.preventDefault();
    if (item.run) {
      // tslint:disable-next-line:no-console
      console.log('XxxxxxxX', item, e);
      item.run(state, dispatch, view, e.nativeEvent);
    }
  };
  return (
    <BarWrapper>
      {children && <GroupSpan>{children}</GroupSpan>}
      {map(menu, (group, groupKey) => (
        <GroupSpan key={groupKey}>
          {map(group, (item, itemKey) => (
            <Button
              key={itemKey}
              type="button"
              active={item.active ? item.active(state) : false}
              disabled={item.enable ? !item.enable(state) : false}
              title={typeof item.title === 'string' ? item.title : ''}
              onMouseDown={onMenuMouseDown(item)}
            >
              {item.content}
            </Button>
          ))}
        </GroupSpan>
      ))}
    </BarWrapper>
  );
};

export default MenuBar;
