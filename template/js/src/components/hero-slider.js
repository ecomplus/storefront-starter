'use strict'

/* global Vue */

// handle carousel with vue-swipe
// https://github.com/ElemeFE/vue-swipe
import { Swipe, SwipeItem } from 'vue-swipe'
require('vue-swipe/dist/vue-swipe.css')

// get slides template from original DOM
const $heroSlider = document.getElementById('hero-slider')
let slides = ''
for (let i = 0; i < $heroSlider.children.length; i++) {
  const { innerHTML, className } = $heroSlider.children[i]
  slides += `
  <SwipeItem class="${className}">
    ${innerHTML}
  </SwipeItem>`
}

new Vue({
  components: {
    Swipe,
    SwipeItem
  },

  template: `
  <Swipe class="${$heroSlider.className}">
    ${slides}
  </Swipe>`
}).$mount($heroSlider)
