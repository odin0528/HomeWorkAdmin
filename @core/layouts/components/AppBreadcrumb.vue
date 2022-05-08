<template>
  <b-row class="content-header">
    <!-- Content Left -->
    <b-col class="content-header-left mb-2" cols="12" md="9">
      <b-row class="breadcrumbs-top">
        <b-col cols="12">
          <h2 v-if="isShowHome" class="content-header-title float-left mb-0">
            {{ breadcrumbs[breadcrumbs.length - 1].text }}
          </h2>
          <div class="breadcrumb-wrapper">
            <b-breadcrumb>
              <b-breadcrumb-item v-if="isShowHome" to="/">
                <b-icon icon="house" font-scale="1.5" class="align-text-top" />
              </b-breadcrumb-item>
              <b-breadcrumb-item
                v-for="item in breadcrumbs"
                :key="item.text"
                :active="item.active"
                :to="item.to"
              >
                {{ item.text }}
              </b-breadcrumb-item>
            </b-breadcrumb>
          </div>
        </b-col>
      </b-row>
    </b-col>
    <b-col class="text-right" cols="12" md="3">
      <slot />
    </b-col>
  </b-row>
</template>

<script>
import { BBreadcrumb, BBreadcrumbItem, BRow, BCol } from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'

export default {
  directives: {
    Ripple,
  },
  components: {
    BBreadcrumb,
    BBreadcrumbItem,
    BRow,
    BCol,
  },
  props: {
    isShowHome: {
      default() {
        return true
      },
      type: Boolean,
    },
    breadcrumbs: {
      default() {
        return []
      },
      type: Array,
    },
  },
}
</script>

<style lang="scss">
.breadcrumb {
  background-color: transparent;
  padding: 0.5rem 1rem;
}
</style>
