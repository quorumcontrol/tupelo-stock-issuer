const { CuckooFilter } = require('bloom-filters')

let requests = {}

function Deferred() {
  var self = this
  this.promise = new Promise(function(resolve, reject) {
    self.reject = reject
    self.resolve = resolve
  })
}

function generateRequestId() {
  var array = new Uint32Array(5)
  window.crypto.getRandomValues(array)
  let id = ""
  array.forEach((v) => { id += v.toString(36) })
  return id
}

function requestMessage(msg) {
  msg.requestId = generateRequestId()
  requests[msg.requestId] = new Deferred()
  window.parent.postMessage(msg)
  return requests[msg.requestId].promise
}

function validate(data) {
  requestMessage({type: "get-chain", payload: { chainId: data.chain.tree.issuer }}).then((resp) => {
    const id = data.chain.id
    const issuerChaintree = resp.payload.tree
    const issuedFilter = CuckooFilter.fromJSON(issuerChaintree.issued)
    const revokedFilter = CuckooFilter.fromJSON(issuerChaintree.revoked)
    if (issuedFilter.has(id) && !revokedFilter.has(id)) {
      window.parent.postMessage({type: "finished", payload: { result: "ok" }})
    } else {
      window.parent.postMessage({type: "finished", payload: { result: "invalid" }})
    }
  })
}

function handleMessage(event) {
  data = event.data
  switch(data.type) {
    case "validate":
      validate(data.payload)
      break
    case "response":
      if (requests.hasOwnProperty(data.requestId)) {
        requests[data.requestId].resolve(data)
      } else {
        throw "unknown request id " + data.requestId
      }
      break
    default:
      throw "unknown message type " + event.data.type
  }
}

window.addEventListener("message", handleMessage)