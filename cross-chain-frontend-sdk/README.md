# Cross chain details

1. [Slippage](#slippage)
2. [Gas hedging](#gas-hedging)
3. [Protocol fees](#protocol-fees)

## Slippage

- [What is cross chain slippage](#what-is-cross-chain-slippage)
- [Allowed slippage range](#current-allowed-slippage-range)
- [How we calculate it](#how-we-calculate-it)
- [How we execute swaps](#how-we-execute-cross-chain-swaps)

### What is cross chain slippage

Slippage is representing the difference between the expected price of a trade and the actual price at which the trade is executed. It can be negative or positive.

In our case we allow user to set slippage on our frontend. As our cross chain based on connector token approach we need to convert src token to our connector token on src chain and swap connector token to dest token on dest chain.
These two steps during cross chain swap can leads to difference in expected and actual price.

### Current allowed slippage range

On our cross chain swaps we allow users to setup custom slippage from 0 - 100 %.

In basic points it will be 0 - 10 000.

### How we calculate it

- Any Token to Any Token case(ETH Mainnet -> MATIC Polygon example):

  1. Get swap price on src chain: X ETH -> Y USDC
  2. Based on the result of src swap price get dest swap price: Y USDC -> Z MATIC
  3. Calculate min dest amount based on the slippage(it was chosen by user on the FE): Z MATIC \* 1% slippage
  4. Calculate min refund connector token amount in case of dest tx fail: Y USDC \* 1% slippage
  5. Return ideal price(aka destTokenAmount), minDestPrice and minConnectorTokenRefundAmount to frontend:

     ```js
     {
       ...
       destTokenAmount: Z Matic,
       minDestAmount: Z Matic * 1% slippage,
       minConnectorTokenRefundAmount: Y USDC * 1% slippage
       ...
     }
     ```

- Any Token to USDC Token case(ETH Mainnet -> USDC Polygon example):

  1. Get swap price on src chain: X ETH -> Y USDC Mainnet
  2. Based on the result of src swap price detect how much USDC we will send user on dest chain: Y USDC Mainnet -> Y USDC Polygon
  3. Calculate min dest amount based on the slippage(it was chosen by user on the FE): Y USDC Polygon \* 1% slippage
  4. Calculate min refund connector token amount in case of dest tx fail: Y USDC Mainnet \* 1% slippage
  5. Return ideal price(aka destTokenAmount), minDestPrice and minConnectorTokenRefundAmount to frontend:

     ```js
     {
       ...
       destTokenAmount: Y USDC Polygon,
       minDestAmount: Y USDC Polygon * 1% slippage,
       minConnectorTokenRefundAmount: Y USDC Mainnet * 1% slippage
       ...
     }
     ```

- USDC Token to Any Token case(USDC Mainnet -> MATIC Polygon example):

  1. We take user's USDC amount: X USDC
  2. Get swap price on dest chain: X USDC -> Y Matic
  3. Calculate min dest amount based on the slippage(it was chosen by user on the FE): Y Matic \* 1% slippage
  4. As we don't do swap on src chain we don't need to apply slippage to get min refund connector token amount
  5. Return ideal price(aka destTokenAmount), minDestPrice and minConnectorTokenRefundAmount to frontend:

     ```js
     {
       ...
       destTokenAmount: Y Matic,
       minDestAmount: Y Matic * 1% slippage,
       minConnectorTokenRefundAmount: X USDC
       ...
     }
     ```

- USDC Token to USDC Token case(USDC Mainnet -> USDC Polygon example):

  1. We take user's USDC amount: X USDC Mainnet
  2. As we don't need to swap tokens we will send the same amount of USDC: X USDC Polygon
  3. In this case we don't need to apply slippage to get min dest amount
  4. Also, we don't need to apply slippage to min refund connector token amount
  5. Return ideal price(aka destTokenAmount), minDestPrice and minConnectorTokenRefundAmount to frontend:

     ```js
     {
       ...
       destTokenAmount: X USDC Polygon,
       minDestAmount: X USDC Polygon,
       minConnectorTokenRefundAmount: X USDC Mainnet
       ...
     }
     ```

### How we execute cross chain swaps

Paraswap accepts or destAmount or slippage during swap build.

- `Src swap needs to be done via Paraswap` cases:

In this case we pass slippage param from our frontend instead of destAmount. Paraswap accepts it and returns correct swap data for src swap.

- `Dest swap needs to be done via Paraswap` cases:

Our Cross Chain Router emits event with connectorTokenIncome and minDestAmount. We take these params and build dest swap once src swap was completed. Paraswap accepts connectorTokenIncome as srcAmount and minDestAmount as destAmount and returns correct swap data for dest swap.

## Gas hedging

> TODO: add info about gas hedging flow

## Protocol fees

> TODO: add info about protocol fees
