import React from 'react';
import style from './SubscribeField.module.css';

type Subscription = 'email' | 'tel';

interface SubscribeFieldProps {
  type: Subscription;
  placeholder?: string;
  input: string;
  buttonName?: string;
  requestSent: boolean;
  maxLength: number;
  identifier: string;
  processingText: string;
  submitHandler: (event) => Promise<void>;
  inputHandler: (input: string) => void;
}
/* 
  Generic subscription field and button.
  uses states and submission handling passed by parent component.
  uses identifier prop for dynamic css selectors
*/
const SubscribeField: React.FC<SubscribeFieldProps> = ({
  type,
  placeholder,
  input,
  buttonName,
  requestSent,
  maxLength,
  identifier,
  processingText,
  submitHandler,
  inputHandler,
}: SubscribeFieldProps): JSX.Element => {
  return (
    <>
      <div className={`${style.wrapperField} ${identifier ? style[identifier] : ''}`}>
        <form onSubmit={submitHandler} method="get" className={style.container}>
          <input
            type={type}
            maxLength={maxLength}
            placeholder={placeholder}
            required
            value={input}
            onChange={({ target: { value } }) => {
              inputHandler(value);
            }}
            className={style.field}
          />
          <input
            type="submit"
            value={requestSent ? `${buttonName}` : `${processingText}`}
            data-wait={'Please wait...'}
            className={style.button}
          />
        </form>
      </div>
    </>
  );
};

export default React.memo(SubscribeField);
