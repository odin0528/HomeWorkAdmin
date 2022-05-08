<template>
  <div
    class="main-menu menu-fixed menu-accordion menu-shadow"
    :class="[
      {
        expanded:
          !isVerticalMenuCollapsed ||
          (isVerticalMenuCollapsed && isMouseHovered),
      },
      skin === 'semi-dark' ? 'menu-dark' : 'menu-light',
    ]"
    @mouseenter="updateMouseHovered(true)"
    @mouseleave="updateMouseHovered(false)"
  >
    <!-- main menu header-->
    <div class="navbar-header expanded">
      <slot
        name="header"
        :toggleVerticalMenuActive="toggleVerticalMenuActive"
        :toggleCollapsed="toggleCollapsed"
        :collapseTogglerIcon="collapseTogglerIcon"
      >
        <ul class="nav navbar-nav flex-row">
          <!-- Logo & Text -->
          <li class="nav-item mr-auto">
            <b-link class="navbar-brand" to="/">
              <span class="brand-logo">
                <b-img :src="appLogoImage" alt="logo" />
              </span>
              <h2 class="brand-text">
                {{ appName }}
              </h2>
            </b-link>
          </li>
        </ul>
      </slot>
    </div>
    <!-- / main menu header-->

    <!-- Shadow -->
    <div :class="{ 'd-block': shallShadowBottom }" class="shadow-bottom" />

    <!-- main menu content-->
    <vue-perfect-scrollbar
      :settings="perfectScrollbarSettings"
      class="main-menu-content scroll-area"
      tagname="ul"
      @ps-scroll-y="
        (evt) => {
          shallShadowBottom = evt.srcElement.scrollTop > 0
        }
      "
    >
      <layouts-nav-menu-items
        :items="navMenuItems"
        class="navigation navigation-main"
      />
    </vue-perfect-scrollbar>
    <!-- /main menu content-->
  </div>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import { $themeConfig } from '~/themeConfig'

export default {
  components: {
    VuePerfectScrollbar,
  },
  props: {
    navMenuItems: {
      type: Array,
      required: true,
    },
    isVerticalMenuActive: {
      type: Boolean,
      required: true,
    },
    toggleVerticalMenuActive: {
      type: Function,
      required: true,
    },
  },
  data() {
    const perfectScrollbarSettings = {
      maxScrollbarLength: 60,
      wheelPropagation: false,
    }

    // App Name
    const { appName, appLogoImage } = $themeConfig.app
    const { skin } = $themeConfig.layout

    return {
      perfectScrollbarSettings,
      isVerticalMenuCollapsed: false,
      isMouseHovered: false,
      shallShadowBottom: false,
      skin,
      appName,
      appLogoImage,
    }
  },
  computed: {
    collapseTogglerIconFeather() {
      return this.collapseTogglerIcon.value === 'unpinned'
        ? 'CircleIcon'
        : 'DiscIcon'
    },
    collapseTogglerIcon() {
      if (this.isVerticalMenuActive) {
        return this.isVerticalMenuCollapsed ? 'unpinned' : 'pinned'
      }
      return 'close'
    },
  },
  methods: {
    toggleCollapsed() {
      this.isVerticalMenuCollapsed = !this.isVerticalMenuCollapsed
    },
    updateMouseHovered(val) {
      this.isMouseHovered = val
    },
  },
}
</script>

<style lang="scss">
@import '~/assets/scss/base/core/menu/menu-types/vertical-menu.scss';
</style>
