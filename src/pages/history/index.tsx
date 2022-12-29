import { render } from 'solid-js/web';
import './index.css';
import History from './History';

const appContainer = document.querySelector('#app-container');
if (!appContainer) {
  throw new Error('Can not find AppContainer');
}

render(History, appContainer);
