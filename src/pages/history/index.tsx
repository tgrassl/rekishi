import { render } from 'solid-js/web';
import { hashIntegration, Router } from '@solidjs/router';
import './index.css';
import History from './History';

const appContainer = document.querySelector('#app-container');
if (!appContainer) {
  throw new Error('Can not find AppContainer');
}

render(
  () => (
    <Router source={hashIntegration()}>
      <History />
    </Router>
  ),
  appContainer
);
