import * as React from 'react';
import { SVGProps } from 'react';

const CalendarIcon = (props: SVGProps<SVGSVGElement>) => {
  const { stroke } = props;
  return (
    <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M1 7.82556V4.66766C1 4.2489 1.17559 3.84729 1.48816 3.55118C1.80072 3.25507 2.22464 3.08871 2.66667 3.08871H4.33333M1 7.82556V14.9308C1 15.3496 1.17559 15.7512 1.48816 16.0473C1.80072 16.3434 2.22464 16.5098 2.66667 16.5098H14.3333C14.7754 16.5098 15.1993 16.3434 15.5118 16.0473C15.8244 15.7512 16 15.3496 16 14.9308V7.82556M1 7.82556H16M4.33333 3.08871V1.50977M4.33333 3.08871V4.66766M16 7.82556V4.66766C16 4.2489 15.8244 3.84729 15.5118 3.55118C15.1993 3.25507 14.7754 3.08871 14.3333 3.08871H13.9167M11 3.08871V1.50977M11 3.08871V4.66766M11 3.08871H7.25"
        stroke={stroke || '#A6ACB8'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CalendarIcon;
