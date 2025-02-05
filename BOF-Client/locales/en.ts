import { TrendingMarket } from '@/interfaces/Markets.interface';

export default {
  landing: {
    title: `
      Stay anonymous while utilizing the power of crypto leverage trading.
    `,
    subtitle: `
      Diversify your crypto portfolio with advanced financial tools for your crypto holdings.
    `,
    titleExchange: `
      Exchange in a quick and convenient way
    `,
    subtitleExchange: `
      bitoftrade allows you to anonymously apply leverage and limit crypto trading. Simply connect your MetaMask wallet and start increasing potential profits!
    `,
  },
  markets: {
    title: 'Markets',
    description:
      'Ready for a high-frequency trading on decentralized on-chain exchanges? Wondering what is the best crypto to day trade? The bitoftrade Markets page offers a variety of investment options and resources to help you make informed decisions.',
    searchPlaceholder: 'Search a token name...',
    leverageTrading: 'Leverage Trading',
    searchResult: 'Search Results',
    nothingToShow: 'Nothing to show',
    infoTitle: `Today's Cryptocurrency Prices by Market Cap`,
    globalCapTitle: `The global crypto market cap is`,
    overLastDay: `over last day.`,
    dayHours: '24h',
    [TrendingMarket.GAINER]: 'Top Gainers',
    [TrendingMarket.LOSER]: 'Top Losers',
    [TrendingMarket.POPULAR]: 'Most Popular',
    tokenTable: `Token Table`,
    allCategories: 'All',
    somethingWentWrong: 'Oops. Something went wrong. Try to reload the page.',
    news: 'News',
    blogs: 'Blogs',
    blogButton: 'Blog',
    leverageButton: 'Leverage',
    swapButton: 'Swap',
    marketCap: 'Market Cap',
    newsFeed: 'News feed',
    marketCapRank: 'Market Cap Rank',
    aboutMarket: (symbol: string) => `About ${symbol}`,
  },
  nav: {
    markets: 'Markets',
    trading: 'Trading',
    creditDeposit: 'Credit Deposit',
    tokens: 'Tokens',
    config: 'Config',
    profitData: 'Profit Data',
    tradeLog: 'Trade Log',
    setting: 'Setting',
    main: 'Main',
    vacancies: 'Vacancies',
  },
  header: {
    notAvailable: ([service]) => `This chain isn't available for ${service}`,
    connect: 'Connect Wallet',
    copied: 'Copied',
    wrongNetwork: 'Wrong chain',
    leverage: 'Leverage',
    limit: 'Limit',
    swap: 'Swap',
    fiat: 'Fiat',
    'cross-chain': 'Cross Chain',
    markets: 'Markets',
    testnet: 'Testnet',
  },
  table: {
    amount: 'Amount',
    price: 'Price',
    total: 'Total',
    symbol: 'Symbol',
    open: 'Open',
    high: 'High',
    low: 'Low',
    close: 'Close',
    change: 'Change',
    volume: 'Volume',
    time: 'Time',
    fee: 'Fees',
    fees: 'Fees',
    date: 'Date',
    pair: 'Pair',
    sent: 'Sent',
    received: 'Received',
    leverage: 'Leverage',
    buySell: 'Buy/Sell',
    profitLoss: 'Profit/Loss',
    position: 'Position',
    status: 'Status',
    action: 'Action',
    triggerPrice: 'Trigger Price',
    type: 'Type',
    goodTillTime: 'Good Till',
    filled: 'Filled',
    averageOpen: 'Average open',
    averageClose: 'Average close',
    openingTime: 'Opening time',
    closingTime: 'Closing time',
    actionHelper: 'Press here to close your order.',
    actionLeverageHelper: 'Press here to close your position.',
    triggerPriceLeverageHelper:
      'When the index price of this market crosses your trigger price, your stop order will convert to a limit order',
    goodTillTimeHelper: 'Time till your order will be canceled automatically',
    filledHelper: 'Indicates the part of your initial order which been executed',
    sentHelper: 'The amount of tokens you sold',
    receivedHelper: 'The amount of tokens you bought',
    dateHelper: 'Date and time of the transaction',
    statusHelper: 'Could be pending/done. when clicking on it, you get redirected to Etherscan.',
    feeHelper: 'Total fees of your transaction.',
    protocolFeeHelper: 'Protocol fees of your transaction.',
    gasFeeHelper:
      'Gas fees of your transaction. Currently, we display the highest potential gas fee for your transaction.',
    sentLimitHelper: 'The amount of tokens you sold',
    receivedLimitHelper: 'The amount of tokens you bought',
    statusLimitHelper: 'Could be opened/pending/closed. when clicking on it you get redirected to etherscan. ',
    feeLimitHelper: 'The fees total you paid for this transaction',
    openingHelper: 'Time and date of opening the order',
    closingHelper: 'Time and date of closing the order',
    pairLevHelperText: 'Pair',
    levHelperText: 'This refers to how much you multiply your collateral for a certain position.',
    sideLevHelperText: 'Open position direction. Buy - if you think token goes up, or sell if down.',
    profitLossHelperText: 'This shows your profit/losses in real time.',
    leverageTradeAmountHelperText: 'Trade size (in tokens).',
    leverageTradePriceHelperText: 'Price at the time of the trade (USD).',
    leverageTradeTotalHelperText: 'Total amount traded (USD).',
    leverageTradeOrderTypeHelperText:
      'Varies based on order type you use. Could be Market, Limit, Stop limit or Liquidated.',
    positionHelperText: "Open position you'll hold (in tokens).",
    statusLevHelperText: 'Could be opened/pending/closed.',
    realizedPnl: 'Realized P&L',
  },
  widget: {
    crossChainMobileWarningTitle: 'Cross-chain trading is not available on mobile devices',
    crossChainMobileWarningDescription: 'Please, use desktop version of the site to trade on the cross-chain',
    connect: 'Connect Wallet',
    tokenSelectPlaceholder: 'Find a token by name or address',
    leverageSelectPlaceholder: 'Find a market by name',
    createAccount: 'Set up your wallet',
    makeDeposit: 'Make a Deposit',
    depositNeeded: 'You must deposit funds before you can place orders.',
    metamaskIsNotInstalled: 'Please download and install MetaMask wallet to use our service.',
    wrongChainTitle: 'Sorry, wrong chain',
    availableChainsMessage: ([chainsList]) => `This service is available on ${chainsList}.`,
    wrongChainMessage: ([chain]) => `You are currently connected to bitoftrade on ${chain}.`,
    switchTo: ([chain]) => `Switch to ${chain}`,
    transactionDetails: 'Transaction details: ',
    connectWalletDescription: 'Connect your Ethereum wallet to start trading.',
    defaultErrorMessage: 'Not enough liquidity',
    insufficientBalance: 'Insufficient balance',
    shortTokensList: 'Top Tokens',
    longTokensList: 'All Tokens',
    selectTradingType: 'Select Trading Type',
    slippage: 'Slippage',
    gasFee: 'Gas fees',
    leverageLevel: 'Leverage level',
    leverageLevelHelper: `this refers to how much you'd like to multiply your collateral and increase your buying power`,
    positionMargin: 'Position margin',
    positionMarginHelper: 'Margin needed to open a position (in USDC)',
    openPosition: 'Open position',
    openPositionHelper: `Open size (in tokens).`,
    leverage: 'Leverage',
    limit: 'Limit',
    unlockToken: ([token]) => `Unlock ${token}`,
    market: 'Market',
    stop_limit: 'Stop',
    swap: 'Market',
    pay: 'You Pay',
    receive: 'You Receive',
    confirmSwap: 'Confirm Swap',
    amount: 'Amount',
    limitPrice: 'Limit Price',
    timeRange: 'Time Range',
    triggerPrice: 'Trigger Price(USD)',
    period: 'Time Range',
    periodHelper: `The period of time your order will stay open, if market conditions won't match the ones you set.`,
    priceLimit: 'Price limit',
    priceLimitHelper: 'The execution price of your order.',
    buy: 'Buy',
    sell: 'Sell',
    recommendedLeverage: 'Recommended leverage',
    inputParameters: 'Your input parameters',
    confirmLeverage: 'Confirm Leverage',
    confirmLimit: 'Confirm Limit',
    confirmStopLimit: 'Confirm Stop Limit',
    confirmProfitLimit: 'Confirm Profit Limit',
    yourBalance: 'Your Balance',
    depositInProgress: 'Deposit in progress',
    power: 'Buying power',
    equity: 'Equity',
    marginUsage: ' Margin usage',
    deposit: 'Deposit',
    withdraw: 'Withdraw',
    asset: 'Asset',
    fee: 'Fee',
    depositAssetHelper: 'Asset you depositing to the leverage account',
    withdrawAsseHelper: 'Asset you withdrawing from the leverage account',
    accountLeverage: 'Account leverage',
    confirmDeposit: 'Confirm Deposit',
    unrealizedPl: 'Total Unrealized P&L',
    copy: 'copied',
    payLimit: 'You Pay',
    payLimitHelper: 'The amount of tokens you sell based on price limit',
    receiveLimit: 'You Receive',
    receiveLimitHelper: `Amount of the token you'd like to buy based price limit.`,
    payHelper: 'The amount of tokens you sell based on current market rates',
    receiveHelper: 'The amount of tokens you buy based on current market rates',
    approveToken: ([tokenName]) => `Approve ${tokenName}`,
    enterAmount: 'Enter Amount',
    confirm: 'Confirm',
    maxAmount: 'Max',
    lessMaxAmount: 'Enter Less Max Amount',
    lessCurrentEquity: 'Enter Less Your Equity',
    approve: 'Approve',
    txConfirmed: 'transaction was confirmed',
    txRejected: 'transaction rejected',
    withdrawal: 'Withdrawal',
    withdrawalMessage: 'Done. Please wait a little',
    depositSubmitted: 'Your deposit transaction was successfully submitted.',
    depositTxSuccess: 'You deposit transaction was confirmed',
    notEnoughFunds: 'Not enough funds',
    pendingApprove: 'Pending approve...',
    connectWith: 'Connect Metamask',
    leverageOnboarding: 'Please make a deposit to enable leverage trading.',
    linkYourWallet: 'Link your wallet',
    setupWallet: 'Setup Wallet',
    unlockUsdc: 'Unlock USDC',
    depositUsdc: 'Deposit USDC',
    checkBalance: 'Check Your Balance',
    approvalPending: 'Approval is pending',
    mightTakeAFewMinutes: 'This might take a few minutes',
    linkYourWalletDescription: 'You need to sign two requests, signing is free and will not trigger a transaction.',
    createAccountDescription: 'This step is needed to start trading on the layer-2 blockchain system.',
    unlockUsdcDescription: 'Permission for a certain token to interact with a smart contract.',
    depositUsdcDescription: 'Amount of USDC will be used as a collateral for leverage trading.',
    checkBalanceDescription:
      'After the deposit transaction is mined, 10 Ethereum chain confirmations (usually about 3 minutes) are required for your funds to be available to trade.',
    wallet: 'Wallet',
    setup: 'Setup',
    unlock: 'Unlock',
    balance: 'Balance',
    linkWallet: 'Link Wallet',
    selectToken: 'Select token',
    placeholderSearchTokens: 'Search by symbol',
    depositAlertMsg:
      'After the deposit transaction is mined, 10 Ethereum network confirmations (usually about 3 minutes) are required for your funds to be available to trade.',
    withdrawAlertMsg: 'Max available amount for withdrawal equals assets on balance minus withdrawal fees.',
    failureTitle: 'Error',
    failureText: 'Oops! Something went wrong',
    leverageTradingUnAvailable: 'Leverage trading is unavailable',
    apologizeForInconvenience: 'We apologize for the inconvenience.',
    unAvailableAvailableForUsCitizens: 'Our leverage feature is unavailable for US users at the moment.',
    checkOutSwapAndLimit: 'Please check out our swap and limit services.',
    fees: 'Fees',
    minimumReceived: 'Minimum Received',
    estimation: 'Estimated Received',
    from: 'from',
    to: 'to',
  },
  swapModal: {
    createSwap: 'Create Swap',
    confirmSwap: 'Confirm Swap',
    transactionDetails: 'Transaction Details',
    checkAndConfirm: 'Please, check your transaction details and confirm it.',
    pendingTransaction: 'Your Transaction is Being Processed',
    requestCreated: 'Request created',
    requestConfirmed: 'Request confirmed',
    requestCancelled: 'Request cancelled',
    approveTitle: ([tokenName]) => `Unlock ${tokenName} transfer`,
    title: 'Transaction Summary',
    description: 'You will receive a notification when your transaction is completed.',
    approveDescription: ([tokenAmount, tokenName]) =>
      `Our smart contract needs your permission in order to move ${tokenAmount} ${tokenName} on your behalf.`,
    sectionTitleModal: 'Transaction details: ',
    gas: 'Estimated gas fees',
    slippage: 'Slippage',
    firstApproveButton: 'Unlock Permanently',
    secondApproveButton: 'Unlock This Trade',
    getIt: 'Get it',
    slippageHelper:
      'Slippage is the difference between the price you expect to get on the crypto you have ordered and the price you actually get when the order executes.',
    gasHelper:
      'Gas is the term for the amount of ether (ETH) required by the network for a user to interact with the network',
    systemFee: 'System fee',
    swap: 'Swap',
    swapCreated: 'Your transaction was successfully created',
    swapConfirmed: 'Your transaction was completed',
    swapRejected: 'Your transaction was rejected',
    approve: 'Approve',
    approveCreated: 'Please wait for approval.',
    approveConfirmed: 'Your approval was confirmed.',
    approveCancelled: 'Your request was cancelled.',
    crossSwapFirstTxCreated: 'First transaction was created',
    crossSwapFirstTxCompleted: 'First transaction was completed',
    crossSwapSecondTxCompleted: 'Your swap was completed',
  },
  limitModal: {
    signingRejected: 'Order signing was rejected.',
    requestCreated: 'Request created',
    requestConfirmed: 'Request confirmed',
    requestCancelled: 'Request cancelled',
    approveTitle: ([tokenName]) => `Unlock ${tokenName} transfer`,
    approveDescription: ([tokenAmount, tokenName]) =>
      `Our contract needs your permission in order to move ${tokenAmount} ${tokenName} on your behalf.`,
    firstApproveButton: 'Unlock Permanently',
    secondApproveButton: 'Unlock Amount',
    title: 'Transaction Summary',
    receive: 'You will receive',
    receiveHelper: `the estimated amount of tokens you'll receive`,
    description: 'Transaction details: ',
    fees: 'System fees',
    feesHelper: `we charge 0.2% for this transaction. We won't charge any commission if the swap won't get executed.`,
    riskDisclaimer: 'Risk disclaimer',
    riskDescription:
      'When leveraging your funds, there is a risk of losing your collateral. The open position will be liquidated if the margin provided will not cover the losses. Liquidation incurs an additional 1% fee',
    getIt: 'Confirm Limit',
    limitOrder: 'Limit',
    limitOrderNotCreated: 'Order was not created',
    limitOrderFailedApi: 'Failed to fetch the order.',
    limitOrderCannotHash: 'Failed to fetch the order hash.',
    limitOrderFailedPost: 'Failed to create your order in our servers.',
    limitOrderCreated: 'Your order was successfully created',
    approve: 'Approve',
    approveCreated: 'Your approval request was created',
    approveConfirmed: 'Your approval was confirmed',
    approveCancelled: 'Your approval was cancelled',
  },
  limitCancelOrderModal: {
    title: 'Cancel Order',
    description: 'Transactions details:',
    pay: 'You pay',
    receive: 'You will receive',
    cancel: 'Cancel Order',
    leave: 'Leave Unchanged',
    cancelLimitOrder: 'Limit',
    cancelLimitOrderCreated: 'A limit Order Cancellation was created',
    cancelLimitOrderCancelled: 'Your limit order was successfully cancelled.',
    cancelLimitOrderRejected: 'Limit Order Cancellation was rejected',
  },
  leverageModal: {
    summary: 'Transaction Summary',
    orderSummary: 'Order Summary',
    detail: 'Transaction details',
    liquidation: 'Liquidation price',
    liquidationPrice: 'Liquidation price',
    fee: 'System fees',
    type: 'Type',
    pair: 'Pair',
    price: 'Price',
    triggerPrice: 'Trigger price',
    amount: 'Amount',
    riskTitle: 'Risk disclaimer',
    riskDescription:
      'When leveraging your funds, there is a  risk of loosing your collateral provided. The position will be liquidated if the margin provided will not cover losses from the open position. Position liquidation will cost an additional 1% fee.',
    confirm: 'Confirm Leverage',
    orderCancellation: 'Order cancellation',
    cancelOrder: 'Cancel order',
    positionClosing: 'Position closing',
    closePosition: 'Close position',
    closeDescription: 'Are you sure you want to close the deal?',
    profitLoss: 'Profit/Loss',
    positionAutoClose: 'Position Auto Close',
    selectOptions: 'Select Options',
    profit: 'Profit',
    stopLoss: 'Stop Loss',
    setTakeProfit: 'Set Take Profit',
    setStopLoss: 'Set Stop Loss',
    placeOrder: 'Place Order',
    buy: 'Buy',
    sell: 'Sell',
    testnet: 'Testnet (Goerli)',
    virtualTradingDescription:
      'You’ll be able to try our leverage trading without risking real funds. Test your strategy and experience more of bitoftrade features.',
    awesome: 'Awesome!',
  },
  dYdXModal: {
    setupWallet: 'Setup Wallet',
    title: 'Link Wallet',
    description: 'You will receive two signature requests. Signing is free and will not send a transaction.',
    firstStepTitle: 'Verify ownership',
    firstStepDescription: 'Confirm you are owner of this wallet.',
    secondStepTitle: 'Enable trading',
    secondStepDescription: 'Enable secure access to our API for lightning quick trading.',
    send: 'Send Request',
    tryAgain: 'Try Again',
    createTitle: 'Create an Account',
    createDescription: 'We need to setup your wallet for leverage trading.',
    approve: 'Approve',
  },
  crosschainModal: {
    networksSelectTitle: 'Networks and Tokens',
  },
  transaction: {
    title: 'Your positions',
    more: 'See more',
    empty: 'List is empty',
    swapTitle: 'Your Transaction History',
    limitTitle: 'Your Transaction History',
    leverageTitleTrades: 'Your trades',
    leverageTitlePositions: 'Your positions',
    leverageTitleOrders: 'Your orders',
    leverageOpenedPositionsTitle: 'Your opened positions',
    leverageClosedPositionsTitle: 'Your closed positions',
    leverageTradesTitle: 'Your trades',
    leverageSeeTrades: 'See trades',
    leverageSeePositions: 'See positions',
    days: 'days',
    firstTxPending: 'Your Transaction is Being Processed',
    firstTxRejected: 'Your Transaction was Rejected',
    secondTxPending: 'Second Transaction is Being Processed',
    swapCompleted: 'Your Cross Swap Is Completed',
  },
  tableCell: {
    done: 'Done',
    open: 'Open',
    closed: 'Closed',
    cancelled: 'Cancelled',
    cancelling: 'Cancelling',
    expired: 'Expired',
    filled: 'Filled',
    pending: 'Pending',
    opening: 'Opening time',
    closing: 'Closing time',
    sent: 'Sent',
    rate: 'Rate',
    received: 'Received asset',
    cost: 'Cost',
    fees: 'Fees',
    date: 'Date',
    status: 'Status',
    expiration: 'Expiration data',
    side: 'Side',
    pair: 'Pair',
    collateral: 'Collateral',
    leverage: 'Leverage',
    pl: 'PL',
    liquidation: 'Liquidation Price',
    long: 'Buy',
    short: 'Sell',
    buy: 'Buy',
    sell: 'Sell',
    close: 'Close',
    cancel: 'Cancel',
    unavailable: 'Unavailable',
  },
  chart: {
    day: 'D',
    week: 'W',
    month: 'M',
    sryForWaiting: 'Sorry for the waiting',
    notAvailable: 'Chart data is not available',
    pastDay: '(1 day)',
    pastWeek: '(1 week)',
    pastMonth: '(1 month)',
  },
  unlockModal: {
    unlockTitle: ([tokenSymbol]) => `Unlock ${tokenSymbol} Transfer`,
    unlockDescription: ([tokenAmount, tokenSymbol]) =>
      `Our contract needs your permissions in order to move ${tokenAmount} ${tokenSymbol} on your behalf`,
    permanentUnlock: 'Unlock Permanently',
    thisTimeUnlock: 'Unlock This Time Only',
  },
  pendingModal: {
    pendingApproveTitle: ([tokenSymbol]) => `Unlock ${tokenSymbol} Transfer`,
    pendingDepositTitle: ([tokenSymbol]) => `Deposit ${tokenSymbol} transaction pending`,
    pendingTitle: ([tokenSymbol]) => `Pending Approval ${tokenSymbol}`,
    pendingApproveDescription: ([tokenSymbol]) =>
      `Our smart contract needs your permissions in order to move ${tokenSymbol} on your behalf.`,
    pendingDepositDescription: 'This step is needed to start leverage trading.',
    checkInEtherscan: 'Check in Etherscan',
    checkOnExplorer: 'Check on Explorer',
    pendingDescription: ([tokenSymbol]) =>
      `Your approval is needed to unlock ${tokenSymbol} for your upcoming transaction.`,
  },
  confirmActionModal: {
    withdrawTitle: ([tokenSymbol]) => `Withdraw ${tokenSymbol}`,
    depositTitle: ([tokenSymbol]) => `Deposit ${tokenSymbol}`,
    txDetails: 'Transactions details:',
    gasFee: 'Estimated gas fee',
    totalWithdrawAmount: 'Total withdrawal amount',
    totalDepositAmount: 'Total deposit amount',
    cancelDeposit: 'Cancel Deposit',
    cancelWithdraw: 'Cancel Withdraw',
    confirmWithdraw: 'Confirm Withdraw',
    confirmDeposit: 'Confirm Deposit',
  },
  homepage: {
    about: 'About',
    seoTitle: 'bitoftrade | Crypto Trading Platform',
    seoDescription:
      'bitoftrade is a no KYC crypto exchange that takes traditional crypto trading to the next level. Make leverage, limit, and swap trades instantly and anonymously.',
    networks: 'Networks',
    trading: 'Trading Platform',
    ccs: 'Cross-Chain',
    widget: 'Widget',
    tokens: 'Tokens',
    support: 'Support',
    faq: 'FAQ',
    learn: 'Learn',
    wallets: 'Wallets',
    team: 'Team',
    blog: 'Blog',
    startTrading: 'Start Trading',
  },
  blog: {
    titleBlog: 'bitoftrade Blog',
    latestPosts: 'Latest posts',
    next: 'Next',
    previous: 'Previous',
    readMore: 'Read more',
    empty: 'List is empty',
  },
  article: {
    empty: 'List is empty',
    relatedPosts: 'Related posts',
    browseAllArticles: 'Browse all articles',
  },
  footer: {
    whitePaper: 'Whitepaper',
    anonymousTrading: 'Anonymous trading',
    features: 'Features',
    swap: 'Swap',
    limit: 'Limit',
    leverage: 'Leverage',
    fees: 'Fees',
    blog: 'Blog',
    requestFeature: 'Request A Feature',
    termsOfUse: 'Terms of Service',
    contactUs: 'Contact Us',
    startTrading: 'Start Trading',
    helpCenter: 'Help Center',
  },
  subscribeBlock: {
    subtitle: 'Exciting developments and updates are coming to bitoftrade. Be the first to know!',
    buttonText: 'Subscribe',
    enterYouEmail: 'Enter your email',
    thanks: 'Thanks for subscribing to our newsletter',
    oops: 'Oops! Something went wrong',
    processingText: 'Sending...',
  },
  callMe: {
    buttonText: 'Send',
    fieldText: 'Enter your phone',
    successText: 'One of our advisors will contact you soon!',
    failureText: 'Oops! Something went wrong',
    processingText: 'Please wait...',
  },
  CallUsWidget: {
    buttonText: 'Call Us',
    errorText: 'Due to technical difficulties at the moment, we cannot connect your call',
  },
  swapWidgetTooltip: {
    youPay: 'The amount of tokens you sell based on current market rates.',
    youReceive: 'The amount of tokens you buy based on current market rates.',
    slippage:
      'Slippage occurs because of changing market conditions between the moment the transaction is submitted and its verification.',
    estimate:
      'Gas is the term for the amount of ether (ETH) required by the network for a user to interact with the network. ',
  },
  crossChainWidgetTooltip: {
    youPay: 'The amount of tokens you sell based on current market rates.',
    youReceive: 'The amount of tokens you buy based on current market rates.',
    fees: 'The total fees for this crosschain swap substituted from the destination token',
    estimate: 'The total estimated amount to be received of the destination token',
  },
  swapTransactionHistoryTooltip: {
    paid: 'The amount of tokens you sold.',
    received: 'The amount of tokens you bought.',
    rate: 'Price of the token you bought when the transaction was executed.',
    fees: 'Total fees of your transaction.',
    date: 'Date and time of the transaction.',
    status: "Could be pending/done. When clicking on it, you'll be redirected to Etherscan.",
  },
  swapPopupTooltip: {
    slippage:
      'Slippage occurs because of changing market conditions between the moment the transaction is submitted and its verification.',
    fees: "We charge 0.2% for this transaction. We won't charge any commission if the swap isn't executed.",
    estimate:
      'Gas is the term for the amount of ether (ETH) required by the network for a user to interact with the network. ',
  },
  limitWidgetTooltip: {
    pay: 'The amount of tokens you sell based on the price limit.',
    range: "The period of time your order will stay open, if market conditions won't match the ones you set.",
    priceLimit: 'The execution price of your order.',
    receive: "Amount of the token you'd like to buy based on price limit.",
  },
  limitTransactionSummaryTooltip: {
    fees: "We charge 0.2% for this transaction. We won't charge any commission if the limit order isn't executed.",
    gasFee:
      'Gas is the term for the amount of ether (ETH) required by the network for a user to interact with the network. ',
    cost: 'Total transaction cost estimation.',
    receive: "The estimated amount of tokens you'll receive:",
  },
  limitTransactionHistoryTooltip: {
    sent: 'The amount of tokens you sold.',
    received: 'The amount of tokens you bought.',
    rate: "Price limit you've set for this particular transaction.",
    fees: 'The total fees you paid for this transaction.',
    openTime: 'Time and date of opening the order.',
    closeTime: 'Time and date of closing the order.',
    status: 'Could be opened/pending/closed. When clicking on it you get redirected to Etherscan.',
  },
  leverageWidgetTooltip: {
    amount: 'The open order size',
    asset: "The token you'll provide as collateral for leverage trading.",
    withdrawAsset: 'Token that you can withdraw to your wallet',
    leverageLevel: "This refers to how much you'd like to multiply your collateral and increase your buying power",
    positionMargin: 'Margin needed to open a position (in USDC).',
    openPosition: "Open position you'll hold (in tokens).",
    limitPrice: 'The price your order will be placed to the market. Order will be filled at the limit price or better',
    timeRange: "The period of time your order will stay open, if market conditions won't match the ones you set",
    triggerPrice:
      'When the index price of this market crosses your trigger price, your stop order will convert to a limit order',
  },
  leverageModalTooltip: {
    setTakeProfit: 'Profit you willing to get with the open position in $ or %',
    setStopLoss: 'Maximum loss you can take with the open position in $ or %',
  },
  leverageTransactionSummaryTooltip: {
    liquidation: 'The price when a trader is unable to meet the margin requirements for a leveraged position.',
    fees: ' dYdX leverage protocol fees, they charge up to 0.05% for opening/closing a position.',
    gasFee:
      'Gas is the term for the amount of ether (ETH) required by the network for a user to interact with the network. ',
    cost: 'Total estimated transaction costs.',
    profitLoss: 'This shows your profit/losses in real time.',
  },
  leveragePositionsTooltip: {
    leverage: 'This refers to how much you multiply your collateral for a certain position.',
    buySell: 'Open position direction. Buy if you think token goes up, or sell if down. ',
    collateral:
      'The amount you deposited which will be used as a guarantee the trader will meet obligations on open positions.',
    profitLoss: 'This shows your profit/losses in real time.',
    position: "Open position you'll hold (in tokens).",
    status: 'Could be opened/pending/closed.',
    action: 'Press here to close your position.',
  },
  leverageClickedPositionTableTooltip: {
    funding: 'link for article? ',
    liquidation:
      'Liquidation refers to when  trader’s leveraged position will be closed buy liquidator due to a partial or total loss of the trader’s initial margin.',
    time: 'Time and date of closing the position.',
  },
  network: {
    network: ' network, please ',
    currentNetwork: 'Your wallet is connected to the ',
    switch: ' switch to ',
    notInstalled: 'MetaMask is not installed. Follow the',
    link: 'link',
    download: 'to download it',
  },
  leverageDropdown: {
    liquidationPrice: 'Liquidation price',
    liquidationPriceHelper:
      'Liquidation refers to when trader’s leveraged position will be closed buy liquidator due to a partial or total loss of the trader’s initial margin.',
    funding: 'Funding',
    fundingHelper: 'Funding',
    openingTime: 'Opening Time',
    openingTimeHelper: 'Time and date of opening the position.',
    closingTime: 'Closing Time',
    closingTimeHelper: 'Time and date of closing the position.',
    averageOpen: 'Average Open',
    averageOpenHelper: 'Average Open',
    averageClose: 'Average Close',
    averageCloseHelper: 'Average Close',
  },
  helpCenterNav: {
    button: 'Help Center',
    header: 'Still have some questions?',
    paragraph: 'Checkout our help center for more useful information on leverage trading crypto and other topics.',
  },
  categories: {
    ['Trading Strategies']: 'Trading Strategies',
    ['Features']: 'Features',
    ['Press']: 'Press',
    ['News']: 'News',
  },
  wallet: {
    requestTimeout: 'Request timeout',
    reloadPage: 'Try to reload the page.',
    connectionFailed: 'Connection failed',
    wrongNetwork: 'Unrecognized network',
  },
  affiliate: {
    registerSuccess: 'Great!',
    success: 'You are now successfully registered to our promo.',
    registerError: 'Registration error',
    registeredToService: 'You have already registered to our service.',
    registeredToPromo: 'You have already registered to this promo.',
    unexpectedError: 'Oops something went wrong. Failed to register to our promo.',
  },
  tradingMetadata: {
    swapTitle: ([tokenA, tokenB]: [string, string]) =>
      `Swap ${tokenA && tokenB ? `${tokenA}/${tokenB}` : ''} | bitoftrade`,
    swapDescription: ([firstTokenSymbol, secondTokenSymbol]: [string, string]) =>
      `The bitoftrade easy-to-use platform lets you to make crypto swap profits easily and quickly. How to convert ${firstTokenSymbol} to ${secondTokenSymbol}? • Select the exchange pair • Enter the amount you wish to swap • Connect your MetaMask wallet • Send ${firstTokenSymbol} and receive ${secondTokenSymbol} coins.`,
    limitTitle: ([tokenA, tokenB]: [string, string]) =>
      `Limit ${tokenA && tokenB ? `${tokenA}/${tokenB}` : ''} | bitoftrade`,
    limitDescription: `bitoftrade is in the list of decentralized exchanges providing Limit Orders! This feature allows you to set specific price points, giving you more power on crypto transaction monitoring. Take full control of your transactions by setting price limits. Select a trading pair and a specific price you want your assets to be sold or bought at.`,
    leverageTitle: ([price, pair]: [string, string]) => `${price} | ${pair} | bitoftrade`,
    leverageDescription: ([pair]: [string]) => `Leverage trading on ${pair} market`,
    fiatExchange: 'Fiat Exchange | bitoftrade',
  },
  crosschain: {},
};
