import kill from 'tree-kill'
import fs, { promises as asyncFs } from 'fs'
import path from 'path'
import { spawn, ChildProcess } from 'child_process'
import env from '@src/utils/env.validation'
import { ApproveSignParams, Signature } from '@bitoftrade/tss-core'
import Web3 from 'web3'
import { removeHexPrefix } from '@src/utils/hex'
import { createKeyValueArrayFromObject } from '@src/utils/array'
import { constructExternallyControllablePromise, ExternallyControllablePromise } from '@src/utils/promises'

const pathToKeyShareFolder = path.join(process.cwd(), 'tss-key-shares')

const portToProcess: Map<number, ChildProcess> = new Map()

const keyGenPromises: Map<string, ExternallyControllablePromise<void>> = new Map()
const signaturePromises: Map<string, ExternallyControllablePromise<Signature>> = new Map()

export const startKeyGenClient = async (
	parties: number,
	threshold: number,
	index: number,
	port: number,
	processId: string
): Promise<void> => {
	if (portToProcess.has(port)) {
		throw new Error('Current server port are already in use')
	}

	const config = {
		'-t': threshold.toString(),
		'-n': parties.toString(),
		'-i': index.toString(),
		'--output': `${pathToKeyShareFolder}/${processId}.json`,
		'--address': `${env.SM_MANAGER_BASE_URL}:${port}`
	}

	const keyGenStartedPromise = constructExternallyControllablePromise<void>()
	const keyGenFinishedPromise = constructExternallyControllablePromise<void>()

	removePrevTempJsonFile(processId)
	syncFolder(pathToKeyShareFolder)

	const process = spawn(`../../target/gg20_keygen`, createKeyValueArrayFromObject(config), { cwd: __dirname })

	process.on('error', (err: Error) => {
		keyGenStartedPromise.reject(err.message)
		closeProcessOnPort(process?.pid, port)
	})

	process.stderr.on('data', (data) => {
		console.error(`stderr: ${data}`)
	})

	process.stdout.on('data', (data: Buffer) => {
		// key gen server prints 'true' when it's already run and waiting for other to join
		// it means tss-client can response that it is ready to start key gen
		const message = data.toString().trim()
		if (message === 'true') {
			keyGenStartedPromise.resolve()
		}
	})

	process.on('exit', (status: number) => {
		if (status == 0) {
			keyGenFinishedPromise.resolve()
		} else {
			keyGenStartedPromise.reject(`KeyGenClient error with status: ${status}`)
		}
		closeProcessOnPort(process?.pid, port)
		portToProcess.delete(port)
	})

	keyGenPromises.set(processId, keyGenFinishedPromise)
	portToProcess.set(port, process)

	return keyGenStartedPromise.promise
}

export const startMsgSignClient = async (
	msg: string,
	indexes: number[],
	port: number,
	shareFileName: string,
	processId: string
): Promise<void> => {
	if (portToProcess.has(port)) {
		throw new Error('Current port are already in use')
	}

	const config = {
		'-p': indexes.join(','),
		'-d': removeHexPrefix(msg),
		'-l': `${pathToKeyShareFolder}/${shareFileName}.json`,
		'--address': `${env.SM_MANAGER_BASE_URL}:${port}`
	}
	const msgSignStartedPromise = constructExternallyControllablePromise<void>()
	const msgSignFinishedPromise = constructExternallyControllablePromise<Signature>()

	const process = spawn(`../../target/gg20_signing`, createKeyValueArrayFromObject(config), {
		cwd: __dirname
	})

	process.stdout.on('data', (data: Buffer) => {
		const message = data.toString().trim()
		// signing server prints 'true' when it's already run and waiting for other to join
		// it means tss-client can response that it is ready to sign
		if (message === 'true') {
			msgSignStartedPromise.resolve()
		} else {
			const signature = JSON.parse(message)
			if (signature) {
				const r = Buffer.from(signature.r.scalar).toString('hex')
				const s = Buffer.from(signature.s.scalar).toString('hex')
				const v = signature.recid

				if (r && s && v !== undefined) {
					closeProcessOnPort(process?.pid, port)
					msgSignFinishedPromise.resolve({ r: `0x${r}`, s: `0x${s}`, v: Web3.utils.toHex(v) })
				}
			}
		}
	})

	process.stderr.on('data', (message: Buffer) => {
		console.error('error sign: ', message.toString())
		msgSignStartedPromise.reject(message)
		closeProcessOnPort(process?.pid, port)
	})

	portToProcess.set(port, process)
	signaturePromises.set(processId, msgSignFinishedPromise)

	return msgSignStartedPromise.promise
}

export const renameTempKeyFile = async (processId: string, address: string): Promise<void> => {
	const pathToOldFile = `${pathToKeyShareFolder}/${processId}.json`
	const pathToNewFile = `${pathToKeyShareFolder}/${address}.json`
	return fs.promises.rename(pathToOldFile, pathToNewFile)
}

export const getApproveSignParamsForSigner = async (signer: string): Promise<ApproveSignParams | null> => {
	try {
		const path = `${pathToKeyShareFolder}/${signer}.json`
		const file = await asyncFs.readFile(path)
		const share = JSON.parse(file.toString())
		return { index: share.i, threshold: share.t, parties: share.n, signer }
	} catch (error) {
		return null
	}
}

export const waitForKeyGeneration = (processId: string): Promise<void> => {
	const promise = keyGenPromises.get(processId).promise
	keyGenPromises.delete(processId)
	return promise
}

export const waitForSignatureGeneration = (processId: string): Promise<Signature> => {
	const promise = signaturePromises.get(processId).promise
	signaturePromises.delete(processId)
	return promise
}

export const removePrevTempJsonFile = (processId: string): void => {
	try {
		const path = `${__dirname}/${processId}.json`
		fs.unlinkSync(path)
	} catch (e) {}
}

export const syncFolder = (path): void => {
	try {
		if (!fs.existsSync(path)) {
			fs.mkdirSync(path)
		}
	} catch (e) {}
}

const closeProcessOnPort = (pid: number, port: number): void => {
	kill(pid)
	portToProcess.delete(port)
}
