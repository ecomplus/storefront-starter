'use strict'

// Storefront Renderer and init promise
import { Ecom, EcomInit } from '@ecomplus/storefront-renderer'

// shopping cart lib
// https://developers.e-com.plus/shopping-cart/EcomCart.html
import EcomCart from '@ecomplus/shopping-cart'

// responsive gallery for product pictures with PhotoSwipe
import PhotoSwipe from 'photoswipe'
import psUi from 'photoswipe/dist/photoswipe-ui-default'

// setup general utils and get Glidejs slider instances
import { glides } from './utils'

// get header component Vue instance
import header from './header'

EcomInit.then(() => {
  // handle product images stage and thumbnails
  const { stage, thumbs } = glides
  if (stage && thumbs) {
    stage.on('move', () => {
      thumbs.go('=' + stage.index)
    })
    window.moveStage = index => {
      stage.go('=' + index)
    }
  }

  const product = Ecom.currentObject
  // save selected variation object
  let selectedVariation = null
  const $selectVariation = document.getElementById('select-variation')
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
    }

    window.addToCart = index => {
      if (product) {
        const item = selectedVariation || product
        item.product_id = product._id
        if (selectedVariation) {
          // handle selected variation object
          item.variation_id = selectedVariation._id
          item.slug = product.slug
          if (item.picture_id && product.pictures) {
            // variation specific picture
            let pictures = product.pictures.filter(picture => {
              return picture._id === item.picture_id
            })
            if (pictures.length) {
              item.picture = pictures[0]
            }
          }
        } else if (product.variations && product.variations.length) {
          $selectVariation.style.display = 'block'
          return
        }

        if (!item.picture && product.pictures) {
          // use first product picture as default
          item.picture = product.pictures[0]
        }
        // fallback to product min quantity (when variation has not min quantity) or 1
        item.quantity = item.min_quantity || product.min_quantity || 1
        // defaults to product price when variation has no defined price
        item.price = item.price || product.price

        // add to global cart object and opens minicart component
        EcomCart.addItem(item)
        header.vm.showMinicart = true
      }
    }

    if (product.variations && product.variations.length) {
      // handle product variations
      let filterVariations = {}
      const { variationsGrids, specTextValue } = Ecom.methods
      // grid options DOM elements
      const className = 'grid-options__option'
      const disabledClass = className + '--disabled'
      const activeClass = className + '--active'
      const $options = document.getElementsByClassName(className)

      const updateOptions = (skipGrid, skipOption) => {
        // disable options out of stock
        let grids = variationsGrids(product, filterVariations, true)
        for (let i = 0; i < $options.length; i++) {
          let $option = $options[i]
          let { grid, option } = $option.dataset

          if (grid && option) {
            // handle active and disabled CSS modifiers
            let { classList } = $option
            if (grid !== skipGrid) {
              if (!grids.hasOwnProperty(grid) || grids[grid].indexOf(option) === -1) {
                // unavailable
                classList.add(disabledClass)
                classList.remove(activeClass)
              } else {
                classList.remove(disabledClass)
              }
            } else if (option !== skipOption) {
              // remove active class if any
              classList.remove(activeClass)
            }
          }
        }

        // try to set selected variation
        selectedVariation = null
        let variations = product.variations
        for (let grid in grids) {
          if (grids.hasOwnProperty(grid) && grids[grid].length > 1) {
            return
          } else {
            variations = variations.filter(variation => {
              // match specification
              return specTextValue(variation, grid) === grids[grid][0]
            })
          }
        }
        if (variations.length) {
          // update selected variation
          selectedVariation = variations[0]
        }
      }

      window.selectOption = function ($option) {
        $selectVariation.style.display = 'none'
        if (!$option.classList.contains(disabledClass)) {
          let { grid, option } = $option.dataset
          if (grid && option) {
            let { classList } = $option
            if (!classList.contains(activeClass)) {
              // mark as active
              classList.add(activeClass)
              // filter options again with selected grid value
              filterVariations[grid] = option
              updateOptions(grid, option)
            } else {
              // unset marked option
              classList.remove(activeClass)
              delete filterVariations[grid]
              updateOptions()
            }
          }
        }
      }

      // start disabling out of stock options
      updateOptions()
    }
  }
})
