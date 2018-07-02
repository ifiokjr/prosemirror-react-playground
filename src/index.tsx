import { createRenderer } from 'fela';
import friendlyPseudoClass from 'fela-plugin-friendly-pseudo-class';
import webPreset from 'fela-preset-web';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-fela';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

const renderer = createRenderer({
  plugins: [...webPreset, friendlyPseudoClass()],
});

ReactDOM.render(
  <Provider renderer={renderer}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement,
);
registerServiceWorker();
