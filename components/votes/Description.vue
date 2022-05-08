<template>
  <b-row class="mb-3">
    <b-col cols="2"> *{{ $t('vote_description') }} </b-col>
    <b-col cols="10">
      <validation-provider
        v-slot="validationContext"
        :name="$t('vote_description')"
        rules="required"
      >
        <b-textarea
          v-model="description"
          :state="getValidationState(validationContext)"
          rows="9"
        />
        <span
          class="float-right"
          :class="{
            'text-danger': description.length > 3000,
            'font-weight-bold': description.length > 3000,
          }"
          >{{ description.length }}/ 3000</span
        >
        <b-form-invalid-feedback
          :class="{ 'd-block': validationContext.invalid }"
        >
          {{ validationContext.errors[0] }}
        </b-form-invalid-feedback>
      </validation-provider>
    </b-col>
  </b-row>
</template>

<script>
import { ValidationProvider, localize } from 'vee-validate'
import zhTw from 'vee-validate/dist/locale/zh_TW.json'
import { required } from '~/@core/utils/validations/validations.js'
import formValidation from '~/@core/comp-functions/forms/form-validation'
export default {
  components: {
    ValidationProvider,
  },
  data() {
    const { getValidationState } = formValidation(() => {})
    return {
      getValidationState,

      required,
    }
  },
  computed: {
    description: {
      get() {
        return this.$store.state.votes.description
      },
      set(value) {
        this.$store.commit('votes/updateDescription', value)
      },
    },
  },
  created() {
    localize('zhTw', zhTw)
  },
}
</script>

<style></style>
