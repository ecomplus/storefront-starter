import './sw.js'

// setup dependencies
import '@ecomplus/storefront-renderer/dist/storefront.min.js'
import '@ecomplus/shopping-cart'

// main components
import './src/partials/header'

// async load
import('./src/utils')
import('./src/icons')

// import scripts by page
let $main = document.getElementById('__main')
if ($main) {
  let { page } = $main.dataset
  import('./src/pages/' + page)
}
