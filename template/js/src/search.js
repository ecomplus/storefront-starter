'use strict'

// Storefront Renderer init promise
import { EcomInit } from '@ecomplus/storefront-renderer'

// setup retail component
import './retail'

EcomInit.then(() => {
  // handle search term
  const search = window.Retail
  const updateTerm = () => {
    // update search Vue instance
    search.args.term = decodeURIComponent(window.location.hash.substr(1))
  }
  updateTerm()
  window.addEventListener('hashchange', updateTerm)
})
