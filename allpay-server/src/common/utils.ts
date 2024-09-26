type ExcludeProperty<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export function excludeProperties<T, K extends keyof T>(
  obj: T,
  props: K[],
): ExcludeProperty<T, K> {
  const result = { ...obj };
  props.forEach((prop) => delete result[prop]);
  return result as ExcludeProperty<T, K>;
}

export function excludeProperty<T, K extends keyof T>(
  obj: T,
  prop: K,
): ExcludeProperty<T, K> {
  const { [prop]: omitted, ...rest } = obj;
  return rest as ExcludeProperty<T, K>;
}

export function isObjectId(id: string): boolean {
  return /^[a-f\d]{24}$/i.test(id);
}
