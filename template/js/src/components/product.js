'use strict'

/* global Stage, Thumbs */
// Storefront renderer init promise
/* global EcomInit, Ecom */
// Wait utils.js load
/* global SetupUtils */

// responsive gallery for product pictures with PhotoSwipe
import PhotoSwipe from 'photoswipe'
import PhotoSwipeUI from 'photoswipe/dist/photoswipe-ui-default'

SetupUtils.then(() => {
  EcomInit.then(() => {
    // handle product images stage and thumbnails
    Stage.on('move', () => {
      Thumbs.go('=' + Stage.index)
    })
    window.moveStage = index => {
      Stage.go('=' + index)
    }

    const { currentObject } = Ecom
    // PhotoSwipe images list
    const psImages = []
    if (currentObject) {
      const { pictures, name } = currentObject
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
          const gallery = new PhotoSwipe($pswp, PhotoSwipeUI, psImages, { index })
          gallery.init()
        }
      }
    }
  })
})
