<template>
  <div>
    <b-nav class="order-navbar" pills tabs>
      <b-nav-item :active="status[0] == 21" @click="status = [21]"
        >待出貨
      </b-nav-item>
      <b-nav-item :active="status.length > 1" @click="status = [22, 23]"
        >揀貨中
      </b-nav-item>
      <b-nav-item :active="status[0] == 24" @click="status = [24]"
        >已出貨</b-nav-item
      >
      <b-nav-item :active="status[0] == 51" @click="status = [51]"
        >配送中</b-nav-item
      >
      <b-nav-item :active="status[0] == 91" @click="status = [91]"
        >已完成</b-nav-item
      >
      <b-nav-item :active="status[0] == 61" @click="status = [61]"
        >退貨中</b-nav-item
      >
      <b-nav-item :active="status[0] == 11" @click="status = [11]"
        >待付款
      </b-nav-item>
    </b-nav>
    <div class="order-manager with-footer">
      <div style="height: calc(100vh - 195px); overflow-y: auto">
        <orders-list
          ref="orderList"
          :order-list="orderList"
          :is-loading="isLoading"
          :selected-order-ids.sync="selectedOrderIds"
        />
      </div>
      <b-card>
        <div class="date-time-picker">
          <div
            class="field flex align-center"
            :class="{ 'has-value': filter.shipment_no.length > 0 }"
          >
            <b-form-input
              v-model="filter.shipment_no"
              class="field-input"
              placeholder="託運單號"
            />
            <label class="field-label">託運單號</label>
          </div>
        </div>
        <div class="date-time-picker">
          <div
            class="field flex align-center"
            :class="{ 'has-value': filter.fullname.length > 0 }"
          >
            <b-form-input
              v-model="filter.fullname"
              class="field-input"
              placeholder="收件人名稱"
            />
            <label class="field-label">收件人名稱</label>
          </div>
        </div>
        <div class="date-time-picker">
          <div
            class="field flex align-center"
            :class="{ 'has-value': filter.phone.length > 0 }"
          >
            <b-form-input
              v-model="filter.phone"
              class="field-input"
              placeholder="收件人電話"
            />
            <label class="field-label">收件人電話</label>
          </div>
        </div>

        <b-form-group label="訂單成立日期">
          <VueCtkDateTimePicker
            id="start_date"
            v-model="filter.start_date"
            label="開始時間"
            format="YYYY-MM-DD"
            formatted="YYYY-MM-DD"
            locale="zh-tw"
            color="#9d4edd"
            auto-close
            right
            only-date
          />
          <VueCtkDateTimePicker
            id="start_date"
            v-model="filter.end_date"
            label="結束時間"
            format="YYYY-MM-DD"
            formatted="YYYY-MM-DD"
            locale="zh-tw"
            color="#9d4edd"
            auto-close
            right
            only-date
          />
        </b-form-group>
        <b-form-group label="訂單金額範圍">
          <div class="date-time-picker">
            <div
              class="field flex align-center"
              :class="{ 'has-value': filter.min_price.length > 0 }"
            >
              <b-form-input
                v-model="filter.min_price"
                class="field-input"
                placeholder="最小金額"
              />
              <label class="field-label">最小金額</label>
            </div>
          </div>
          <div class="date-time-picker">
            <div
              class="field flex align-center"
              :class="{ 'has-value': filter.max_price.length > 0 }"
            >
              <b-form-input
                v-model="filter.max_price"
                class="field-input"
                placeholder="最大金額"
              />
              <label class="field-label">最大金額</label>
            </div>
          </div>
        </b-form-group>
        <b-form-group label="付款方式">
          <b-form-select
            v-model="filter.payment"
            class="field-input"
            placeholder="付款方式"
            :options="$config.paymentList"
          />
        </b-form-group>
        <b-form-group label="運送方式">
          <b-form-select
            v-model="filter.method"
            class="field-input"
            placeholder="運送方式"
            :options="$config.logisticsList"
          />
        </b-form-group>
        <b-button variant="primary" @click="orderFetch">搜尋</b-button>
      </b-card>
    </div>
    <div class="footer-fixed">
      <footer class="bg-primary">
        <b-row class="mx-3">
          <b-col cols="2" class="d-flex align-items-center">
            <template v-if="status[0] == 21">
              <b-form-checkbox class="mr-4" @change="selectAll($event)"
                ><span class="text-white">全選</span></b-form-checkbox
              >
              <b-button
                v-b-modal.start_pickup
                variant="danger"
                class="py-2"
                :disabled="selectedOrderIds.length == 0"
                >開始揀貨</b-button
              >
            </template>
          </b-col>
          <b-col
            cols="12"
            sm="8"
            class="d-flex align-items-center justify-content-center"
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
          <b-col
            cols="12"
            sm="2"
            class="
              d-flex
              align-items-center
              justify-content-center justify-content-sm-start
            "
          >
            <span>
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
        </b-row>
      </footer>
    </div>
    <b-modal
      id="start_pickup"
      content-class="shadow"
      title="確認視窗"
      :ok-title="$t('confirm')"
      :ok-disabled="isLoading"
      :cancel-title="$t('cancel')"
      header
      centered
      @ok="startPickup"
    >
      <b-card-text>
        <h5>確定開始揀貨？</h5>
      </b-card-text>
    </b-modal>
  </div>
