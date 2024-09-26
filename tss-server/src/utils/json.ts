import { promises as fs } from 'fs'

const handledHashesFileName = 'handled-signed-tx-hashes.json'

export async function checkSavedHandledSignedMessage(txHash: string): Promise<boolean> {
	try {
		const file = await fs.readFile(handledHashesFileName)
		const txHashes = JSON.parse(file.toString())
		return txHashes.includes(txHash)
	} catch (error) {
		return false
	}
}

export async function saveHandledSignedMessage(txHash: string): Promise<void> {
	let txHashes = []
	try {
		const file = await fs.readFile(handledHashesFileName)
		txHashes = JSON.parse(file.toString())
	} finally {
		txHashes.push(txHash)
		return fs.writeFile(handledHashesFileName, JSON.stringify(txHashes), 'utf8')
	}
}
