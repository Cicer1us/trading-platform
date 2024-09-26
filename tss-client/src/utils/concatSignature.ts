import { Signature } from '@bitoftrade/tss-core'
import Web3 from 'web3'
import { removeHexPrefix } from './hex'

export default function concatSignature(signature: Signature): string {
	const v = Web3.utils.hexToNumber(signature.v)
	const normalizedV = v < 27 ? v + 27 : v
	const hexedV = Web3.utils.toHex(normalizedV)

	return `${signature.r}${removeHexPrefix(signature.s)}${removeHexPrefix(hexedV)}`
}
