1. deploy oracle provider
2. deploy validators owner registry
3. deploy src tx executor
4. deploy cssmart wallet
5. add oracle provider, validators owner registry to cross chain core
6. update core package on validators and deploy
7. deploy thegraph for all contracts (especially validators registry on avalanche)
8. adapt market makers & executors
9. adapt sdk
10. adapt client

//

1. Deploy oracle provider
2. Set oracle address in OracleProvider from admin
3. Deploy SrcTxExecutor
4. Deploy CCSmartWallet and use OracleProvider|SrcTxExecutor addresses as init params
5. Set smartWallet address in SrcTxExecutor from admin
6. Deploy validators owner registry on avalanche with OracleProvider address as init params
