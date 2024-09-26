export default function convertExpToString(n: number): string {
  const sign = Number(n) < 0 ? '-' : '';
  const toStr = n.toString();

  if (!/e/i.test(toStr)) {
    return n.toString();
  }

  const [lead, decimal, pow] = n
    .toString()
    .replace(/^-/, '')
    .replace(/^([0-9]+)(e.*)/, '$1.$2')
    .split(/e|\./);

  if (Number(pow) < 0) {
    return `${sign}0.${'0'.repeat(Math.max(Math.abs(Number(pow)) - 1 || 0, 0))}${lead}${decimal}`;
  }

  const decimalSlice =
    Number(pow) >= decimal.length
      ? decimal + '0'.repeat(Math.max(Number(pow) - decimal.length || 0, 0))
      : `${decimal.slice(0, Number(pow))}.${decimal.slice(+pow)}`;

  return sign + lead + decimalSlice;
}
