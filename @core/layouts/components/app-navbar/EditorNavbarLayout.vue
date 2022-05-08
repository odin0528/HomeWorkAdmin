<template>
  <div class="navbar-container d-flex content align-items-center">
    <div
      class="bookmark-wrapper align-items-center flex-grow-1 d-none d-lg-flex"
    >
      <b-link class="nav-link mr-2 text-white" to="/pages">
        <b-icon icon="house-door-fill" size="21" />
        回上一頁
      </b-link>
      <span v-if="!isSaving" class="text-white">
        <b-button
          variant="light"
          class="bg-primary text-light px-4 mr-3"
          @click="$emit('showRelease')"
          >{{ $t('release') }}</b-button
        >
        <b-icon icon="cloud-upload" size="21" />
        {{ $t('saved') }}
      </span>
      <span v-else class="text-warning">
        <b-spinner small variant="warning"></b-spinner>
        {{ $t('saving') }}...
      </span>
    </div>

    <b-navbar-nav class="nav align-items-center ml-auto">
      <user-dropdown />
    </b-navbar-nav>
  </div>
</template>

<script>
import UserDropdown from './components/UserDropdown.vue'

export default {
  components: {
    UserDropdown
  },
  props: {
    isSaving: {
      default: () => {
        return false
      },
      type: Boolean
    }
  }
}
</script>
