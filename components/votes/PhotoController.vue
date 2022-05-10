<template>
  <b-row class="mb-3">
    <b-col cols="2">
      {{ $t('vote_photo') }}
    </b-col>
    <div class="col-10 pl-3 products-photo-list">
      <photo-items
        v-for="(photo, key) in photos"
        :id="photo.id"
        :key="key"
        :index="key"
        :photo="photo.photo"
        :title="photo.title"
        @pickupPhoto="pickupPhoto"
        @updatePhotoTitle="updatePhotoTitle"
        @deletePhoto="deletePhoto"
      />
      <div>
        <div
          class="product_photo_uploader cousor-pointer"
        >
          <div
            class="add-candidate"
            @click="$store.commit('votes/addCandidate')"
          >
            <div><b-icon icon="plus-square" scale="3" /></div>
            <div class="mt-4">增加候選人</div>
          </div>
        </div>
      </div>
    </div>
  </b-row>
</template>

<script>
import { withValidation } from 'vee-validate'
import PhotoItems from '~/components/votes/PhotoItems'
export default {
  components: {
    PhotoItems: withValidation(PhotoItems)
  },
  computed: {
    photos: {
      get() {
        return this.$store.state.votes.photos
      },
    },
  },
  created() {
    this.$validator = this.$parent.$validator
  },
  methods: {
    pickupPhoto(index, id, photo) {
      this.$store.commit('votes/updatePhoto', {
        index,
        id,
        photo,
      })
    },
    updatePhotoTitle(index, id, title) {
      this.$store.commit('votes/updatePhotoTitle', {
        index,
        id,
        title,
      })
    },
    deletePhoto(index){
      this.$store.commit('votes/deletePhoto',  index)
    }
  },
}
</script>
<style lang="scss">
.add-candidate{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>