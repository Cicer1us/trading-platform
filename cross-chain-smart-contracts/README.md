# Cross chain smart contracts

### Environment

- Add environment variables from .env.example

### INSTALL

```bash
yarn
```

### TEST

```bash
yarn test
```

For specific test run:

```bash
npx hardhat test test/src/<specific_test_file_path>.ts
```

### COVERAGE

```bash
yarn coverage
```

## Deployment

- Run deploy script:

```bash
npx hardhat run --network <network> scripts/deploy/<script>
```

- Verify deployed contract:

```bash
npx hardhat verify --network <network> <contract_address>
```

_Implementation contract should be verified first_
