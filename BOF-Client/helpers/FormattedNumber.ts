export const AddCommas = (amount: string | number): string => {
  if (!amount) return '0';
  const parts = amount.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};

export const RemoveCommas = (amount: string | number): string => {
  return amount?.toString().replace(/,/g, '');
};
