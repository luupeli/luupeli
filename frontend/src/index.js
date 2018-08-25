import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux'
import Main from './Main'
import store from './store'

ReactDOM.render((
  <Provider store={store}>
    <Main />
  </Provider>
), document.getElementById('root'));
 registerServiceWorker();