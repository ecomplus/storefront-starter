'use strict'

import { STORE_ID, DEFAULT_LANG } from './lib/constants'

// Storefront init promise
// E-Com Plus public APIs SDK
import { Vue, EcomInit, EcomIo } from '@ecomplus/storefront-renderer'

// nested components
import EcomNavbar from '@ecomplus/widget-navbar'
import EcomUser from '@ecomplus/widget-user'
import EcomSearch from '@ecomplus/widget-search'
import EcomMinicart from '@ecomplus/widget-minicart'

const header = {}
export default header

// navbar DOM element
const $navbar = document.getElementById('navbar')

const mountHeader = () => {
  // manually render with slots
  const slots = {}
  ;[ 'header-col-1', 'nav' ].forEach(slot => {
    for (let i = 0; i < $navbar.children.length; i++) {
      let $el = $navbar.children[i]
      if ($el && $el.dataset.slot === slot) {
        slots[slot] = $el.outerHTML
        break
      }
    }
  })

  header.vm = new Vue({
    components: {
      EcomNavbar,
      EcomMinicart,
      EcomUser,
      EcomSearch
    },

    data: {
      lang: DEFAULT_LANG,
      searchButtonOnly: false,
      showMinicart: false
    },

    computed: {
      getStore () {
        return (EcomIo.storeId && EcomIo.storeId()) || STORE_ID
      }
    },

    methods: {
      hideSearchInput (fixedNav) {
        this.searchButtonOnly = fixedNav && window.screen.width < 767.98
        return this.searchButtonOnly
      },

      submitSearch (term) {
        window.location = '/search#' + encodeURIComponent(term)
      }
    },

    template: `
    <EcomNavbar
      :secondColClasses="[
        searchButtonOnly ? 'order-last pl-0' : 'order-lg-last',
        'col-auto'
      ]"
      :thirdColClasses="[
        searchButtonOnly ? 'col-auto pr-1' : 'col-12 mt-2',
        'col-lg mt-md-3 mt-lg-0'
      ]"
      :mobileStickyHeader="true">
      <template #header-col-1>
        ${slots['header-col-1']}
      </template>
      <template #header-col-2>
        <div class="d-flex justify-content-end">
          <EcomUser class="mr-1" :storeId="getStore" :lang="lang" />
          <EcomMinicart :lang="lang" :show.sync="showMinicart" />
        </div>
      </template>
      <template v-slot:header-col-3="{ fixed }">
        <EcomSearch
          :lang="lang"
          :buttonOnly="hideSearchInput(fixed)"
          @submit="submitSearch" />
      </template>
      <template #nav>
        ${slots['nav']}
      </template>
    </EcomNavbar>`
  }).$mount($navbar)
}

if ($navbar.getElementsByClassName('_ecom-el').length) {
  // must wait storefront renderer
  EcomInit.then(mountHeader)
} else {
  mountHeader()
}
