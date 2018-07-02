import React, { SFC } from 'react';
import { createComponent } from 'react-fela';
import { Editor } from './editor';
import { menu, options } from './editor/config';
import MenuBar from './editor/MenuBar';

const Container = createComponent(() => ({
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
}));

const Input = createComponent(() => ({
  width: '100%',
  height: '50%',
  overflowY: 'auto',
}));

// const Output = createComponent(
//   () => ({
//     width: '100%',
//     height: '50%',
//     overflowY: 'auto',
//     padding: '1em',
//     background: 'black',
//     color: 'lawngreen',
//   }),
//   'pre',
// );
const MenuWrapper = createComponent(() => ({
  backgroundColor: '#eee',
  padding: 5,
}));

const NoteWithOutput: SFC = () => (
  <Container>
    <Input>
      <Editor
        // tslint:disable-next-line:jsx-no-lambda
        onChange={state => {
          // tslint:disable:no-console
          console.log('JSON', state.toJSON());
          console.log('Fragment', state);
        }}
        options={options}
        placeholder="This is a placeholder"
        autoFocus={true}
        // tslint:disable-next-line:jsx-no-lambda
        render={({ editor, state, dispatch, view }) => (
          <MenuWrapper>
            <MenuBar
              menu={menu}
              state={state}
              dispatch={dispatch}
              view={view}
            />
            {editor}
          </MenuWrapper>
        )}
      />
    </Input>
  </Container>
);

export default NoteWithOutput;
