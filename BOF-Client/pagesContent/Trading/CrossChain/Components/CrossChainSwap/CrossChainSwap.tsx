import React from 'react';
import { ArrowRight } from '@/assets/icons/ArrowRight';
import { CircleIcon } from '@/assets/icons/Logo';
import { CircleMultichainLogo } from '@/assets/icons/MultichainLogo';
import CoinsImages from '@/components/CoinsImages/CoinsImages';
import ProgressStatusLine, { ProgressStatus } from '@/components/ProgressStatusLine/ProgressStatusLine';
import style from './CrossChainSwap.module.css';
import { Token } from '@/interfaces/Tokens.interface';
import NumberFormat from 'react-number-format';
import { CrossRoute, usdcToken } from '@bitoftrade/cross-chain-core';
import { CrossChainTxStatus } from '@/interfaces/CrossChain.interface';
import { ClipLoader } from 'react-spinners';
import { CircleStargateLogo } from '@/assets/icons/StargateLogo';

const CROSS_SWAP_TOKEN = 'USDC';

interface CrossChainTransactionProps {
  srcToken: Token;
  destToken: Token;
  srcTxFee: number;
  destTxFee: number | null;
  srcTxFeeUsd: number;
  destTxFeeUsd: number | null;
  srcTxLink?: string;
  destTxLink?: string;
  status: CrossChainTxStatus;
  route: CrossRoute;
}

const Pools = ({ route }: { route?: CrossRoute }) => {
  if (route === CrossRoute.BITOFTRADE) {
    return (
      <>
        <CircleIcon />
        <div className={style.token}>bitoftrade Pools</div>
      </>
    );
  }
  if (route === CrossRoute.MULTICHAIN) {
    return (
      <>
        <CircleMultichainLogo />
        <div className={style.token}>Multichain Pools</div>
      </>
    );
  }

  if (route === CrossRoute.STARGATE) {
    return (
      <>
        <CircleStargateLogo />
        <div className={style.token}>Stargate Pools</div>
      </>
    );
  }

  return <ClipLoader color={'#38d9c0'} loading={true} size={24} />;
};

const CrossChainTransaction: React.FC<CrossChainTransactionProps> = ({
  srcToken,
  destToken,
  srcTxFee,
  destTxFee,
  srcTxFeeUsd,
  destTxFeeUsd,
  status,
  srcTxLink,
  destTxLink,
  route,
}): JSX.Element => {
  const firstTxStatus =
    status === CrossChainTxStatus?.NOT_CREATED
      ? ProgressStatus.NONE
      : status === CrossChainTxStatus?.FIRST_TX_PENDING
      ? ProgressStatus.IN_PROGRESS
      : status === CrossChainTxStatus?.FIRST_TX_REJECTED
      ? ProgressStatus?.ERROR
      : ProgressStatus.COMPLETED;

  const secondTxStatus =
    status === CrossChainTxStatus?.NOT_CREATED ||
    status === CrossChainTxStatus?.FIRST_TX_PENDING ||
    status === CrossChainTxStatus.FIRST_TX_REJECTED
      ? ProgressStatus.NONE
      : status === CrossChainTxStatus?.SECOND_TX_PENDING
      ? ProgressStatus.IN_PROGRESS
      : ProgressStatus.COMPLETED;

  const firstTxContent = (
    <>
      <div className={`${style.block} ${style.active}`}>
        <CoinsImages symbol={srcToken.symbol} size={'24px'} />
        <div className={style.token}>{srcToken.symbol}</div>
        {srcToken?.address !== usdcToken[srcToken?.chainId].address && (
          <>
            <ArrowRight />
            <div className={style.token}>{CROSS_SWAP_TOKEN}</div>
          </>
        )}
      </div>
      <div className={style.blockInfo}>
        {`Fee: `}
        {/* <NumberFormat
          suffix={` ${chains[srcToken?.chainId].nativeToken.symbol}`}
          decimalScale={4}
          value={srcTxFee}
          displayType="text"
        />
        {` (`} */}
        <NumberFormat suffix={' $'} decimalScale={2} value={srcTxFeeUsd} displayType="text" />
        {/* {`)`} */}
      </div>
    </>
  );

  const secondTxContent = (
    <>
      <div className={`${style.block} ${style.active}`}>
        <CoinsImages symbol={CROSS_SWAP_TOKEN} size={'24px'} />
        <div className={style.token}>{CROSS_SWAP_TOKEN}</div>
        {destToken?.address !== usdcToken[destToken?.chainId].address && (
          <>
            <ArrowRight />
            <div className={style.token}>{destToken.symbol}</div>
          </>
        )}
      </div>
      <div className={style.blockInfo}>
        {destTxFeeUsd > 0 && (
          <>
            {`Fee: `}
            {/* <NumberFormat
              suffix={` ${chains[destToken?.chainId].nativeToken.symbol}`}
              decimalScale={4}
              value={destTxFee}
              displayType="text"
            />
            {` (`} */}
            <NumberFormat suffix={' $'} decimalScale={2} value={destTxFeeUsd} displayType="text" />
            {/* {`)`} */}
          </>
        )}
      </div>
    </>
  );

  return (
    <>
      <div className={style.swapContainer}>
        {srcTxLink ? (
          <a href={srcTxLink} rel="noopener noreferrer" target="_blank">
            {firstTxContent}
          </a>
        ) : (
          <div className={style.blockContainer}>{firstTxContent}</div>
        )}
        <div className={style.line}>
          <ProgressStatusLine status={firstTxStatus} />
        </div>
        <div className={`${style.blockContainer}`}>
          <div className={style.block}>
            <Pools route={route} />
          </div>
        </div>
        <div className={style.line}>
          <ProgressStatusLine status={secondTxStatus} />
        </div>
        {destTxLink ? (
          <a href={destTxLink} rel="noopener noreferrer" target="_blank">
            {secondTxContent}
          </a>
        ) : (
          <div className={style.blockContainer}>{secondTxContent}</div>
        )}
      </div>
    </>
  );
};

export default CrossChainTransaction;
