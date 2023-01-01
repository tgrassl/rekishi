export interface HistoryItem {
  colors: { isDark: boolean; hex: string; isLight: boolean };
  duration: number;
  group: number;
  icon: string;
  in: number;
  out: number;
  tab: number;
  title: string;
  url: string;
}
