export default ({ app }, inject) => {
  inject('toast', (msg, variant) => {
    window.$nuxt.$bvToast.toast(msg, {
      title: `提示訊息`,
      toaster: 'b-toaster-bottom-right',
      appendToast: true,
      variant: variant || 'success',
      solid: true,
    })
  })
}
