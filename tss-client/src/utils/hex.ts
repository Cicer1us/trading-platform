export const removeHexPrefix = (str: string): string => {
	return str.slice(0, 2) === '0x' ? str.slice(2) : str
}
