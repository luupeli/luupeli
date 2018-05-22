import React from 'react';
import ReactDOM from 'react-dom';
/*import App from './App';*/
import HomePage from './HomePage';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<HomePage />, document.getElementById('root'));
registerServiceWorker();