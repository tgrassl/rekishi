import { Accessor, createContext, createResource, createSignal, Resource, Setter, useContext } from 'solid-js';
import { JourneyItem } from '@src/model/journeyItem';
import { fetchAndMapJourney } from '@src/utils/journey';

export interface HistoryContextReturn {
  journey: Resource<JourneyItem[]>;
  setActiveItem: Setter<JourneyItem>;
  activeItem: Accessor<JourneyItem>;
}

export const JourneyContext = createContext<HistoryContextReturn>(null);

export const useJourney = () => useContext(JourneyContext);

export function JourneyProvider(props) {
  const [journey] = createResource<JourneyItem[]>(fetchAndMapJourney);
  const [activeItem, setActiveItem] = createSignal<JourneyItem>();

  return <JourneyContext.Provider value={{ journey, setActiveItem, activeItem }}>{props.children}</JourneyContext.Provider>;
}
