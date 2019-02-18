#! /usr/bin/env node
const tupelo = require('tupelo-client')
const { CuckooFilter } = require('bloom-filters')

const ERROR_CODE_NOT_FOUND = 6

const client = tupelo.connect('localhost:50051', { walletName: 'stock-issuer-demo', passPhrase: 'insecure'})

const run = async () => {
  try {
   await client.register()
  } catch (error) {
    if (error.code != ERROR_CODE_NOT_FOUND) {
      throw error
    }
  }

  const args = process.argv.slice(2)
  if (args.length != 3) {
    throw new Error("revoke.js requires 3 arguments: companyKeyAddr companyChainId chainIdToRevoke")
  }

  const keyAddr = args[0]
  const chainId = args[1]
  const toRevoke = args[2]

  const resolvedRevoked = (await client.resolve(chainId, "revoked")).data[0]
  const resolvedRevokedFilter = CuckooFilter.fromJSON(resolvedRevoked)

  resolvedRevokedFilter.add(toRevoke)

  await client.setData(chainId, keyAddr, "revoked", resolvedRevokedFilter.saveAsJSON())

  console.log("Revoked " + toRevoke + " on stock " + chainId)
}

run()
