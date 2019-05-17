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

const handleLazyLoad = className => {
  // handle images (and not only) lazy load
  const observer = lozad('.' + className, {
    loaded ($el) {
      $el.classList.remove(className)
      setTimeout(() => $el.classList.add('show'), 400)
    }
  })
  observer.observe()
  return observer
}
const observer = handleLazyLoad('lozad')

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
  let glidesCount = $glides.length
  if (glidesCount) {
    const lozadSlides = ($glide, glide) => () => {
      // mannualy trigger images load inside active slide
      let $slide = $glide.getElementsByClassName('glide__slide')[glide.index]
      if ($slide) {
        let $imgs = $slide.getElementsByTagName('IMG')
        for (let i = 0; i < $imgs.length; i++) {
          let $img = $imgs[i]
          if ($img.dataset.src && !$img.dataset.loaded) {
            observer.triggerLoad($img)
          }
        }
      }
    }

    const carouselPagination = (glide, size) => move => {
      let { direction } = move
      // calculate movement steps on carousel sliders
      switch (direction) {
        case '>':
        case '<':
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
          break
      }
    }

    for (let i = 0; i < glidesCount; i++) {
      let $glide = $glides[i]
      // setup glide options from element data
      // https://glidejs.com/docs/options/
      let type = $glide.dataset.type || 'slider'
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

      if (type === 'carousel') {
        glide.on('run.before', carouselPagination(glide, size))
      } else {
        // images slider
        glide.on('run', lozadSlides($glide, glide))
      }
    }
  }

  // lazy load product pictures
  handleLazyLoad('lozad-ecom')
})
