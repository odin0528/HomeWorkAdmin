<template>
  <div class="auth-wrapper auth-v1 px-2">
    <div class="auth-inner py-2">
      <!-- Reset Password v1 -->
      <b-card class="mb-0">
        <!-- logo -->
        <b-link class="brand-logo">
          <b-img :src="appLogoImage" alt="logo" class="w-25" />
          <h2 class="brand-text text-primary ml-1">巨粽</h2>
        </b-link>

        <b-card-title class="mb-1"> 重設密碼 🔒 </b-card-title>
        <b-card-text class="mb-2">
          您必須在10分鐘內完成設定，不然此連結將會失效
        </b-card-text>

        <!-- form -->
        <validation-observer ref="resetPwdForm" v-slot="{ invalid }">
          <b-form
            method="POST"
            class="auth-reset-password-form mt-2"
            @submit.prevent="validationForm"
          >
            <!-- password -->
            <b-form-group label="新密碼" label-for="reset-password-new">
              <validation-provider
                v-slot="{ errors }"
                name="密碼"
                vid="Password"
                rules="required|password|min:8"
              >
                <b-input-group
                  class="input-group-merge"
                  :class="errors.length > 0 ? 'is-invalid' : null"
                >
                  <b-form-input
                    id="reset-password-new"
                    v-model="password"
                    :type="password1FieldType"
                    :state="errors.length > 0 ? false : null"
                    class="form-control-merge"
                    name="reset-password-new"
                  />
                  <b-input-group-append is-text>
                    <b-icon
                      class="cursor-pointer"
                      :icon="password1ToggleIcon"
                      @click="togglePassword1Visibility"
                    />
                  </b-input-group-append>
                </b-input-group>
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>

            <!-- confirm password -->
            <b-form-group label-for="reset-password-confirm" label="確認密碼">
              <validation-provider
                v-slot="{ errors }"
                name="確認密碼"
                rules="required|confirmed:Password"
              >
                <b-input-group
                  class="input-group-merge"
                  :class="errors.length > 0 ? 'is-invalid' : null"
                >
                  <b-form-input
                    id="reset-password-confirm"
                    v-model="cPassword"
                    :type="password2FieldType"
                    class="form-control-merge"
                    :state="errors.length > 0 ? false : null"
                    name="reset-password-confirm"
                  />
                  <b-input-group-append is-text>
                    <b-icon
                      class="cursor-pointer"
                      :icon="password2ToggleIcon"
                      @click="togglePassword2Visibility"
                    />
                  </b-input-group-append>
                </b-input-group>
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>

            <!-- submit button -->
            <b-button
              block
              type="submit"
              variant="primary"
              :disabled="invalid || loading"
            >
              設定新密碼
            </b-button>
          </b-form>
        </validation-observer>

        <p class="text-center mt-2">
          <b-link to="/login">
            <b-icon icon="chevron-left" /> 回到登入頁
          </b-link>
        </p>
      </b-card>
      <!-- /Reset Password v1 -->
    </div>
  </div>
</template>

<script>
/* eslint-disable global-require */
import { ValidationProvider, ValidationObserver, localize } from 'vee-validate'
import { VBTooltip } from 'bootstrap-vue'
import { required } from '~/@core/utils/validations/validations.js'
import { togglePasswordVisibility } from '~/@core/utils/forms'
import { $themeConfig } from '~/themeConfig'

export default {
  name: 'Reset',
  directives: {
    'b-tooltip': VBTooltip
  },
  components: {
    ValidationProvider,
    ValidationObserver
  },
  mixins: [togglePasswordVisibility],
  layout: 'empty',
  data() {
    const { appName, appLogoImage } = $themeConfig.app
    return {
      cPassword: '',
      password: '',
      appName,
      appLogoImage,
      loading: false,

      // validation rules
      required,

      password1FieldType: 'password',
      password2FieldType: 'password'
    }
  },
  computed: {
    password1ToggleIcon() {
      return this.password1FieldType === 'password'
        ? 'eye-slash-fill'
        : 'eye-fill'
    },
    password2ToggleIcon() {
      return this.password2FieldType === 'password'
        ? 'eye-slash-fill'
        : 'eye-fill'
    }
  },
  created() {
    localize('zhTW')
  },
  methods: {
    togglePassword1Visibility() {
      this.password1FieldType =
        this.password1FieldType === 'password' ? 'text' : 'password'
    },
    togglePassword2Visibility() {
      this.password2FieldType =
        this.password2FieldType === 'password' ? 'text' : 'password'
    },
    validationForm() {
      this.$refs.resetPwdForm.validate().then((success) => {
        if (success) {
          this.loading = true
          this.$axios
            .$post('/api/reset', {
              cPassword: this.cPassword,
              password: this.password,
              token: this.$route.params.token
            })
            .then((res) => {
              this.loading = false
              if (res.code === this.$config.returnCode.success) {
                this.$toast(this.$t('reset_password_success'))
                this.$router.push(`/`)
              } else {
                this.$toast(this.$t(res.code), 'danger')
              }
            })
        }
      })
    }
  }
}
</script>
