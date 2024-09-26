import { gql } from 'graphql-request'

// TODO: dont forget to make referrer param mandatory
export const PARASWAP_QUERY = gql`
	query ($referrer: String!, $afterBy: BigInt) {
		swaps(orderBy: timestamp, orderDirection: desc, where: { referrer: $referrer, timestamp_gt: $afterBy }) {
			id
			initiator
			srcToken
			destToken
			srcAmount
			destAmount
			referrer
			paraswapFee
			referrerFee
			feeCode
			feeToken
			txHash
			txGasUsed
			txGasPrice
			blockNumber
			timestamp
		}
	}
`
