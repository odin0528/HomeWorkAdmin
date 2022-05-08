<template>
  <b-card class="text-right sticky-bottom">
    <b-button
      v-b-modal.cancel_confirm
      variant="outline-secondary"
      class="mr-3 px-4"
    >
      {{ $t('cancel') }}
    </b-button>
    <b-button variant="outline-secondary" class="mr-3 px-4" @click="saveDraft">
      {{ $route.params.id ? $t('update_draft') : $t('save_draft') }}
    </b-button>
    <b-button variant="primary" class="px-4" @click="save">
      {{ $route.params.id ? $t('update_and_public') : $t('save_and_public') }}
    </b-button>
  </b-card>
</template>

<script>
export default {
  methods: {
    save() {
      this.$emit('save')
    },
    saveDraft() {
      this.$emit('saveDraft')
    },
  },
}
</script>

<style lang="scss">
.sticky-bottom {
  position: sticky;
  bottom: 0;
  z-index: 13;
}
</style>
