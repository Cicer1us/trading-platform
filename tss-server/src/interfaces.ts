import { KeyGenParams } from '@bitoftrade/tss-core'
import { Handshake, Socket } from 'socket.io/dist/socket'
import { GnosisSafeAuthDto } from './dto/gnosisSafeAuthDto'

export interface TypedRequestBody<T> extends Express.Request {
	body: T
}

interface TypedAuthHandshake<T> extends Handshake {
	auth: T
}
export interface TypedAuthSocket<T> extends Socket {
	handshake: TypedAuthHandshake<T>
}

export type StartKeygenInput = GnosisSafeAuthDto & { params: KeyGenParams }

export type SignParams = Omit<KeyGenParams, 'type'>

export type EventHandler = (tssClientId: string, ...args: unknown[]) => void
