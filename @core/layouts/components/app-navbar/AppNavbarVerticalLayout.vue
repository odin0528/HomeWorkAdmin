<template>
  <div class="navbar-container d-flex content align-items-center">
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
  }
}
</script>
