'use strict'

// Storefront Renderer init promise
import { EcomInit } from '@ecomplus/storefront-renderer'

// setup retail component
import './retail'

EcomInit.then(() => {
  const search = window.Retail
  const updateTerm = () => {
    search.args.term = decodeURIComponent(window.location.hash.substr(1))
  }
  updateTerm()
  window.addEventListener('hashchange', updateTerm)
})
