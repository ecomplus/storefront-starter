'use strict'

// Storefront renderer init promise
/* global EcomInit, Ecom */
// Wait utils.js load
/* global SetupUtils, Stage, Thumbs */

// shopping cart lib
// https://developers.e-com.plus/shopping-cart/EcomCart.html
import EcomCart from '@ecomplus/shopping-cart'
// responsive gallery for product pictures with PhotoSwipe
import PhotoSwipe from 'photoswipe'
import psUi from 'photoswipe/dist/photoswipe-ui-default'
// get header component Vue instance
import header from './header'

SetupUtils.then(() => {
  EcomInit.then(() => {
    // handle product images stage and thumbnails
    Stage.on('move', () => {
      Thumbs.go('=' + Stage.index)
    })
    window.moveStage = index => {
      Stage.go('=' + index)
    }

    const product = Ecom.currentObject
    // PhotoSwipe images list
    const psImages = []
    if (product) {
      const { pictures, name } = product
      if (pictures && pictures.length) {
        // setup PhotoSwipe items
        // https://photoswipe.com/documentation/getting-started.html
        pictures.forEach(({ zoom }) => {
          if (zoom && zoom.size) {
            let sizes = zoom.size.split('x')
            // PhotoSwipe requires image dimensions to work properly
            if (sizes.length === 2) {
              psImages.push({
                src: zoom.url,
                title: name,
                w: parseInt(sizes[0], 10),
                h: parseInt(sizes[1], 10)
              })
            }
          }
        })
      }
    }

    window.openGallery = index => {
      if (psImages.length) {
        // open full screen images gallery
        const $pswp = document.getElementsByClassName('pswp')[0]
        if ($pswp) {
          // initializes and opens PhotoSwipe
          const gallery = new PhotoSwipe($pswp, psUi, psImages, { index })
          gallery.init()
        }
      }
    }

    window.addToCart = index => {
      if (product) {
        const { name, sku, price } = product
        EcomCart.addItem({
          product_id: product._id,
          quantity: 1,
          price,
          name,
          sku
        })
        header.vm.showMinicart = true
      }
    }
  })
})
