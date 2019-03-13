const { CuckooFilter } = require('bloom-filters')

const IPFS_API_HOST = '127.0.0.1'
const IPFS_API_PORT = '5001'

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
  const id = data.chain.id
  const issuer = data.chain.tree.data.issuer

  requestMessage({type: "get-tip", payload: { chainId: issuer }}).then((resp) => {
    dataUrl = "http://" + IPFS_API_HOST + ":" + IPFS_API_PORT + "/api/v0/dag/get?arg=" + resp.payload.tip + "/tree/data"

    fetch(dataUrl + "/issued").then(function (resp) {
      return resp.json();
    }).then(function(issued) {
      const issuedFilter = CuckooFilter.fromJSON(issued)

      if (issuedFilter.has(id)) {
        fetch(dataUrl + "/revoked").then(function (resp) {
          return resp.json();
        }).then(function(revoked) {
          const revokedFilter = CuckooFilter.fromJSON(revoked)

          if (!revokedFilter.has(id)) {
            window.parent.postMessage({type: "finished", payload: { result: "ok" }})
          } else {
            window.parent.postMessage({type: "finished", payload: { result: "invalid" }})
          }
        })
      } else {
        window.parent.postMessage({type: "finished", payload: { result: "invalid" }})
      }
    })
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