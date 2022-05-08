const config = {
  name: 'config',
  returnCode: {
    success: 200,
    invalidParams: 400,
    unauthorized: 401,
    forbidden: 403,
    statusNotFound: 404,
    error: 500,

    // auth
    resetRedirect: 10001,
    accountNotExist: 90001,
  },
  paymentList: [
    { value: 0, text: '選擇付款方式' },
    { value: 1, text: '轉帳匯款' },
    { value: 2, text: '貨到付款' },
    { value: 3, text: '信用卡' },
    { value: 4, text: 'LINE Pay' },
    { value: 5, text: 'ATM' },
    { value: 6, text: '超商代碼' },
    { value: 7, text: '超商條碼' },
  ],
  logisticsList: [
    { value: 0, text: '選擇運送方式' },
    { value: 1, text: '宅配' },
    { value: 2, text: '超商取貨-711' },
    { value: 3, text: '超商取貨-全家' },
    { value: 4, text: '超商取貨-萊爾富' },
    { value: 5, text: '超商取貨-OK Mart' },
  ],
}

export default ({ app }, inject) => {
  inject('config', config)
}
