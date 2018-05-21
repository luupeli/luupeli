import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import WritingGame from './WritingGame'
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<WritingGame />, document.getElementById('root'));
registerServiceWorker();
