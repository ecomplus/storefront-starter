import './sw.js'

// setup dependencies
import '@ecomplus/storefront-renderer/dist/storefront.min.js'
import '@ecomplus/shopping-cart'

// main components
import './src/partials/header'

// async load
import('./src/icons')
window.SetupUtils = import('./src/utils')

// import scripts by page
const $main = document.getElementById('__main')
if ($main) {
  const { page } = $main.dataset
  import('./src/pages/' + page)
}
