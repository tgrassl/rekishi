import { JourneyProvider } from '@pages/history/providers/JourneyProvider';
import { Search } from '@pages/history/routes/Search/Search';
import { View } from '@pages/history/routes/View/View';
import '@shared/styles/index.scss';
import { A, Route, Routes } from '@solidjs/router';
import styles from './History.module.scss';

const History = () => {
  return (
    <JourneyProvider>
      <header class={styles.header}>
        <A href="/" class={styles.logo}>
          rekishi.
        </A>
      </header>
      <Routes>
        <Route path="/" component={View} />
        <Route path="/search/:query" component={Search} />
      </Routes>
    </JourneyProvider>
  );
};

export default History;
