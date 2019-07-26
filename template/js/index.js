import './sw.js'

// setup dependencies
import { Ecom, EcomInit } from '@ecomplus/storefront-renderer'
import '@ecomplus/shopping-cart'

// main components
import './src/header'

// wait for init promise
EcomInit.then(() => {
  // setup global context body
  if (Ecom.currentObject) {
    window.$context.body = Ecom.currentObject
  }
})

// async load
import('./src/icons')
// import scripts by page
const $main = document.getElementById('__main')
if ($main && $main.dataset.import) {
  import('./src/' + $main.dataset.import)
} else {
  // import general utils only
  import('./src/utils')
}
