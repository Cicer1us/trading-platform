export enum ServerEvent {
  // connection from client
  CONNECTION = 'connection',

  // key gen
  KEY_GEN_STOP = 'key_gen_stop',
  KEY_GEN_INIT = 'key_gen_init',
  KEY_GEN_START = 'key_gen_start',
  KEY_GEN_INIT_MSG_SIGN = 'key_gen_init_msg_sign',
  KEY_GEN_NEW_SIGNER_ADDRESS = 'key_gen_new_signer_address',

  // event sign
  EVENT_SIGN_INIT = 'event_sign_init',
  EVENT_SIGN_START = 'event_sign_start',
  EVENT_SIGN_STOP = 'event_sign_stop',
}

export enum ClientEvent {
  CLOSE = 'close',

  CONNECT_ERROR = 'connect_error',
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',

  // key gen
  KEY_GEN_ERROR = 'key_gen_error',
  KEY_GEN_READY = 'key_gen_ready',
  KEY_GEN_WAIT_FOR_OTHER_TO_START = 'key_gen_wait_for_other_to_start',
  KEY_GEN_FINISHED = 'key_gen_finished',
  KEY_GEN_WAIT_FOR_OTHER_TO_SIGN = 'key_gen_wait_for_other_to_sign',
  KEY_GEN_SIGNED_MSG_ADDRESS = 'key_gen_signed_msg_address',

  // event sign
  EVENT_SIGN_APPROVE = 'event_sign_approve',
  EVENT_SIGN_WAIT_FOR_OTHER_TO_SIGN = 'event_sign_wait_for_other_to_sign',
  EVENT_SIGN_SIGNATURE = 'event_sign_signature',
  EVENT_SIGN_ERROR = 'event_sign_error',
  EVENT_SIGN_DECLINE = 'event_sign_decline',
}
