export type ExternallyControllablePromise<T> = {
	promise: Promise<T>
	resolve?: (v: T) => void
	reject?: (reason?: unknown) => void
}

export const constructExternallyControllablePromise = <T>(): ExternallyControllablePromise<T> => {
	let resolve, reject

	const promise = new Promise<T>((_resolve, _reject) => {
		resolve = _resolve
		reject = _reject
	})

	return { promise, resolve, reject }
}
