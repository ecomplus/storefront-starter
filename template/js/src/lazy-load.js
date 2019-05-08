'use strict'

// lazy load elements with lozad
// https://github.com/ApoorvSaxena/lozad.js
import lozad from 'lozad'

// query by class .lozad
const observer = lozad('.lozad', {
  loaded ($el) {
    // must trigger some components after images loaded
    switch ($el.dataset.afterLoaded) {
      case 'HeroSlider':
      case 'HeroSlider(0)':
        import('./components/hero-slider')
        break
    }
  }
})
observer.observe()
