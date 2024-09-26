export const createKeyValueArrayFromObject = (obj: Record<string, string>): string[] => {
	return Object.entries(obj).reduce((total, [key, value]) => [...total, key, value], [])
}
