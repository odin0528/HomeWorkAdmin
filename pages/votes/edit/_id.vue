<template>
  <validation-observer ref="refFormObserver">
    <div class="col-12">
      <b-card>
        <b-card-title>
          {{ $t('vote_management') }}
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
          <b-row class="mb-3">
            <b-col cols="2" class="pt-3"> *{{ $t('vote_during') }} </b-col>
            <b-col cols="10" class="d-flex">
              <div class="mr-4">
                <validation-provider
                  v-slot="validationContext"
                  name="開始時間"
                  rules="required"
                >
                  <VueCtkDateTimePicker
                    id="start_date"
                    v-model="startTimestamp"
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
                    v-model="endTimestamp"
                    label="結束時間"
                    format="YYYY-MM-DD HH:mm"
                    formatted="YYYY-MM-DD HH:mm"
                    :min-date="$moment(startTimestamp).format('YYYY-MM-DD')"
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
          <votes-description />
          <photo-controller />
        </b-container>
      </b-card>
      <votes-footer @save="save" @saveDraft="saveDraft" />
      <b-modal
        id="cancel_confirm"
        content-class="shadow"
        modal-class="modal-danger"
        :title="$t('vote_cancel_confirm')"
        :ok-title="$t('confirm')"
        :cancel-title="$t('cancel')"
        centered
        ok-variant="danger"
        @ok="leaveVote"
      >
        <b-card-text>
          <h5 class="text-danger">
            {{ $t('vote_cancel_confirm_hint') }}
          </h5>
        </b-card-text>
      </b-modal>
    </div>
  </validation-observer>
</template>
<script>
import { mapState } from 'vuex'
import { ValidationProvider, ValidationObserver, localize, withValidation } from 'vee-validate'
import zhTw from 'vee-validate/dist/locale/zh_TW.json'
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker'
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css'
import { required } from '~/@core/utils/validations/validations.js'
import formValidation from '~/@core/comp-functions/forms/form-validation'
import PhotoController from '~/components/votes/PhotoController'
export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    VueCtkDateTimePicker,
    PhotoController: withValidation(PhotoController)
  },

  data() {
    const { getValidationState } = formValidation(() => {})
    return {
      isLoading: true,
      status: true,
      voteID: 0,
      startTimestamp: '',
      endTimestamp: '',

      getValidationState,

      required,
    }
  },

  async fetch() {
    this.$store.commit('votes/reset')
    if (this.$route.params.id > 0) {
      await this.$axios
        .$get(`/api/votes/${this.$route.params.id}`)
        .then((res) => {
          const vote = res.data
          this.voteID = vote.id
          this.startTimestamp =  this.$moment.unix(vote.start_time).format('YYYY-MM-DD HH:mm');
          this.endTimestamp = this.$moment.unix(vote.end_time).format('YYYY-MM-DD HH:mm');
          this.$store.commit('votes/updateTitle', vote.title)
          this.$store.commit('votes/updateDescription', vote.description)

          for (const i in vote.photos) {
            this.$store.commit('votes/addCandidate')
            this.$store.commit('votes/updatePhoto', {
              index: i,
              id: vote.photos[i].id,
              photo: this.$config.imageUrl + vote.photos[i].photo
            })
            this.$store.commit('votes/updatePhotoTitle', {
              index: i,
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
    leaveVote() {
      this.$router.push('/votes')
    },
    saveDraft() {
      this.status = false
      this.save()
    },
    save() {
      this.$refs.refFormObserver.validate().then((result) => {
        if (result) {
          this.$store.commit('loadingStart')
          const votes = this.$store.state.votes

          if(votes.photos.length < 2){
            this.$toast("至少需要有2名候選人", 'danger')
            return
          }

          for(const photo of votes.photos){
            if(!photo.photo){
              this.$toast("請上傳候選人照片", 'danger')
              return
            }
          }

          const req = {
            id: this.voteID,
            title: votes.title,
            start_time: this.startTimestamp,
            end_time: this.endTimestamp,
            description: votes.description,
            photos: votes.photos,
            status: this.status,
          }

          this.$axios.$post('/api/votes/save', req).then((res) => {
            if (res.code === 200) {
              this.$store.commit('vote/reset')
              this.$store.commit('loadingFinish')
              this.status = true
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
