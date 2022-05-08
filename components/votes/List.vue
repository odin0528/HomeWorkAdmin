<template>
  <div fluid class="product_style_table_list">
    <b-card
      v-for="(product, index) in productList"
      :key="index"
      class="product_style_table_item py-0"
    >
      <div class="px-3 text-left mb-2">
        <b-link :to="`/products/edit/${product.id}`" class="h5">
          產品名稱：{{ product.title }}
        </b-link>
      </div>
      <div class="px-3">
        <div>
          <b-row class="mb-1 text-center bg-gradient-primary py-2">
            <b-col cols="4"> 樣式 </b-col>
            <b-col cols="1">庫存</b-col>
            <b-col cols="2">總銷量</b-col>
            <b-col cols="1">可否超賣</b-col>
            <b-col cols="2">售價</b-col>
            <b-col cols="2">成本</b-col>
          </b-row>
          <template v-for="style in product.style_table">
            <b-row
              v-for="item in style"
              :key="item.id"
              class="mb-1 text-center align-items-center"
            >
              <b-col cols="4" class="d-flex align-items-center">
                <div
                  class="order-item-photo"
                  :style="{ backgroundImage: `url(${item.photo})` }"
                ></div>
                <div class="ml-4">
                  {{ item.style_title }}
                  <span v-if="item.sub_style_title">
                    - {{ item.sub_style_title }}</span
                  >
                </div>
              </b-col>
              <b-col
                cols="1"
                class="font-weight-bolder"
                :class="{
                  'text-danger': item.qty < 0,
                  'text-warning': item.qty >= 0
                }"
                >{{ item.qty }}</b-col
              >
              <b-col cols="2">{{ item.sold }}</b-col>
              <b-col cols="1">{{ item.no_over_sale ? '不可' : '可' }}</b-col>
              <b-col cols="2">NT$ {{ item.price }}</b-col>
              <b-col cols="2">NT$ {{ item.cost }}</b-col>
            </b-row>
          </template>
        </div>
      </div>
    </b-card>
  </div>
</template>
<script>
export default {
  props: {
    productList: {
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.product_style_table_list {
  .product_style_table_item {
  }
}
</style>
