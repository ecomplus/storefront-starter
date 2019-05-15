'use strict'

// Storefront renderer init promise
/* global EcomInit */

import { IS_MOBILE } from './lib/constants'

// lazy load elements with Lozad
// https://github.com/ApoorvSaxena/lozad.js
import lozad from 'lozad'
// using Glide to handle carousel slider with touch support
// https://glidejs.com/docs/
import Glide from '@glidejs/glide'

const handleLazyLoad = () => {
  // handle images (and not only) lazy load
  return lozad('.lozad', {
    loaded ($el) {
      $el.classList.remove('lozad')
      setTimeout(() => $el.classList.add('show'), 400)
    }
  })
}
handleLazyLoad()

EcomInit.then(() => {
  // setup whatsapp links
  let $wpLinks = document.getElementsByClassName('whatsapp-link')
  for (let i = 0; i < $wpLinks.length; i++) {
    let $link = $wpLinks[i]
    let tel = $link.dataset.tel
    if (tel) {
      let href = 'https://' + (IS_MOBILE ? 'api' : 'web') +
        '.whatsapp.com/send?phone=' + encodeURIComponent(tel)
      if ($link.dataset.hasOwnProperty('text')) {
        href += '&text=' + encodeURIComponent($link.dataset.text)
      }
      $link.setAttribute('href', href)
    }
  }

  // setup carousel sliders
  let $glides = document.getElementsByClassName('glide')
  for (let i = 0; i < $glides.length; i++) {
    let $glide = $glides[i]
    // setup glide options from element data
    // https://glidejs.com/docs/options/
    let type = $glide.dataset.type
    let options = { type }
    ;[ 'autoplay', 'perView' ].forEach(opt => {
      if ($glide.dataset.hasOwnProperty(opt)) {
        let val = parseInt($glide.dataset[opt], 10)
        if (!isNaN(val)) {
          options[opt] = val
        }
      }
    })

    // per view breakpoints following Bootstrap grid
    let grid = { Xs: 576, Sm: 768, Md: 992, Lg: 1200 }
    options.breakpoints = {}
    for (let label in grid) {
      let maxSize = grid[label]
      if (maxSize) {
        let perView = $glide.dataset['perView' + label]
        if (perView) {
          options.breakpoints[maxSize] = {
            perView: parseInt(perView, 10)
          }
        }
      }
    }

    // new slider instance
    const glide = new Glide($glide, options)
    let size
    if (type === 'carousel') {
      size = $glide.getElementsByClassName('glide__slide').length
    }
    glide.mount()

    glide.on([ 'run.before' ], move => {
      let { direction } = move
      // calculate movement steps on carousel sliders
      switch (direction) {
        case '>':
        case '<':
          if (type === 'carousel') {
            const { perView } = glide.settings
            if (perView) {
              // handle carousel pagination
              let page = Math.ceil(glide.index / perView)
              let newIndex = page * perView + (direction === '>' ? perView : -perView)
              if (newIndex >= size) {
                // rollback to first page
                newIndex = 0
              } else if (newIndex < 0 || newIndex + perView > size) {
                // last page
                newIndex = size - perView
              }
              move.direction = '='
              move.steps = newIndex
            }
          }
          break
      }
    })
  }

  // lazy load product pictures
  const lozadObserver = handleLazyLoad()
  lozadObserver.observe()
})
