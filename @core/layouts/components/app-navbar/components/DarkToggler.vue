<template>
  <b-nav-item @click="isDark ? 'light' : 'dark'">
    <b-icon size="21" :icon="`${isDark ? 'sun' : 'moon'}`" />
  </b-nav-item>
</template>

<script>
export default {
  data() {
    return { isDark: true }
  }
}
</script>
