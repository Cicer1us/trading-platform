import { Chains } from 'connection/chainConfig';
import { Notify, NotifyEnum } from '@/components/CustomToastContainer/CustomToastContainer';

export type ChainTransactionNotification = (chainId: Chains, hash: string, t: (subCategory: string) => string) => void;
export type EmptyParamsNotification = (t: (subCategory: string) => string) => void;

export const depositTxSubmitted: ChainTransactionNotification = (chainId, hash, t) => {
  Notify({
    state: NotifyEnum.SUCCESS,
    title: t('deposit'),
    message: t('depositSubmitted'),
    link: { chainId, hash },
  });
};

export const depositTxConfirmed: ChainTransactionNotification = (chainId, hash, t) => {
  Notify({
    state: NotifyEnum.SUCCESS,
    title: t('deposit'),
    message: t('depositTxSuccess'),
    link: { chainId, hash },
  });
};

export const someThingWentWrong: EmptyParamsNotification = t => {
  Notify({ state: NotifyEnum.ERROR, title: t('failureTitle'), message: t('failureText') });
};

export const transactionRejected: ChainTransactionNotification = (chainId, hash, t) => {
  Notify({
    state: NotifyEnum.ERROR,
    title: t('deposit'),
    message: `${t('deposit')} ${t('txRejected')}`,
    link: {
      chainId,
      hash: hash,
    },
  });
};
