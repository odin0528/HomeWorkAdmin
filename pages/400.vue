<template>
  <!-- Error page-->
  <div class="misc-wrapper">
    <b-link class="brand-logo">
      <b-img :src="appLogoImage" alt="logo" />
      <h2 class="brand-text text-primary ml-1">
        {{ appName }}
      </h2>
    </b-link>

    <div class="misc-inner p-2 p-sm-3">
      <div class="w-100 text-center d-flex flex-column">
        <h2 class="mb-1">服務異常 🕵🏻‍♀️</h2>
        <p class="mb-2">伺服器發生異常狀態，請稍候再試</p>

        <b-button
          variant="primary"
          class="mb-2 btn-sm-block w-50 mx-auto"
          :to="{ path: '/' }"
        >
          回到首頁
        </b-button>

        <!-- image -->
        <b-img fluid :src="imgUrl" alt="Error page" />
      </div>
    </div>
  </div>
  <!-- / Error page-->
</template>

<script>
import { $themeConfig } from '~/themeConfig'
export default {
  layout: 'empty',
  data() {
    const { appName, appLogoImage } = $themeConfig.app
    return {
      appName,
      appLogoImage
    }
  },
  computed: {
    imgUrl() {
      return require('~/assets/images/pages/error.svg')
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/scss/vue/pages/page-misc.scss';
</style>
