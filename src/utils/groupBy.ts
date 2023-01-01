export const groupBy = <T extends any[]>(array: T, key: string): { contents: T; key: number }[] => {
  return array.reduce((result, currentItem) => {
    const existingItem = result.find((resultItem) => resultItem.key === currentItem[key]);

    if (!existingItem) {
      result.push({ key: currentItem[key], contents: [currentItem] });
    } else {
      existingItem.contents = [...existingItem.contents, currentItem];
    }

    return result;
  }, []);
};
