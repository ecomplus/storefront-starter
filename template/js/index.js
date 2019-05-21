import './sw.js'

// setup dependencies
import '@ecomplus/storefront-renderer/dist/storefront.min.js'
import '@ecomplus/shopping-cart'

// main components
import './src/header'

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
