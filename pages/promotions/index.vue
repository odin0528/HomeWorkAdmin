<template>
  <div class="content-wrapper clearfix">
    <b-row class="content-header">
      <b-col class="content-header-left mb-2" cols="9">
        <h2 class="text-primary">
          {{ $t('promotion_management') }}
        </h2>
      </b-col>
      <b-col cols="3">
        <div class="d-flex align-items-center justify-content-end">
          <b-button v-b-modal.create_promotion variant="primary">
            <span class="text-nowrap">{{ $t('new_promotion') }}</span>
          </b-button>
        </div>
      </b-col>
    </b-row>
    <b-card no-body class="mb-0">
      <b-table
        :items="promotionList"
        :fields="tableColumns"
        :busy="isLoading"
        show-empty
        :empty-text="$t('no_match_data')"
      >
        <template #table-busy>
          <div class="text-center text-danger my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong>Loading...</strong>
          </div>
        </template>
        <template #cell(during)="data">
          {{
            $moment.unix(data.item.start_timestamp).format('YYYY-MM-DD HH:mm')
          }}
          <br />
          {{ $moment.unix(data.item.end_timestamp).format('YYYY-MM-DD HH:mm') }}
        </template>
        <template #cell(type)="data">
          {{ $t(`promotion_${data.item.type}`) }}
        </template>
        <template #cell(mode)="data">
          {{ $t(`promotion_${data.item.mode}`) }}
        </template>
        <template #cell(method)="data">
          {{ $t(`promotion_${data.item.method}`) }}
        </template>
        <template #cell(actions)="data">
          <b-button
            v-b-modal.create_category
            variant="outline-primary"
            to="/promotions/"
          >
            {{ $t('edit') }}
          </b-button>
          <b-button
            v-b-modal.delete_category
            variant="outline-danger"
            @click="
              modifyId = data.item.id
              modifyIndex = data.index
              modifyTitle = data.item.title
            "
          >
            {{ $t('delete') }}
          </b-button>
        </template>
      </b-table>
      <b-card-footer>
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
      </b-card-footer>
    </b-card>
    <b-modal
      id="create_promotion"
      content-class="shadow"
      modal-class="modal-primary"
      header-bg-variant="primary"
      header-text-variant="light"
      :title="$t('promotion_type')"
      header-class="text-white"
      hide-footer
      centered
    >
      <b-card no-body>
        <b-card-header> 全館優惠 </b-card-header>
        <b-card-body>
          <b-card-text>
            全館購物滿特定金額或特定數量，給予折扣數或折價
          </b-card-text>
          <b-button
            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
            variant="primary"
            to="/promotions/create/sitewide_discount"
          >
            {{ $t('create') }}
          </b-button>
        </b-card-body>
      </b-card>
    </b-modal>

    <b-modal
      id="delete_category"
      content-class="shadow"
      modal-class="modal-danger"
      :title="$t('delete_category')"
      :ok-title="$t('confirm')"
      :ok-disabled="isLoading"
      :cancel-title="$t('cancel')"
      centered
      ok-variant="danger"
      @ok="deleteCategory"
    >
      <b-card-text>
        <h5 class="text-danger">
          {{ printf($t('delete_category_confirm'), modifyTitle) }}
        </h5>
        <span class="text-secondary">{{ $t('delete_category_hint') }}</span>
      </b-card-text>
    </b-modal>
  </div>
</template>

<script>
import Ripple from 'vue-ripple-directive'

export default {
  directives: {
    Ripple,
  },
  data() {
    const printf = require('printf')
    return {
      isLoading: true,
      modifyId: 0,
      modifyIndex: 0,
      modifyTitle: '',
      totalRows: 0,
      page: 1,
      items: 10,
      tableColumns: [
        { key: 'title', label: '促銷活動名稱' },
        { key: 'during', label: '活動期間' },
        { key: 'type', label: '活動類型' },
        { key: 'mode', label: '優惠條件' },
        { key: 'method', label: '折扣類型' },
        { key: 'actions', class: 'col-2' },
      ],
      promotionList: [],
      printf,
    }
  },
  computed: {
    currentPage: {
      get() {
        return this.page
      },
      set(value) {
        this.page = value
        this.fetch()
      },
    },
    perPage: {
      get() {
        return this.items
      },
      set(value) {
        this.items = value
        this.fetch()
      },
    },
  },
  mounted() {
    this.currentPage = 1
  },
  methods: {
    fetch() {
      this.$axios
        .$post('/api/promotions', {
          page: this.currentPage,
          items: this.perPage,
        })
        .then((res) => {
          this.isLoading = false
          this.promotionList = res.data
          this.totalRows = res.pager.total
        })
    },
    deleteCategory() {
      this.isLoading = true
      this.$axios
        .$post('/api/category/delete', {
          id: this.modifyId,
        })
        .then(() => {
          this.categories.splice(this.modifyIndex, 1)
          this.isLoading = false
          this.$root.$emit('bv::hide::modal', 'delete_category')
        })
    },
  },
}
</script>
