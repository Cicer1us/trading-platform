import React from 'react';

const FAQIcon = ({ size = 24, stroke = 'var(--secondaryFont)' }) => {
  return (
    <svg
      width={size}
      height={size}
      style={{ stroke: stroke }}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.09009 8.99999C9.32519 8.33166 9.78924 7.7681 10.4 7.40912C11.0108 7.05015 11.729 6.91893 12.4273 7.0387C13.1255 7.15848 13.7589 7.52151 14.2152 8.06352C14.6714 8.60552 14.9211 9.29151 14.9201 9.99999C14.9201 12 11.9201 13 11.9201 13"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 17H12.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export default FAQIcon;
