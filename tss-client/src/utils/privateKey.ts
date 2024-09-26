import { promises as fs } from 'fs'
import os from 'os'

export async function updatePrivateKey(prKey: string): Promise<void> {
	process.env.KEY_SHARE_HOLDER_PRIVATE_KEY = prKey
	return setEnvValue('KEY_SHARE_HOLDER_PRIVATE_KEY', prKey)
}

async function setEnvValue(key, value): Promise<void> {
	// read file from hdd & split if from a linebreak to a array
	const file = await fs.readFile('.env', 'utf8')
	const ENV_VARS = file.split(os.EOL)

	// find the env we want based on the key
	const target = ENV_VARS.indexOf(
		ENV_VARS.find((line) => {
			// (?<!#\s*)   Negative lookbehind to avoid matching comments (lines that starts with #).
			//             There is a double slash in the RegExp constructor to escape it.
			// (?==)       Positive lookahead to check if there is an equal sign right after the key.
			//             This is to prevent matching keys prefixed with the key of the env var to update.
			const keyValRegex = new RegExp(`(?<!#\\s*)${key}(?==)`)

			return line.match(keyValRegex)
		})
	)

	// if key-value pair exists in the .env file,
	if (target !== -1) {
		// replace the key/value with the new value
		ENV_VARS.splice(target, 1, `${key}=${value}`)
	} else {
		// if it doesn't exist, add it instead
		ENV_VARS.push(`${key}=${value}`)
	}

	// write everything back to the file system
	return fs.writeFile('.env', ENV_VARS.join(os.EOL))
}
