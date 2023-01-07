import { JourneyItem } from '@shared/model/journeyItem';
import { fetchAndMapJourney } from '@shared/utils/journey';
import { Accessor, createContext, createResource, createSignal, Resource, Setter, useContext } from 'solid-js';

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
