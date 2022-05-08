export default function ({ $axios, redirect, $cookies, app, store }) {
  // console.log(i18n._vm.$t(90001))

  $axios.onRequest((req) => {
    store.commit('loadingStart')
    if ($cookies.get('gz_admin') && $cookies.get('gz_admin').token)
      $axios.setToken($cookies.get('gz_admin').token)
  })

  $axios.onResponse((res) => {
    store.commit('loadingFinish')
    if (res.data.code === 401) {
      $cookies.remove('gz_admin')
      redirect('/login')
    } else if (res.data.code === 500) {
      app.$toast(res.data.data || 'something is wrong', 'danger')
    }
  })

  $axios.onError((res) => {
    store.commit('loadingFinish')
    app.$toast('something is wrong', 'danger')
    // redirect('/400')
  })
}
