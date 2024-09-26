import { isMobile } from 'react-device-detect';

export function getIsInjected(): boolean {
  return Boolean(window.ethereum);
}
export function getIsMetaMaskWallet(): boolean {
  return Boolean((window.ethereum as any)?.isMetaMask);
}
export function getIsCoinbaseWallet(): boolean {
  return Boolean((window.ethereum as any)?.isCoinbaseWallet);
}

export function getIsCoinbaseWalletBrowser(): boolean {
  return isMobile && getIsCoinbaseWallet();
}
export function getIsMetaMaskBrowser(): boolean {
  return isMobile && getIsMetaMaskWallet();
}
export function getIsInjectedMobileBrowser(): boolean {
  return getIsCoinbaseWalletBrowser() || getIsMetaMaskBrowser();
}
export function getShouldAdvertiseMetaMask(): boolean {
  return !getIsMetaMaskWallet() && !isMobile && (!getIsInjected() || getIsCoinbaseWallet());
}
export function getIsGenericInjector(): boolean {
  return getIsInjected() && !getIsMetaMaskWallet() && !getIsCoinbaseWallet();
}
