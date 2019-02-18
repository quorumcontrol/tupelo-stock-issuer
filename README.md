# tupelo-stock-issuer
Demo app for issuing off-chain verified shares

## Install
`npm install`

Make sure [tupelo rpc-server](https://docs.quorumcontrol.com/tutorials/rpc_server) is running

## Usage

### Generate new stock
`node issue.js`

This will print the company key address and chain id for the stock, followed by all issued shares.

### Revoke a share
`node revoke.js {companyKeyAddr} {companyChainId} {shareChainIdToRevoke}`

## Validation
Shares are validated using embedded js in the chaintree under the `validIf` property. See [`validator/src/validator.js`](validator/src/validator.js)
