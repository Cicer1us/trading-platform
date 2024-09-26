// use this method when we need to detect if wallet error is user rejected transaction
// TODO: make sure that every wallet on our platform return error with code param
export function isUserRejectionError(error: Error): boolean {
  return (error as any).code === 'ACTION_REJECTED' || error.message.includes('user rejected transaction');
}

// TODO: use this method to throw all other errors that were not handled in onError hook
export function isErrorHandledInMutationCallback(error: Error): boolean {
  return isUserRejectionError(error);
}
