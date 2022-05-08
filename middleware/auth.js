export default function ({ route, app, redirect }) {
  const name = route.name.split('___')[0]
  if (name !== 'login' && name !== 'reset-token' && name !== '400') {
    if (!app.$cookies.get('gz_admin')) redirect('/login')
    else app.$axios.setToken(app.$cookies.get('gz_admin'))
  }
}
