const returnCode = {
  name: 'returnCode',
  success: 200,
  invalidParams: 400,
  unauthorized: 401,
  forbidden: 403,
  statusNotFound: 404,
  error: 500,

  // auth
  resetRedirect: 10001,
  accountNotExist: 90001,
}

export default ({ app }, inject) => {
  inject('returnCode', returnCode)
}
