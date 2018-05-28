import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom'
import Main from './Main'

ReactDOM.render((
  <BrowserRouter>
      <Main />
  </BrowserRouter>
), document.getElementById('root'));
registerServiceWorker();