<template>
  <validation-observer ref="refFormObserver">
    <div class="col-10">
      <b-card>
        <b-card-title>
          {{ $t('basic_information_setting') }}
        </b-card-title>
        <b-container>
          <b-row class="mb-3">
            <b-col cols="2" class="pt-2"> *{{ $t('promotion_title') }} </b-col>
            <b-col cols="10">
              <validation-provider
                v-slot="validationContext"
                :name="$t('promotion_title')"
                rules="required"
              >
                <b-input-group>
                  <template #append>
                    <div class="input-group-append">
                      <div
                        class="input-group-text"
                        :class="{
                          'text-danger': title.length > 60,
                          'font-weight-bold': title.length > 60,
                        }"
                      >
                        {{ title.length }} / 60
                      </div>
                    </div>
                  </template>

                  <b-form-input
                    v-model="title"
                    :placeholder="$t('promotion_title_placeholder')"
                    :state="getValidationState(validationContext)"
                  />
                </b-input-group>
                <b-form-invalid-feedback
                  :class="{ 'd-block': validationContext.invalid }"
                >
                  {{ validationContext.errors[0] }}
                </b-form-invalid-feedback>
                <small class="text-muted">{{
                  $t('promotion_title_hint')
                }}</small>
              </validation-provider>
            </b-col>
          </b-row>
          <b-row class="mb-3">
            <b-col cols="2" class="pt-3"> *{{ $t('promotion_during') }} </b-col>
            <b-col cols="10" class="d-flex">
              <div class="mr-4">
                <validation-provider
                  v-slot="validationContext"
                  name="開始時間"
                  rules="required"
                >
                  <VueCtkDateTimePicker
                    id="start_date"
                    v-model="start_timestamp"
                    label="開始時間"
                    format="YYYY-MM-DD HH:mm"
                    formatted="YYYY-MM-DD HH:mm"
                    :min-date="$moment().format('YYYY-MM-DD')"
                    locale="zh-tw"
                    color="#9d4edd"
                  />
                  <b-form-invalid-feedback
                    :class="{ 'd-block': validationContext.invalid }"
                  >
                    {{ validationContext.errors[0] }}
                  </b-form-invalid-feedback>
                </validation-provider>
              </div>
              <div>
                <validation-provider
                  v-slot="validationContext"
                  name="結束時間"
                  rules="required"
                >
                  <VueCtkDateTimePicker
                    id="end_date"
                    v-model="end_timestamp"
                    label="結束時間"
                    format="YYYY-MM-DD HH:mm"
                    formatted="YYYY-MM-DD HH:mm"
                    :min-date="$moment(start_timestamp).format('YYYY-MM-DD')"
                    locale="zh-tw"
                    color="#9d4edd"
                  />
                  <b-form-invalid-feedback
                    :class="{ 'd-block': validationContext.invalid }"
                  >
                    {{ validationContext.errors[0] }}
                  </b-form-invalid-feedback>
                </validation-provider>
              </div>
            </b-col>
          </b-row>
          <b-row class="mb-3">
            <b-col cols="2" class="pt-3"> {{ $t('promotion_switch') }} </b-col>
            <b-col cols="10" class="pt-3">
              <b-checkbox v-model="is_enabled" size="lg" switch />
            </b-col>
          </b-row>
        </b-container>
      </b-card>
      <promotions-sitewide-discount
        v-if="$route.params.type === 'sitewide_discount'"
      />
      <b-card class="text-right sticky-bottom">
        <b-button
          v-b-modal.cancel_confirm
          variant="outline-secondary"
          class="mr-3 px-4"
        >
          {{ $t('cancel') }}
        </b-button>
        <b-button variant="primary" class="px-4" @click="save">
          {{ $t('save') }}
        </b-button>
      </b-card>
    </div>
    <b-modal
      id="cancel_confirm"
      content-class="shadow"
      modal-class="modal-danger"
      :title="$t('product_cancel_confirm')"
      :ok-title="$t('confirm')"
      :cancel-title="$t('cancel')"
      centered
      ok-variant="danger"
      @ok="leavePromotion"
    >
      <b-card-text>
        <h5 class="text-danger">
          {{ $t('product_cancel_confirm_hint') }}
        </h5>
      </b-card-text>
    </b-modal>
  </validation-observer>
</template>
<script>
import { ValidationProvider, ValidationObserver, localize } from 'vee-validate'
import zhTw from 'vee-validate/dist/locale/zh_TW.json'
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker'

import { required } from '~/@core/utils/validations/validations.js'
import formValidation from '~/@core/comp-functions/forms/form-validation'

import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css'
export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    VueCtkDateTimePicker,
  },

  data() {
    const { getValidationState } = formValidation(() => {})
    return {
      getValidationState,

      required,
    }
  },
  computed: {
    title: {
      get() {
        return this.$store.state.promotions.title
      },
      set(value) {
        this.$store.commit('promotions/updateTitle', value)
      },
    },
    start_timestamp: {
      get() {
        return this.$moment
          .unix(this.$store.state.promotions.start_timestamp)
          .format('YYYY-MM-DD HH:mm')
      },
      set(value) {
        this.$store.commit(
          'promotions/updateStartTimestamp',
          this.$moment(value).unix()
        )
      },
    },
    end_timestamp: {
      get() {
        return this.$moment
          .unix(this.$store.state.promotions.end_timestamp)
          .format('YYYY-MM-DD HH:mm')
      },
      set(value) {
        this.$store.commit(
          'promotions/updateEndTimestamp',
          this.$moment(value).unix()
        )
      },
    },
    is_enabled: {
      get() {
        return this.$store.state.promotions.is_enabled
      },
      set(value) {
        this.$store.commit('promotions/updateEnabled', value)
      },
    },
  },
  created() {
    localize('zhTw', zhTw)
  },
  mounted() {
    this.$store.commit('promotions/updateStartTimestamp', this.$moment().unix())
    this.$store.commit(
      'promotions/updateEndTimestamp',
      this.$moment().add(12, 'hours').unix()
    )
    this.$store.commit('promotions/updateType', this.$route.params.type)
    if (this.$route.params.id) {
      this.$store.commit('promotions/updateID', this.$route.params.id)
    }
  },
  methods: {
    leavePromotion() {
      this.$router.push('/promotions')
    },
    save() {
      this.$refs.refFormObserver.validate().then((result) => {
        if (result) {
          this.$store
            .dispatch('promotions/validate')
            .then((res) => {
              if (res) {
                this.$store.commit('loadingStart')
                this.$axios
                  .$post('/api/promotions/modify', this.$store.state.promotions)
                  .then((res) => {
                    if (res.code === 200) {
                      this.$router.push('/promotions')
                    }
                  })
              }
            })
            .catch((err) => {
              this.$toast(err.message, 'danger')
            })
        }
      })
    },
  },
}
</script>

<style lang="scss">
.date-time-picker {
  width: 200px;
  display: inline-block;
}
</style>
