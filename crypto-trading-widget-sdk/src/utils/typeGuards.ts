export const isString = (param: any): param is string => {
  return typeof param === 'string';
};

export const isUndefined = (param: any): param is undefined => {
  return typeof param === 'undefined';
};
