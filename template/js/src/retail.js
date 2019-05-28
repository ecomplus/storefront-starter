'use strict'

// Storefront Renderer init promise
import { EcomInit } from '@ecomplus/storefront-renderer'

// setup general utils and get lozad trigger function
import { handleLazyLoad } from './utils'

EcomInit.then(() => {
  const search = window.Retail
  if (search) {
    search.$on([ 'reloadSuccess' ], err => {
      if (!err) {
        setTimeout(() => {
          // lazy load product pictures
          handleLazyLoad('lozad-ecom')
        }, 300)
      }
    })
  }
})
