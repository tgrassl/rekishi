import { JourneyItem } from '@shared/model/journeyItem';
import { fetchAndMapJourney } from '@shared/utils/getJourney';
import { Accessor, createContext, createResource, createSignal, Resource, Setter, useContext } from 'solid-js';
import { setJourney } from '@pages/background/data/journeyData';

export interface HistoryContextReturn {
  journey: Resource<JourneyItem[]>;
  setActiveItem: Setter<JourneyItem>;
  activeItem: Accessor<JourneyItem>;
}

export const JourneyContext = createContext<HistoryContextReturn>(null);

export const useJourney = () => useContext(JourneyContext);

export function JourneyProvider(props) {
  const [journey, { refetch }] = createResource<JourneyItem[]>(fetchAndMapJourney);
  const [activeItem, setActiveItem] = createSignal<JourneyItem>();

  chrome.runtime.onMessage.addListener(({ type }) => {
    if (type === 'newItem') {
      refetch();
    }
  });

  return <JourneyContext.Provider value={{ journey, setActiveItem, activeItem }}>{props.children}</JourneyContext.Provider>;
}
