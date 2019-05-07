'use strict'

/* global Vue */
/* global EcomInit */

// components
import EcomNavbar from '@ecomplus/widget-navbar'
import EcomUser from '@ecomplus/widget-user'
import EcomSearch from '@ecomplus/widget-search'
import EcomMinicart from '@ecomplus/widget-minicart'

// E-Com Plus public APIs SDK
/* global EcomIo */

EcomInit.then(() => {
  // manually render with slots
  const slots = {}
  const $navbar = document.getElementById('navbar')
  ;[ 'header-col-1', 'nav' ].forEach(slot => {
    for (let i = 0; i < $navbar.children.length; i++) {
      let $el = $navbar.children[i]
      if ($el && $el.dataset.slot === slot) {
        slots[slot] = $el.outerHTML
        break
      }
    }
  })

  new Vue({
    components: {
      EcomNavbar,
      EcomMinicart,
      EcomUser,
      EcomSearch
    },

    data: {
      lang: 'pt_br',
      storeId: 1011,
      searchButtonOnly: false
    },

    computed: {
      getStore () {
        return this.storeId || (EcomIo.storeId && EcomIo.storeId())
      }
    },

    methods: {
      hideSearchInput (fixedNav) {
        this.searchButtonOnly = fixedNav && window.screen.width < 767.98
        return this.searchButtonOnly
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
          <EcomMinicart :lang="lang" />
        </div>
      </template>
      <template v-slot:header-col-3="{ fixed }">
        <EcomSearch :lang="lang" :buttonOnly="hideSearchInput(fixed)" />
      </template>
      <template #nav>
        ${slots['nav']}
      </template>
    </EcomNavbar>`
  }).$mount($navbar)
})
