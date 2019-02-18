#! /usr/bin/env node
const tupelo = require('tupelo-client')
const fs = require('fs')
const { CuckooFilter } = require('bloom-filters')
const buildValidator = require("./validator/build.js").build

const ERROR_CODE_NOT_FOUND = 6

const STOCK_COUNT = 5

const client = tupelo.connect('localhost:50051', { walletName: 'stock-issuer-demo', passPhrase: 'insecure'})

let validatorScript = null

const generateNFTStock = async (companyChainId) => {
  const {keyAddr,} = await client.generateKey()
  const {chainId,} = await client.createChainTree(keyAddr)

  await client.setData(chainId, keyAddr, "issuer", companyChainId)
  await client.setData(chainId, keyAddr, "validIf", validatorScript)
  return chainId
}

const run = async () => {
  try {
   await client.register()
  } catch (error) {
    if (error.code != ERROR_CODE_NOT_FOUND) {
      throw error
    }
  }

  const {keyAddr,} = await client.generateKey()
  const {chainId,} = await client.createChainTree(keyAddr)

  console.log("Company key: " + keyAddr + " chain: " + chainId)

  const issuedFilter = new CuckooFilter(STOCK_COUNT * 2, 4, 2)
  const revokedFilter = new CuckooFilter(STOCK_COUNT * 2, 4, 2)

  await client.setData(chainId, keyAddr, "issued", issuedFilter.saveAsJSON())
  await client.setData(chainId, keyAddr, "revoked", revokedFilter.saveAsJSON())

  dids = []
  for (let i = 0; i < STOCK_COUNT; i++) {
    did = await generateNFTStock(chainId)
    dids.push(did)
    issuedFilter.add(did)
  }

  await client.setData(chainId, keyAddr, "issued", issuedFilter.saveAsJSON())

  const resolved = (await client.resolve(chainId, "issued")).data[0]
  const resolvedFilter = CuckooFilter.fromJSON(resolved)

  for (let i = 0; i < STOCK_COUNT; i++) {
    if (resolvedFilter.has(dids[i])) {
      console.log(dids[i] + " IS valid")
    } else {
      console.log(dids[i] + " IS INVALID")
    }
  }
}

buildValidator().then((built) => {
  validatorScript = fs.readFileSync(built, 'utf8')
  run()
}, (error) =>  {
  throw error
})
