import { Accessor, createContext, createResource, createSignal, Resource, Setter, useContext } from 'solid-js';
import { HistoryItem } from '@src/model/historyItem';
import { fetchAndMapHistory } from '@src/utils/history';

export interface HistoryContextReturn {
  history: Resource<HistoryItem[]>;
  setActiveItem: Setter<HistoryItem>;
  activeItem: Accessor<HistoryItem>;
}

export const HistoryContext = createContext<HistoryContextReturn>(null);

export const useHistory = () => useContext(HistoryContext);

export function HistoryProvider(props) {
  const [history] = createResource<HistoryItem[]>(fetchAndMapHistory);
  const [activeItem, setActiveItem] = createSignal<HistoryItem>();

  return <HistoryContext.Provider value={{ history, setActiveItem, activeItem }}>{props.children}</HistoryContext.Provider>;
}
