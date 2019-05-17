'use strict'

/* global Gallery, Thumbs */
// Storefront renderer init promise
/* global EcomInit */
// Wait utils.js load
/* global SetupUtils */

SetupUtils.then(() => {
  EcomInit.then(() => {
    // handle product images gallery
    Gallery.on('move', () => {
      Thumbs.go('=' + Gallery.index)
    })
    window.moveGallery = index => {
      Gallery.go('=' + index)
    }
  })
})