</template>

<script>
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker'
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css'
export default {
  name: 'OrderList',
  components: {
    VueCtkDateTimePicker,
  },
  data() {
    const printf = require('printf')
    return {
      printf,
      isLoading: false,
      searchQuery: '',
      orderList: [],
      selectedOrderIds: [],
      totalRows: 0,
      page: 1,
      items: 10,
      perPageOptions: [10, 20, 50, 100],
      orderStatus: [21],
      filter: {
        shipment_no: '',
        fullname: '',
        phone: '',
        payment: 0,
        method: 0,
        min_price: '',
        max_price: '',
        start_date: '',
        end_date: '',
      },
    }
  },
  computed: {
    currentPage: {
      get() {
        return this.page
      },
      set(value) {
        this.page = value
        this.orderFetch()
      },
    },
    perPage: {
      get() {
        return this.items
      },
      set(value) {
        this.items = value
        this.showMoreSwitch = new Array(value)
        this.orderFetch()
      },
    },
    status: {
      get() {
        return this.orderStatus
      },
      set(value) {
        this.orderStatus = value
        this.orderFetch()
      },
    },
  },
  mounted() {
    this.orderFetch()
  },
  methods: {
    orderFetch() {
      const filter = {}
      Object.assign(filter, this.filter)
      filter.min_price = parseInt(filter.min_price)
      filter.max_price = parseInt(filter.max_price)
      this.$axios
        .$post('/api/orders', {
          ...filter,
          status: this.status,
          order_by: 'updated_at',
          sort: 'DESC',
          page: this.currentPage,
          items: this.perPage,
        })
        .then((res) => {
          this.orderList = res.data
          this.totalRows = res.pager.total
        })
    },
    startPickup() {
      this.$axios
        .$post('/api/order/pickup', {
          ids: this.selectedOrderIds,
        })
        .then((res) => {
          if (res.code === 200) {
            this.$toast(this.$t('update_order_status_success'))
            this.orderFetch()
          }
        })
    },
    selectAll(value) {
      this.$refs.orderList.selectAll(value)
    },
  },
}
</script>
<style lang="scss">
@import '~/assets/scss/base/bootstrap-extended/variables';
@import '~/assets/scss/variables/variables';
.order-manager {
  display: grid;
  grid-template-columns: 4fr 1fr;
  grid-gap: 0.5rem;
  .order-navbar {
    .nav-item {
      border-radius: 5px;

      .nav-link {
        padding: 0.75rem 2.5rem;
        line-height: 1.5rem;
        color: $primary;
      }

      &.active {
        background-color: $primary;
        border-radius: 5px;

        .nav-link {
          padding: 0.75rem 2.5rem;
          line-height: 1.5rem;
          color: $white;
        }
      }
    }
  }
  .order-item-photo {
    width: 75px;
    height: 75px;
    background-size: cover;
    background-position: center;
  }

  .order-body {
    display: grid;
    grid-template-columns: 2fr 1fr;
  }

  .order-item {
    margin-bottom: 0.5rem;
    .card-body {
      padding: 0.75rem;
    }
    .order-item-style {
      display: flex;
      justify-content: flex-start;

      .item-information {
        > div {
          width: 100%;
        }
      }

      .item-options {
        display: flex;
        align-content: center;
        flex-wrap: wrap;

        > * {
          width: 100%;
        }
      }
    }

    hr {
      margin-left: 0px;
      margin-right: auto;
      border-style: dotted;
    }
  }
}

.date-time-picker {
  margin-bottom: 0.5rem;
}

.field.has-value:not(.no-label) .field-input {
  padding-top: 14px;
}

.field-input {
  cursor: pointer;
  background-color: #fff;
  -webkit-transition-duration: 0.3s;
  transition-duration: 0.3s;
  position: relative;
  width: 100%;
  height: 42px;
  min-height: 42px;
  padding-left: 12px;
  padding-right: 44px;
  font-weight: 400;
  -webkit-appearance: none;
  outline: none;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  font-size: 14px;
  z-index: 0;
}

.field.has-value .field-label {
  opacity: 1;
  -webkit-transform: translateY(0);
  transform: translateY(0);
  font-size: 11px;
}

.field-label {
  position: absolute;
  top: 1px !important;
  cursor: pointer;
  left: 13px;
  -webkit-transform: translateY(25%);
  transform: translateY(25%);
  opacity: 0;
  -webkit-transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
  font-size: 11px;
  color: rgba(0, 0, 0, 0.54);
}
</style>
