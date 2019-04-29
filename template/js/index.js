
'use strict'

// setup dependencies
import '@ecomplus/storefront-renderer/dist/storefront.min.js'
import '@ecomplus/shopping-cart'

// async dependencies
// storefront widgets
import(/* webpackChunkName: "@ecomplus/widget-minicart" */ '@ecomplus/widget-minicart')
import(/* webpackChunkName: "@ecomplus/widget-search" */ '@ecomplus/widget-search')
import(/* webpackChunkName: "@ecomplus/widget-user" */ '@ecomplus/widget-user')
