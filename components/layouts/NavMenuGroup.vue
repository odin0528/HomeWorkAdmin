<template>
  <li
    class="nav-item has-sub"
    :class="{
      open: isOpen,
      disabled: item.disabled,
      'sidebar-group-active': isActive
    }"
  >
    <b-link
      class="d-flex align-items-center"
      @click="() => updateGroupOpen(!isOpen)"
    >
      <b-icon :icon="item.icon || 'circle'" />
      <span class="menu-title text-truncate">{{ $t(item.title) }}</span>
      <b-badge
        v-if="item.tag"
        pill
        :variant="item.tagVariant || 'primary'"
        class="mr-1 ml-auto"
      >
        {{ item.tag }}
      </b-badge>
    </b-link>
    <b-collapse v-model="isOpen" class="menu-content" tag="ul">
      <component
        :is="resolveNavItemComponent(child)"
        v-for="child in item.children"
        :key="child.header || child.title"
        ref="groupChild"
        :item="child"
      />
    </b-collapse>
  </li>
</template>

<script>
import {
  resolveVerticalNavMenuItemComponent as resolveNavItemComponent,
  isNavGroupActive
} from '~/@core/layouts/utils'

// Composition Function
// import useVerticalNavMenuGroup from './useVerticalNavMenuGroup'

export default {
  name: 'VerticalNavMenuGroup',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      resolveNavItemComponent,
      isOpen: false,
      isActive: false
    }
  },
  methods: {
    updateGroupOpen(val) {
      this.isOpen = val
    },
    updateIsActive() {
      this.isActive = isNavGroupActive(this.item.children)
    }
  }
}
</script>

<style></style>
