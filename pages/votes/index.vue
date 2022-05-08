<template>
  <div>
    <b-card no-body class="mb-0">
      <div class="m-2">
        <!-- Table Top -->
        <b-row>
          <!-- Per Page -->
          <b-col
            cols="12"
            md="6"
            class="d-flex align-items-center justify-content-start mb-1 mb-md-0"
          >
            <label class="mt-2">{{ $t('showing') }}</label>
            <v-select
              v-model="perPage"
              :options="perPageOptions"
              :clearable="false"
              class="per-page-selector d-inline-block mx-50"
            />
            <label class="mt-2">{{ $t('entries') }}</label>
          </b-col>

          <!-- Search -->
          <b-col cols="12" md="6">
            <div class="d-flex align-items-center justify-content-end">
              <b-button variant="primary" to="/votes/edit">
                <span class="text-nowrap">{{ $t('create_product') }}</span>
              </b-button>
            </div>
          </b-col>
        </b-row>
      </div>

      <b-container fluid>
        <b-row class="product_list_header">
          <b-col cols="4">{{ $t('vote_title') }}</b-col>
          <b-col cols="6">
            <b-container>
              <b-row>
                <b-col cols="6">{{ $t('product_style') }}</b-col>
                <b-col cols="2">{{ $t('price') }}</b-col>
                <b-col cols="2">庫存</b-col>
                <b-col cols="2">不可超賣</b-col>
              </b-row>
            </b-container>
          </b-col>
          <b-col cols="2">{{ $t('action') }}</b-col>
        </b-row>
        <b-row
          v-for="(product, index) in productList"
          :key="product.id"
          class="product_list_body py-0"
        >
          <b-col cols="4" class="text-left">
            <div
              class="photo"
              :style="{
                backgroundImage: `url(${
                  product.photos && product.photos.length > 0
                    ? product.photos[0].photo
                    : '/images/no-image.jpg'
                })`
              }"
            ></div>
            <b-link :to="`/products/edit/${product.id}`">
              {{ product.title }}
            </b-link>
          </b-col>
          <b-col cols="6">
            <b-container
              class="product_style_list"
              :class="{ show: showMoreSwitch[index] }"
            >
              <template v-for="style in product.style_table">
                <b-row v-for="item in style" :key="item.id">
                  <b-col cols="6"
                    >{{ item.style_title }}

                    <span v-if="item.sub_style_title">
                      - {{ item.sub_style_title }}</span
                    >
                  </b-col>
                  <b-col cols="2">NT$ {{ item.price }}</b-col>
                  <b-col cols="2">{{ item.qty }}</b-col>
                  <b-col cols="2">{{
                    item.no_over_sale ? '不可' : '可'
                  }}</b-col>
                </b-row>
              </template>
            </b-container>
            <b-row
              v-if="
                product.style_table.length * product.style_table[0].length > 3
              "
              class="
                show-more-style
                justify-content-center
                position-relative
                mt-2
              "
            >
              <b-button
                variant="flat-secondary"
                @click="showMoreSwitch.splice(index, 1, !showMoreSwitch[index])"
              >
                {{ !showMoreSwitch[index] ? $t('show_more') : $t('hidden') }}
              </b-button>
            </b-row>
          </b-col>
          <b-col cols="2">
            <b-form-checkbox
              name="check-button"
              :checked="product.is_public"
              class="pt-2 ml-5"
              switch
              @change="togglePubliced(product.id, $event)"
            >
              <b>{{
                product.is_public ? $t('published') : $t('unpublished')
              }}</b>
            </b-form-checkbox>
            <b-dropdown
              v-ripple.400="'rgba(186, 191, 199, 0.15)'"
              :text="$t('more_action')"
              variant="flat-secondary"
            >
              <b-dropdown-item
                v-b-modal.delete-confrim
                @click=";(modifyID = product.id), (modifyTitle = product.title)"
              >
                {{ $t('delete') }}
              </b-dropdown-item>
            </b-dropdown>
          </b-col>
          <hr />
        </b-row>
      </b-container>
      <div class="mx-2 mb-2">
        <b-row>
          <b-col
            cols="12"
            sm="6"
            class="
              d-flex
              align-items-center
              justify-content-center justify-content-sm-start
            "
          >
            <span class="text-muted">
              {{
                printf(
                  $t('pagination'),
                  (currentPage - 1) * perPage + 1,
                  currentPage * perPage,
                  totalRows
                )
              }}
            </span>
          </b-col>
          <!-- Pagination -->
          <b-col
            cols="12"
            sm="6"
            class="
              d-flex
              align-items-center
              justify-content-center justify-content-sm-end
            "
          >
            <b-pagination
              v-model="currentPage"
              :total-rows="totalRows"
              :per-page="perPage"
              first-number
              last-number
              class="mb-0 mt-1 mt-sm-0"
              prev-class="prev-item"
              next-class="next-item"
            >
              <template #prev-text>
                <b-icon icon="chevron-compact-left" font-scale="1.25" />
              </template>
              <template #next-text>
                <b-icon icon="chevron-compact-right" font-scale="1.25" />
              </template>
            </b-pagination>
          </b-col>
        </b-row>
      </div>
    </b-card>
    <b-modal
      id="delete-confrim"
      header-bg-variant="primary"
      header-class="text-white"
      title="確認刪除產品"
      @ok="productDelete"
    >
      <p class="my-4">
        您確定要刪除『<span style="color: red">{{ modifyTitle }}</span
        >』嗎？
      </p>
    </b-modal>
  </div>
