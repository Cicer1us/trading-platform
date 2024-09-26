import React, { useState } from 'react';
import style from './SubscribeEmail.module.css';
import senderEmail from 'API/googleSheets/senderEmail';
import TagManager from 'react-gtm-module';
import SubscribeField from '../SubscribeField/SubscribeField';

const onSubscribe = (): void => {
  const storage = globalThis?.sessionStorage;
  const localStorage = globalThis?.localStorage;
  if (!storage || !localStorage) return;

  const prevPath = storage.getItem('prevPath');
  const currentPath = storage.getItem('currentPath');

  let prevPathShow;

  switch (prevPath) {
    case 'null':
    case currentPath:
      prevPathShow = undefined;
      break;
    default:
      prevPathShow = prevPath;
      break;
  }

  const tagManagerArgsCE = {
    gtmId: process.env.NEXT_PUBLIC_GA_ID,
    dataLayer: {
      event: `CE newsletter_subscribe`,
      page: { from_path: prevPathShow, to_path: currentPath },
    },
  };
  TagManager.dataLayer(tagManagerArgsCE);
};

interface SubscribeProps {
  title?: string;
  enterYourEmail?: string;
  buttonName?: string;
  sended?: () => void;
}

const Subscribe: React.FC<SubscribeProps> = ({
  title,
  sended = () => {
    return;
  },
}: SubscribeProps): JSX.Element => {
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>('');

  const handlerSubmit = async (event): Promise<void> => {
    event.preventDefault();
    setIsSending(true);
    const res = await senderEmail(title, 'anonymous', emailInput);

    if (res) {
      setIsError(false);
      setIsSuccess(true);
      onSubscribe();
      setIsSending(false);
      setEmailInput('');
      sended();
    } else {
      setIsError(true);
      setIsSending(false);
    }
  };

  return (
    <div className={style.wrapper}>
      <h2 className={style.title}>
        {title || 'Exciting developments and updates are coming to bitoftrade. Be the first to know!'}
      </h2>
      <div className={style.action}>
        {!isSuccess && (
          <SubscribeField
            type="email"
            input={emailInput}
            placeholder={'Enter your email'}
            buttonName="Subscribe"
            processingText={'Sending...'}
            requestSent={!isSending}
            maxLength={256}
            identifier={'homepageSubscribe'}
            submitHandler={handlerSubmit}
            inputHandler={setEmailInput}
          />
        )}
        {isSuccess && <div className={style.successMessage}>{'Thanks for subscribing to our newsletter'}</div>}
        {isError && <div className={style.errorMessage}>{'Oops! Something went wrong'}</div>}
      </div>
    </div>
  );
};

export default React.memo(Subscribe);
