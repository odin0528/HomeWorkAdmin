<template>
  <div>
    <div
      class="product_photo_uploader cousor-pointer"
      :style="{ backgroundImage: `url(${photo})` }"
    >
      <div v-if="id===0" class="toolbar">
        <span class="ml-2" @click="$refs.productPhoto.click()">
          <b-icon icon="cloud-upload" scale="1" />
        </span>
        <span class="mr-2" @click="deletePhoto">
          <b-icon icon="x" scale="1.5" />
        </span>
      </div>
      <div v-if="!photo" class="pickup_photo"  @click="$refs.productPhoto.click()">
        上傳候選人照片
      </div>
      <input
        ref="productPhoto"
        type="file"
        class="d-none"
        @input="inputImageRenderer"
      />
    </div>
    <div class="w-100 text-center pt-2">
      <validation-provider
        v-slot="validationContext"
        :name="$t('candidate_title')"
        rules="required"
      >
        <b-input-group>
          <b-form-input
            :value="title"
            :placeholder="$t('candidate_title_placeholder')"
            :state="getValidationState(validationContext)"
            class="candidate-title"
            @input="$emit('updatePhotoTitle', index, id, $event)"
          />
        </b-input-group>
        <b-form-invalid-feedback
          :class="{ 'd-block': validationContext.invalid }"
        >
          {{ validationContext.errors[0] }}
        </b-form-invalid-feedback>
      </validation-provider>
    </div>
  </div>
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
  props: {
    index: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      default() {
        return ''
      }
    },
    id: {
      type: Number,
      default() {
        return 0
      }
    },
    photo: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data(){
    const { getValidationState } = formValidation(() => {})
    return {
      getValidationState,

      required,
    }
  },
  created() {
    localize('zhTw', zhTw)
    this.$validator = this.$parent.$validator
  },
  methods: {
    inputImageRenderer() {
      if (this.$refs.productPhoto.files[0]) {
        const reader = new FileReader()
        reader.addEventListener(
          'load',
          () => {
            this.$emit('pickupPhoto', this.index, this.id, reader.result)
          },
          false
        )
        reader.readAsDataURL(this.$refs.productPhoto.files[0])
      }
    },
    deletePhoto() {
      this.$emit('deletePhoto', this.index)
    }
  }
}
</script>

<style lang="scss">
.product_photo_uploader {
  width: 120px;
  height: 120px;
  border: 1px dashed #587ea3;
  background: transparent;
  border-radius: 10px;
  color: #587ea3;
  padding: 0px;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;

  &:hover {
    background: #ece8ff;
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
  }

  .pickup_photo {
    width: 100%;
    height: 90px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .toolbar {
    background: black;
    opacity: 0.5;
    width: 100%;
    border-radius: 10px 10px 0 0;
    justify-content: space-between;
    display: flex;

    svg {
      color: #fff;
      cursor: pointer;
    }
  }
}

.candidate-title{
  width: 120px;
}
</style>
