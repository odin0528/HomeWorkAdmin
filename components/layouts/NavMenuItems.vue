<template>
  <ul>
    <component
      :is="resolveNavItemComponent(item)"
      v-for="item in items"
      :key="item.header || item.title"
      :item="item"
    />
  </ul>
</template>

<script>
import { resolveVerticalNavMenuItemComponent as resolveNavItemComponent } from '~/@core/layouts/utils'

export default {
  components: {},
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      resolveNavItemComponent
    }
  }
}
</script>
