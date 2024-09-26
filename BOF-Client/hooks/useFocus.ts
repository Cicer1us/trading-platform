import { MutableRefObject, useRef } from 'react';

export const useFocus = (): [MutableRefObject<any>, () => void, () => void] => {
  const htmlElRef = useRef(null);

  const setFocus = () => {
    htmlElRef.current && htmlElRef.current.focus();
  };

  const setBlur = () => {
    htmlElRef.current && htmlElRef.current.blur();
  };

  return [htmlElRef, setFocus, setBlur];
};
