import { hashIntegration, Router } from '@solidjs/router';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { render } from 'solid-js/web';
import History from './History';

dayjs.extend(localizedFormat);

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
