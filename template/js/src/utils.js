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

  // handle images (and not only) lazy load
  const observer = lozad('.lozad', {
    loaded ($el) {
      setTimeout(() => $el.classList.add('show'), 400)
    }
  })
  observer.observe()

  // setup carousel sliders
  let $glides = document.getElementsByClassName('glide')
  for (let i = 0; i < $glides.length; i++) {
    let $glide = $glides[i]
    let autoplay = parseInt($glide.dataset.autoplay, 10)
    new Glide($glide, { autoplay }).mount().on('move', () => {
      // mannualy trigger slide images load
      let $lozad = $glide.getElementsByClassName('lozad')
      for (let i = 0; i < $lozad.length; i++) {
        if (!$lozad[i].dataset.loaded) {
          observer.triggerLoad($lozad[i])
        }
      }
    })
  }
})
