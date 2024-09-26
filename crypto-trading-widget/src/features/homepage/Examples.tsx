import React from 'react';
import Box from '@mui/material/Box';
import BasicCard from 'components/Cards/BasicCard';
import theme from 'theme/theme';

export const Examples: React.FC = () => {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'nowrap',
          gap: '20px',
          marginTop: '56px',
          backgroundPosition: 'center',
          [theme.breakpoints.down('md')]: {
            flexDirection: 'column',
          },
        }}
      >
        <BasicCard
          title={'Token owners'}
          paragraph1={
            'Samantha runs yield farming protocol. To interact with Samantha’s protocol smart contracts, you need SYFP tokens which are traded in a number of DEXs.'
          }
          paragraph2={
            'With an implemented and customized AllPay Widget, Samantha allows protocol users to buy SYFP tokens without leaving the site.'
          }
          imgUrl={'/images/cards/tokenOwners.png'}
        />

        <BasicCard
          title={'Creators'}
          paragraph1={
            'Bob, a famous artist, has decided to create an NFT collection and wants to promote it on his website.'
          }
          paragraph2={'He chose to use the AllPay Widget to pre-sell some of the collections goods on his website.'}
          imgUrl={'/images/cards/creators.png'}
        />

        <BasicCard
          title={'GameFi Metaverse'}
          paragraph1={
            'Xena and her friends are developing a Web3 game. Players are intended to buy and sell NFT items to improve their characters inside the game.'
          }
          paragraph2={
            'With an implemented and customized AllPay Widget, Samantha allows protocol users to buy SYFP tokens without leaving the site.'
          }
          imgUrl={'/images/cards/metaverse.png'}
        />
      </Box>
    </>
  );
};
