import React from 'react';
import { ConnectionType } from 'utils/connections';

export const WalletIcon: React.FC<{ connectionType: ConnectionType }> = ({ connectionType }) => {
  const iconPath = `${process.env.REACT_APP_STORAGE}/${connectionType.toLowerCase()}.svg`;

  return <img src={iconPath} width={40} height={40} />;
};
