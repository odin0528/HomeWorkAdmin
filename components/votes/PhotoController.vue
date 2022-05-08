<template>
  <b-row class="mb-3">
    <b-col cols="2">
      {{ $t('vote_photo') }}
    </b-col>
    <div class="col-10 pl-3 products-photo-list">
      <votes-photo-items
        v-for="(photo, key) in photos"
        :id="photo.id"
        :key="key"
        :index="key"
        :photo="photo.photo"
        :title="photo.title"
        @pickupPhoto="pickupPhoto"
        @updatePhotoTitle="updatePhotoTitle"
      />
      <div>
        <div
          class="product_photo_uploader cousor-pointer"
        >
          <div
            class="pickup_photo"
            @click="$store.commit('votes/addCandidate')"
          >
            增加候選人
          </div>
        </div>
      </div>
    </div>
  </b-row>
</template>

<script>
export default {
  computed: {
    photos: {
      get() {
        return this.$store.state.votes.photos
      },
    },
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
  },
}
</script>
