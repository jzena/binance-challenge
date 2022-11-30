export const formatNumber = (arg: number): string => {
  return new Intl.NumberFormat('en-US').format(arg);
};

export const formatPrice = (arg: number): string => {
  return arg.toLocaleString("en", { useGrouping: true, minimumFractionDigits: 2 })
};
