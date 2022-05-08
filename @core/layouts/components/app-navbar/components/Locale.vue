<template>
  <b-nav-item-dropdown
    id="dropdown-grouped"
    variant="link"
    class="dropdown-language"
    right
  >
    <template #button-content>
      <b-img
        :src="currentLocale.img"
        height="14px"
        width="22px"
        :alt="currentLocale.locale"
      />
      <span class="ml-50 text-body">{{ currentLocale.name }}</span>
    </template>
    <b-dropdown-item
      v-for="localeObj in locales"
      :key="localeObj.locale"
      @click="$i18n.locale = localeObj.locale"
    >
      <b-img
        :src="localeObj.img"
        height="14px"
        width="22px"
        :alt="localeObj.locale"
      />
      <span class="ml-50">{{ localeObj.name }}</span>
    </b-dropdown-item>
  </b-nav-item-dropdown>
</template>

<script>
export default {
  data() {
    return {
      locales: [
        {
          locale: 'en',
          img: require('@/assets/images/flags/en.png'),
          name: 'English',
        },
        {
          locale: 'fr',
          img: require('@/assets/images/flags/fr.png'),
          name: 'French',
        },
        {
          locale: 'de',
          img: require('@/assets/images/flags/de.png'),
          name: 'German',
        },
        {
          locale: 'pt',
          img: require('@/assets/images/flags/pt.png'),
          name: 'Portuguese',
        },
      ],
    }
  },
  // ! Need to move this computed property to comp function once we get to Vue 3
  computed: {
    currentLocale() {
      return this.$i18n.localeProperties.code
    },
  },
}
</script>

<style></style>
