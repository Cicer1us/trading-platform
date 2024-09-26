import React, { useEffect } from 'react';
import styles from './ErrorPage.module.css';
import { LogoBig } from '@/icons/Logo';
import { useRouter } from 'next/router';

interface ErrorProps {
  displayMessage: string;
  redirectToHomepage: boolean;
}

const ErrorPage: React.FC<ErrorProps> = ({ displayMessage, redirectToHomepage }: ErrorProps) => {
  const router = useRouter();

  useEffect(() => {
    if (redirectToHomepage)
      setTimeout(() => {
        router.push('/');
      }, 4000);
  }, []);
  return (
    <>
      <div className={styles.bg}>
        <div className={styles.wrapper}>
          <div className={styles.logo} onClick={() => router.push('/')}>
            <LogoBig />
          </div>
          <h1 className={styles.title}>{displayMessage}</h1>
          {redirectToHomepage && (
            <div className={styles.redirect}>
              <div>Redirecting you back to the homepage</div>
              <div className={styles.dotWrapper}>
                <div className={styles.dotTyping}></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default ErrorPage;
