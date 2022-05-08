<template>
  <li
    class="nav-item"
    :class="{
      active: isActive,
      disabled: item.disabled
    }"
  >
    <b-link v-bind="linkProps" class="d-flex align-items-center">
      <b-icon :icon="item.icon || 'circle'" />
      <span class="menu-title text-truncate">{{ $t(item.title) }}</span>
      <b-badge
        v-if="item.tag"
        pill
        :variant="item.tagVariant || 'primary'"
        class="mr-1 ml-auto"
      >
        {{ $store.state.untreatedOrder }}
      </b-badge>
    </b-link>
  </li>
</template>

<script>
import { isNavLinkActive } from '~/@core/layouts/utils'

export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data(props) {
    return {
      isActive: false
    }
  },
  computed: {
    linkProps() {
      const props = {}

      // If route is string => it assumes => Create route object from route name
      // If route is not string => It assumes it's route object => returns route object
      if (this.item.route) props.to = this.item.route
      else {
        props.href = this.item.href
        props.target = '_blank'
        props.rel = 'nofollow'
      }

      if (!props.target) props.target = this.item.target || null

      return props
    }
  },
  methods: {
    updateIsActive() {
      this.isActive = isNavLinkActive(this.item)
    }
  }
}
</script>
