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
                <span class="text-nowrap">{{ $t('vote_create') }}</span>
              </b-button>
            </div>
          </b-col>
        </b-row>
      </div>

      <b-container fluid>
        <b-row class="product_list_header">
          <b-col cols="2">{{ $t('status') }}</b-col>
          <b-col cols="4">{{ $t('vote_title') }}</b-col>
          <b-col cols="2">{{ $t('vote_start_time') }}</b-col>
          <b-col cols="2">{{ $t('vote_end_time') }}</b-col>
          <b-col cols="2">{{ $t('action') }}</b-col>
        </b-row>
        <b-row
          v-for="(vote) in voteList"
          :key="vote.id"
          class="product_list_body py-0"
        >
          <b-col cols="2">
            <b-badge
              :variant="voteStatusVariant(vote.status)"
              class="col-12"
              style="line-height: 30px"
            >
              {{ $t(`vote_status_${vote.status}`) }}
            </b-badge>
          </b-col>
          <b-col cols="4" class="text-left">
            <b-link :to="`/votes/${vote.id}`">
              {{ vote.title }}
            </b-link>
          </b-col>
          <b-col cols="2">{{ $moment.unix(vote.start_time).format('yy-MM-DD hh:mm') }}</b-col>
          <b-col cols="2">{{ $moment.unix(vote.start_time).format('yy-MM-DD hh:mm') }}</b-col>
          <b-col cols="2">
            <b-dropdown
              v-ripple.400="'rgba(186, 191, 199, 0.15)'"
              :text="$t('more_action')"
              variant="flat-secondary"
            >
              <b-dropdown-item
                :to="`/votes/edit/${vote.id}`"
              >
                {{ $t('edit') }}
              </b-dropdown-item>
              <b-dropdown-item
                v-if="vote.status === 0"
                @click="changeVoteStatus(vote.id, 1)"
              >
                {{ $t('vote_start') }}
              </b-dropdown-item>
              <b-dropdown-item
                v-if="vote.status === 1"
                @click="changeVoteStatus(vote.id, 2)"
              >
                {{ $t('vote_finish') }}
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
  </div>
</template>

<script>
import Ripple from 'vue-ripple-directive'
import vSelect from 'vue-select'
export default {
  name: 'voteList',
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
      voteList: [],
      showMoreSwitch: new Array(10),
      totalRows: 0,
      page: 1,
      items: 10,
      perPageOptions: [10, 20, 30, 50],
    }
  },
  computed: {
    currentPage: {
      get() {
        return this.page
      },
      set(value) {
        this.page = value
        this.voteFetch()
      }
    },
    perPage: {
      get() {
        return this.items
      },
      set(value) {
        this.items = value
        this.showMoreSwitch = new Array(value)
        this.voteFetch()
      }
    }
  },
  mounted() {
    this.voteFetch()
  },
  methods: {
    voteFetch() {
      this.$axios
        .$post('/api/votes', {
          page: this.currentPage,
          items: this.perPage,
          ...this.filter
        })
        .then((res) => {
          this.voteList = res.data.data
          this.totalRows = res.data.total
        })
    },
    changeVoteStatus(id, status) {
      this.$axios.$post('/api/votes/status', {
        id,
        status
      }).then((res)=>{
        if(res.code === 200){
          this.voteFetch()
        }
      })
    },
    voteStatusVariant(status) {
      switch (status) {
        case 0:
          return 'secondary'
        case 2:
          return 'danger'
        case 1:
          return 'success'
      }
    },
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
