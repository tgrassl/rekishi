export const getTimeText = (time: number): string => {
  if (Math.round(time) <= 0) return 'Now';
  else if (time <= 60) return `${Math.round(time)} seconds ago`;
  else if (time > 60 && time < 3600) return `${Math.round(time / 60)} minutes ago`;
  else if (time > 3600) return `${Math.round(time / 3600)} hours ago`;
};