</template>

<script>
import Ripple from 'vue-ripple-directive'
import vSelect from 'vue-select'
export default {
  name: 'ProductList',
  components: {
    vSelect
  },
  directives: {
    Ripple
  },
  data() {
    const printf = require('printf')
    return {
      printf,
      filter: {
        title: ''
      },
      modifyID: 0,
      modifyTitle: '',
      isLoading: false,
      searchQuery: '',
      productList: [],
      showMoreSwitch: new Array(10),
      totalRows: 0,
      page: 1,
      items: 10,
      perPageOptions: [10, 20, 30, 50],
      tableColumns: [
        { key: 'title', label: '商品名稱' },
        { key: 'styleTitle', label: '規格' },
        { key: 'price', label: this.$t('price') },
        { key: 'qty', label: this.$t('qty') },
        { key: 'sku', label: this.$t('sku') },
        { key: 'actions' }
      ]
    }
  },
  computed: {
    currentPage: {
      get() {
        return this.page
      },
      set(value) {
        this.page = value
        this.productFetch()
      }
    },
    perPage: {
      get() {
        return this.items
      },
      set(value) {
        this.items = value
        this.showMoreSwitch = new Array(value)
        this.productFetch()
      }
    }
  },
  mounted() {
    this.productFetch()
  },
  methods: {
    productFetch() {
      this.$axios
        .$post('/api/votes', {
          page: this.currentPage,
          items: this.perPage,
          ...this.filter
        })
        .then((res) => {
          this.productList = res.data
          this.totalRows = res.pager.total
        })
    },
    togglePubliced(id, event) {
      this.$axios.$post('/api/products/public', {
        id,
        is_public: event
      })
    },
    productDelete() {
      this.$store.commit('loadingStart')
      this.$axios
        .$post('/api/products/delete', {
          id: this.modifyID
        })
        .then((res) => {
          this.productFetch()
          this.$store.commit('loadingFinish')
        })
    }
  }
}
</script>
<style lang="scss">
@import 'vue-select/src/scss/vue-select.scss';
.product_list_header {
  text-align: center;
  padding: 0.25rem 0rem;
  font-weight: bold;
  background-color: #587ea3;
  color: #fff;
  margin-bottom: 12px;

  > div {
    align-self: center;
  }
}

.product_style_list {
  max-height: 90px;
  overflow: hidden;

  &.show {
    max-height: unset;
  }
}

.show-more-style {
  margin-top: 0.75rem;

  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 1px;
    border-bottom: 1px dashed #e5e5e5;
  }

  button {
    z-index: 1;
    background-color: #fff !important;
  }
}

.product_list_body {
  text-align: center;
  padding: 0.5rem 0rem;

  a {
    text-decoration: from-font underline dotted;
    font-weight: bold;
    text-underline-offset: 2px;
  }
}

.photo {
  width: 90px;
  height: 90px;
  float: left;
  padding: 0px;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  margin-right: 10px;
}
</style>

<style lang="scss" scoped>
div.row {
  > div {
    line-height: 32px;
  }
}
</style>
