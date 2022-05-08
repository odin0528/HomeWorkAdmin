<template>
  <div class="auth-wrapper auth-v2">
    <b-row class="auth-inner m-0">
      <!-- Brand logo-->
      <b-link class="brand-logo">
        <b-img :src="appLogoImage" alt="logo" />
        <h2 class="brand-text text-primary ml-1">
          {{ appName }}
        </h2>
      </b-link>
      <!-- /Brand logo-->

      <!-- Left Text-->
      <b-col lg="8" class="d-none d-lg-flex align-items-center p-5">
        <div
          class="w-100 d-lg-flex align-items-center justify-content-center px-5"
        >
          <b-img fluid :src="imgUrl" alt="Login V2" />
        </div>
      </b-col>
      <!-- /Left Text-->

      <!-- Login-->
      <b-col lg="4" class="d-flex align-items-center auth-bg px-2 p-lg-5">
        <b-col sm="8" md="6" lg="12" class="px-xl-2 mx-auto">
          <b-card-title class="mb-1 font-weight-bold" title-tag="h2">
            Welcome to Simple Vote System! 👋
          </b-card-title>

          <!-- form -->
          <validation-observer ref="loginForm" v-slot="{ invalid }">
            <b-form class="auth-login-form mt-2" @submit.prevent="login">
              <!-- email -->
              <b-form-group label="帳號" label-for="login-account">
                <validation-provider
                  v-slot="{ errors }"
                  name="Account"
                  vid="account"
                  rules="required"
                >
                  <b-form-input
                    id="login-account"
                    v-model="account"
                    :state="errors.length > 0 ? false : null"
                    name="login-account"
                    placeholder="請輸入帳號"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <!-- forgot password -->
              <b-form-group>
                <div class="d-flex justify-content-between">
                  <label for="login-password">密碼</label>
                </div>
                <validation-provider
                  v-slot="{ errors }"
                  name="Password"
                  vid="password"
                  rules="required"
                >
                  <b-input-group
                    class="input-group-merge"
                    :class="errors.length > 0 ? 'is-invalid' : null"
                  >
                    <b-form-input
                      id="login-password"
                      v-model="password"
                      :state="errors.length > 0 ? false : null"
                      class="form-control-merge"
                      :type="passwordFieldType"
                      name="login-password"
                      placeholder="請輸入密碼"
                    />
                    <b-input-group-append is-text>
                      <b-icon
                        class="cursor-pointer"
                        :icon="passwordToggleIcon"
                        @click="togglePasswordVisibility"
                      />
                    </b-input-group-append>
                  </b-input-group>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <!-- checkbox -->
              <b-form-group>
                <b-form-checkbox
                  id="remember-me"
                  v-model="remember"
                  name="checkbox-1"
                  tabindex="2"
                >
                  記住帳號
                </b-form-checkbox>
              </b-form-group>

              <!-- submit buttons -->
              <b-button
                type="submit"
                variant="primary"
                block
                :disabled="invalid || loading"
              >
                <b-spinner v-if="loading" class="mr-1" small></b-spinner>登入
              </b-button>
            </b-form>
          </validation-observer>
        </b-col>
      </b-col>
      <!-- /Login-->
    </b-row>
  </div>
</template>

<script>
/* eslint-disable global-require */
import { ValidationProvider, ValidationObserver, localize } from 'vee-validate'
import { required, email } from '~/@core/utils/validations/validations.js'
import { togglePasswordVisibility } from '~/@core/utils/forms'
import { $themeConfig } from '~/themeConfig'

export default {
  name: 'Login',
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  mixins: [togglePasswordVisibility],
  layout: 'empty',
  data() {
    const { appName, appLogoImage } = $themeConfig.app
    return {
      remember: !!this.$cookies.get('account'),
      password: '',
      account: this.$cookies.get('account') || '',
      appName,
      appLogoImage,
      loading: false,

      // validation rules
      required,
      email,
    }
  },
  computed: {
    passwordToggleIcon() {
      return this.passwordFieldType === 'password'
        ? 'eye-slash-fill'
        : 'eye-fill'
    },
    imgUrl() {
      return require('~/assets/images/pages/login-v2.svg')
    },
  },
  created() {
    localize('zhTW')
  },
  methods: {
    login() {
      this.$refs.loginForm.validate().then((success) => {
        this.loading = true
        this.$axios
          .$post('/api/login', {
            account: this.account,
            password: this.password,
          })
          .then((res) => {
            this.loading = false
            if (this.remember) {
              this.$cookies.set('account', this.account)
            } else {
              this.$cookies.remove('account')
            }

            if (res.code === this.$config.returnCode.success) {
              this.$cookies.set('gz_admin', res.data.token)
              this.$router.push(`/`)
            } else {
              this.$toast(this.$t(res.data), 'danger')
            }
          })
      })
    },
  },
}
</script>

<style lang="scss">
@import '~/assets/scss/vue/pages/page-auth.scss';
</style>
