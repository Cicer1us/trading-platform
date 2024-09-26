import { useState, useCallback } from 'react';
import { useInterval } from 'usehooks-ts';

type UseTimerInput = {
  secondsToWait: number;
  callBack?: () => void;
  autoStart?: boolean;
};

type UseTimerOutput = {
  countdown: number;
  retrigger: () => void;
  triggered: boolean;
};

export const useTimer = ({ secondsToWait, callBack, autoStart = true }: UseTimerInput): UseTimerOutput => {
  const [countdown, setCountdown] = useState(secondsToWait);
  const [triggered, setTriggered] = useState(false);

  const retrigger = useCallback(() => {
    setCountdown(secondsToWait);
    setTriggered(true);
  }, [secondsToWait]);

  useInterval(() => {
    if (!autoStart && !triggered) return;

    if (countdown > 0) {
      const newCountdown = countdown - 1;
      if (newCountdown === 0) {
        callBack?.();
      }
      setCountdown(newCountdown);
    }
  }, 1000);

  return {
    countdown,
    retrigger,
    triggered
  };
};
