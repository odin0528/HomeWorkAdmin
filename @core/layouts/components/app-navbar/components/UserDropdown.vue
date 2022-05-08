<template>
  <b-nav-item-dropdown
    right
    toggle-class="d-flex align-items-center dropdown-user-link"
    class="dropdown-user"
  >
    <template #button-content>
      <div class="d-sm-flex d-none user-nav">
        <p class="user-name font-weight-bolder mb-0">
          {{ $cookies.get('gz_admin').title }}
        </p>
      </div>
      <b-avatar
        size="40"
        src=""
        variant="light-primary"
        badge
        class="badge-minimal"
        badge-variant="success"
      >
        <b-icon icon="people" font-scale="2" />
      </b-avatar>
    </template>
    <b-dropdown-item link-class="d-flex align-items-center" @click="logout">
      <b-icon size="16" icon="log-out" class="mr-50" />
      <span>Logout</span>
    </b-dropdown-item></b-nav-item-dropdown
  >
</template>

<script>
export default {
  methods: {
    logout() {
      this.$cookies.remove('gz_admin')
      this.$router.push('/login')
    }
  }
}
</script>
