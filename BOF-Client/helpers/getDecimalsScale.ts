const getDecimalsScale = (value: number): number => {
  if (value > 1000) return 2;
  if (value > 1) return 3;
  return 5;
};
export default getDecimalsScale;
