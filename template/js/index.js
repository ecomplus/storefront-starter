import './sw.js'

// setup dependencies
import '@ecomplus/storefront-renderer/dist/storefront.min.js'
import '@ecomplus/shopping-cart'

// main components
import './src/components/header'

// async load
import('./src/icons')
window.SetupUtils = import('./src/utils')

// import scripts by page
const $main = document.getElementById('__main')
if ($main && $main.dataset.import) {
  import('./src/components/' + $main.dataset.import)
}
