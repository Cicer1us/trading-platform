import { AuthToken } from '@bitoftrade/tss-core'
import { ConnectTssClientDto } from './dto/connectTssClient'
import { DisconnectTssClientDto } from './dto/disconnectTssClient'
import { SignedMessageDto } from './dto/signedMessage.dto'
import { UpdateKeyShareHolderDto } from './dto/updateValidator.dto'

export type SignedAuthMessage = Omit<AuthToken, 'keyShareAdmin'>

export interface TypedRequestBody<T> extends Express.Request {
	body: T
}

export type TssClientInput<T> = SignedMessageDto & { params: T }
export type ConnectTssClientInput = TssClientInput<ConnectTssClientDto>
export type DisconnectTssClientInput = TssClientInput<DisconnectTssClientDto>
export type UpdateKeyShareHolderInput = TssClientInput<UpdateKeyShareHolderDto>
