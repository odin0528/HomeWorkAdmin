<template>
  <div class="vertical-layout h-100 vertical-menu-modern menu-expanded">
    <b-navbar
      :toggleable="false"
      class="
        header-navbar
        navbar navbar-shadow
        align-items-center
        fixed-top
        bg-primary
      "
    >
      <app-navbar-vertical-layout @click="toggleVerticalMenuActive()" />
    </b-navbar>

    <layouts-nav-menu
      :is-vertical-menu-active="isVerticalMenuActive"
      :toggle-vertical-menu-active="toggleVerticalMenuActive"
      :nav-menu-items="navMenuItems"
    >
      <template #header="slotProps">
        <slot name="vertical-menu-header" v-bind="slotProps" />
      </template>
    </layouts-nav-menu>

    <div class="app-content content">
      <transition name="slide-fade" mode="out-in">
        <Nuxt />
      </transition>
    </div>

    <footer class="footer footer-light footer-static">
      <slot name="footer">
        <app-footer />
      </slot>
    </footer>

    <div v-if="$store.state.isLoading">
      <div class="mask"></div>
      <div class="loading">
        <div>
          <b-icon icon="stopwatch" font-scale="3" animation="cylon"></b-icon>
          <p>Please wait...</p>
        </div>
      </div>
    </div>
    <!-- /Footer -->
  </div>
</template>

<script>
import AppNavbarVerticalLayout from '~/@core/layouts/components/app-navbar/AppNavbarVerticalLayout.vue'
import AppFooter from '~/@core/layouts/components/AppFooter.vue'
import NavMenuData from '~/assets/configs/navMenuData.json'
export default {
  name: 'DefaultLayout',
  components: {
    AppNavbarVerticalLayout,
    AppFooter,
  },
  data() {
    return {
      isNavMenuHidden: false,
      isVerticalMenuActive: true,
      navMenuItems: NavMenuData,
    }
  },
  methods: {
    toggleVerticalMenuActive() {
      this.isNavMenuHidden = !this.isNavMenuHidden
    },
  },
}
</script>
<style lang="scss">
@import '~/assets/scss/variables/variables.scss';
@import '~/assets/scss/style.scss';
.loading {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  text-align: center;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
}

.mask {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: #000;
  opacity: 0.5;
  z-index: 9998;
}
</style>
