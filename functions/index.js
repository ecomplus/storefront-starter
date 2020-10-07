const functions = require('firebase-functions')

const fns = require('@ecomplus/storefront-renderer/functions/')

for (const fnName in fns) {
  if (typeof fns[fnName] === 'function') {
    exports[fnName] = functions.https.onRequest((req, res) => fns[fnName](req, res))
  }
}
