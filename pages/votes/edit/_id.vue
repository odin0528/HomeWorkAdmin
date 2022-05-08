<template>
  <validation-observer ref="refFormObserver">
    <div class="col-12">
      <b-card>
        <b-card-title>
          {{ $t('basic_information_setting') }}
        </b-card-title>
        <b-container>
          <b-row class="mb-3">
            <b-col cols="2"> *{{ $t('vote_title') }} </b-col>
            <b-col cols="10">
              <validation-provider
                v-slot="validationContext"
                :name="$t('vote_title')"
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
                    :value="title"
                    :placeholder="$t('vote_title_placeholder')"
                    :state="getValidationState(validationContext)"
                    @input="$store.commit('votes/updateTitle', $event)"
                  />
                </b-input-group>
                <b-form-invalid-feedback
                  :class="{ 'd-block': validationContext.invalid }"
                >
                  {{ validationContext.errors[0] }}
                </b-form-invalid-feedback>
              </validation-provider>
            </b-col>
          </b-row>
          <votes-description @setDescription="setDescription" />
          <votes-photo-controller
            @pickupPhoto="pickupPhoto"
            @deletePhoto="deletePhoto"
          />
        </b-container>
      </b-card>
      <votes-footer @save="save" @saveDraft="saveDraft" />
      <b-modal
        id="cancel_confirm"
        content-class="shadow"
        modal-class="modal-danger"
        :title="$t('product_cancel_confirm')"
        :ok-title="$t('confirm')"
        :cancel-title="$t('cancel')"
        centered
        ok-variant="danger"
        @ok="leaveVote"
      >
        <b-card-text>
          <h5 class="text-danger">
            {{ $t('product_cancel_confirm_hint') }}
          </h5>
        </b-card-text>
      </b-modal>
    </div>
  </validation-observer>
</template>
<script>
import { mapState } from 'vuex'
import { ValidationProvider, ValidationObserver, localize } from 'vee-validate'
import zhTw from 'vee-validate/dist/locale/zh_TW.json'
import { required } from '~/@core/utils/validations/validations.js'
import formValidation from '~/@core/comp-functions/forms/form-validation'
export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },

  data() {
    const { getValidationState } = formValidation(() => {})
    return {
      isLoading: true,
      isPublic: true,
      productID: 0,

      getValidationState,

      required,
    }
  },

  async fetch() {
    this.$store.commit('products/reset')
    if (this.$route.params.id > 0) {
      await this.$axios
        .$get(`/api/vote/${this.$route.params.id}`)
        .then((res) => {
          const vote = res.data
          this.productID = vote.id
          this.$store.commit('votes/updateTitle', vote.title)
          this.$store.commit('votes/updateDescription', vote.description)


          for (const i in vote.photos) {
            this.$store.commit('votes/addCandidate')
            this.$store.commit('votes/updatePhoto', {
              index: i,
              id: vote.photos[i].id,
              photo: vote.photos[i].photo,
              title: vote.photos[i].title
            })
          }
        })
    }
  },

  computed: mapState({
    title: (state) => state.votes.title,
  }),
  created() {
    localize('zhTw', zhTw)
  },
  methods: {
    pickupPhoto(index, photo) {
      this.photos[index] = photo
    },
    deletePhoto(index) {
      delete this.photos[index]
    },
    setDescription(description) {
      this.description = description
    },
    leaveVote() {
      this.$router.push('/votes')
    },
    saveDraft() {
      this.isPublic = false
      this.save()
    },
    save() {
      this.$refs.refFormObserver.validate().then((result) => {
        if (result) {
          // this.$store.commit('loadingStart')
          const products = this.$store.state.products

          const req = {
            id: this.productID,
            title: products.title,
            description: products.description,
            photos: products.photos,
            is_public: this.isPublic,
          }

          this.$axios.$post('/api/vote/save', req).then((res) => {
            if (res.code === 200) {
              this.$store.commit('vote/reset')
              this.$store.commit('loadingFinish')
              this.isPublic = true
              this.leaveVote()
            }
          })
        }
      })
    },
  },
}
</script>

<style lang="scss">
@import '~/assets/scss/variables/variables.scss';
.products-photo-list {
  display: grid;
  grid-template-columns: repeat(5, 125px);
  grid-column-gap: 18px;
}
</style>
