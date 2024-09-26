import React from 'react';

const SearchIcon = ({ size = 14 }) => (
  <svg fill="transparent" stroke="var(--font)" width={size} height={size}>
    <circle cx="6.5" cy="6.5" r="4.75" strokeWidth="1.5" />
    <path d="M9.5 9.5L13 13" strokeWidth="1.5" />
  </svg>
);

export default SearchIcon;
