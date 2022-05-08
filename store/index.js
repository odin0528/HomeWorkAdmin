export const state = () => ({
  isLoading: false,
  untreatedOrder: 0,
  pageList: []
})

export const mutations = {
  loadingStart(state) {
    state.isLoading = true
  },

  loadingFinish(state) {
    state.isLoading = false
  },

  updateUntreatedOrder(state, count) {
    state.untreatedOrder = count
  },

  updatePage(state, pageList) {
    state.pageList = pageList
  }
}

export const actions = {
  fetchPage({ state, commit }) {
    if (state.pageList.length === 0) {
      this.$axios.$get('/api/pages').then((res) => {
        commit('updatePage', res.data)
      })
    }
  },
  async fetchProductList({ state, commit }, page) {
    const products = await this.$axios.$post('/api/products', {
      page,
      items: 20
    })
    return products
  },
  async fetchProduct({ state, commit }, productID) {
    const product = await this.$axios.$get(`/api/products/${productID}`)
    return product
  },
  async fetchMenu() {
    return await this.$axios.$get(`/api/menus`)
  }
}

export const getters = {}
