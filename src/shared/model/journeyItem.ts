import { ColorInfo } from '@shared/utils/getColorsFromUrl';

export interface JourneyItem {
  colors: ColorInfo;
  duration: number;
  group: number;
  icon: string;
  in: number;
  out: number;
  tab: number;
  title: string;
  url: string;
  preview: string;
  ref?: number;
}
