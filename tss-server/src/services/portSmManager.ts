import env from '@src/utils/env.validation'
import { exec, ChildProcess } from 'child_process'
import kill from 'tree-kill'
import fs from 'fs'

// check if gg20_sm_manager binary file exists
checkSmManagerFileExist()

const availablePorts = env.GG20_AVAILABLE_PORTS

const portsInUse = new Set<number>()
const portToProcess = new Map<number, ChildProcess>()

const config = { ROCKET_ADDRESS: '0.0.0.0' }

const getAvailablePort = (): number => {
	for (const port of availablePorts) {
		if (!portsInUse.has(port)) {
			return port
		}
	}

	throw new Error('No available ports to use')
}

export const runSmManagerOnPort = (): number => {
	const port = getAvailablePort()
	try {
		if (port) {
			const rocketConfig = { ...config, ROCKET_PORT: port }
			const params = Object.entries(rocketConfig).reduce((str, [key, value]) => `${key}=${value} ${str}`, '')
			const process = exec(
				`${params} ../../target/gg20_sm_manager`,
				{ cwd: __dirname },
				(error, stdout, stderr) => {
					// if (error) console.log('gg20_sm_manager error: ', error)
					if (stderr) console.log('gg20_sm_manager stderr: ', stderr)
				}
			)

			if (!process) {
				throw new Error(`Failed to run sm manager on port: ${port}`)
			}

			portToProcess.set(port, process)
			portsInUse.add(port)
			return port
		}
	} catch (e) {
		console.error(e.message)
		throw new Error(`Failed to run sm manager on port: ${port}`)
	}
}

export const stopSmManagerByPort = (port: number): Promise<null> => {
	const process = portToProcess.get(port)
	if (process?.pid) {
		return new Promise((resolve) =>
			kill(process?.pid, () => {
				portToProcess.delete(port)
				portsInUse.delete(port)
				resolve(null)
			})
		)
	}
}

function checkSmManagerFileExist(): void {
	if (!fs.existsSync('./target/gg20_sm_manager')) {
		console.error(`gg20_sm_manager binary file doesn't exist`)
		process.exit(1)
	}
}
