interface Enum {
	[s: string]: string
}

interface Transform {
	to: (value: string) => string
	from: (value: string) => string
}

export function checkColumnType(columnAlias: string, e: Enum): string {
	return Object.keys(e)
		.reduce((prev, cur, index) => `${prev} ${index !== 0 ? 'OR' : ''} ${columnAlias}='${cur}'`, '')
		.trim()
}

export const lowerCaseTransform = (): Transform => ({
	to: (value: string): string => value.toLocaleLowerCase(),
	from: (value: string): string => value
})

export const upperCaseTransform = (): Transform => ({
	to: (value: string): string => value.toLocaleUpperCase(),
	from: (value: string): string => value
})
