export default function CutCenter(str: string, num = 4, sep = '...'): string {
  if (typeof str !== 'string') return str;
  const start: string = str.slice(0, num);
  const end: string = str.slice(0 - num);
  return `${start}${sep}${end}`;
}
