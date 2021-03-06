export const state = () => ({
  title: '',
  description: '',
  photos: [],
})

export const mutations = {
  updateTitle(state, value) {
    state.title = value
  },
  updateDescription(state, value) {
    state.description = value
  },
  updatePhoto(state, obj) {
    state.photos[obj.index].id = obj.id
    state.photos[obj.index].photo = obj.photo
  },
  updatePhotoTitle(state, obj) {
    state.photos[obj.index].title = obj.title
  },
  deletePhoto(state, index){
    state.photos.splice(index, 1)
  },
  addCandidate(state){
    state.photos.push({ id: 0, photo: '' });
  },
  reset(state) {
    state.title = ''
    state.description = ''
    state.photos = []
  }
}

export const actions = {
  styleEnable({ commit }) {
    commit('enableStyle')
    commit('addStyleItem')
  },

  subStyleEnable({ commit }) {
    commit('enableSubStyle')
    commit('addSubStyleItem')
  },
}

export const getters = {
  fetch(state) {
    return state.style.list
  }
}
