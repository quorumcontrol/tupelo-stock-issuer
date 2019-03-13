#! /usr/bin/env node
const tupelo = require('tupelo-client')
const fs = require('fs')
const { CuckooFilter } = require('bloom-filters')
const buildValidator = require("./validator/build.js").build

const ERROR_CODE_NOT_FOUND = 6
const STOCK_COUNT = 5

const IPFS_ADDR = "/ip4/172.28.1.3/tcp/5001";

const companyWallet = tupelo.connect('localhost:50051', { walletName: 'stock-issuer-company', passPhrase: 'insecure'})
const userWallet = tupelo.connect('localhost:50051', { walletName: 'stock-issuer-user', passPhrase: 'insecure'})

let validatorScript = null

const generateNFTStock = async (companyChainId) => {
  const {keyAddr,} = await userWallet.generateKey()
  const {chainId,} = await userWallet.createChainTree(keyAddr)

  await userWallet.setData(chainId, keyAddr, "issuer", companyChainId)
  await userWallet.setData(chainId, keyAddr, "validIf", validatorScript)

  return { chainId: chainId }
}

const run = async () => {
  try {
   await companyWallet.register()
   await userWallet.register()
  } catch (error) {
    if (error.code != ERROR_CODE_NOT_FOUND) {
      throw error
    }
  }

  const {keyAddr,} = await companyWallet.generateKey()
  const {chainId,} = await companyWallet.createChainTree(keyAddr, {
    ipld: {
      address: IPFS_ADDR,
    }
  })

  console.log("Company key: " + keyAddr + " chain: " + chainId)

  const issuedFilter = new CuckooFilter(STOCK_COUNT * 2, 4, 2)
  const revokedFilter = new CuckooFilter(STOCK_COUNT * 2, 4, 2)

  await companyWallet.setData(chainId, keyAddr, "issued", issuedFilter.saveAsJSON())
  await companyWallet.setData(chainId, keyAddr, "revoked", revokedFilter.saveAsJSON())

  stocks = []
  for (let i = 0; i < STOCK_COUNT; i++) {
    stock = await generateNFTStock(chainId)
    stocks.push(stock)
    issuedFilter.add(stock.chainId)
  }

  await companyWallet.setData(chainId, keyAddr, "issued", issuedFilter.saveAsJSON())

  const resolved = (await companyWallet.resolve(chainId, "tree/data/issued")).data[0]
  const resolvedFilter = CuckooFilter.fromJSON(resolved)

  for (let i = 0; i < stocks.length; i++) {
    let chainId = stocks[i].chainId
    if (resolvedFilter.has(chainId)) {
      console.log(chainId + " ISSUED")
    } else {
      console.log(chainId + " IS INVALID")
    }
  }
}

buildValidator().then((built) => {
  validatorScript = fs.readFileSync(built, 'utf8')
  run()
}, (error) =>  {
  throw error
})
