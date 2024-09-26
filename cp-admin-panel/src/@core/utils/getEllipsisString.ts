export const getEllipsisString = (str?: string, startChars = 4, endChars = 4) => {
  if (!str) return '';

  if (str.length <= startChars + endChars) return str;

  return `${str.slice(0, startChars)}...${str.slice(-endChars)}`;
};
