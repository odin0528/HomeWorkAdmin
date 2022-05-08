import { extend, localize } from 'vee-validate'
import {
  required as ruleRequired,
  email as ruleEmail,
  min as ruleMin,
  confirmed as ruleConfirmed,
  regex as ruleRegex,
  between as ruleBetween,
  alpha as ruleAlpha,
  integer as ruleInteger,
  digits as ruleDigits,
  alpha_dash as ruleAlphaDash,
  alpha_num as ruleAlphaNum,
  length as ruleLength,
  required_if as ruleRequiredIf,
  numeric as ruleNumeric,
} from 'vee-validate/dist/rules'
import zhTW from 'vee-validate/dist/locale/zh_TW.json'

// eslint-disable-next-line object-curly-newline
import {
  validatorPositive,
  validatorUrlValidator,
  validatorPassword,
  validatorCreditCard,
} from './validators'

// ////////////////////////////////////////////////////////
// General
// ////////////////////////////////////////////////////////

export const required = extend('required', ruleRequired)

export const requiredIf = extend('requiredIf', ruleRequiredIf)

export const email = extend('email', ruleEmail)

export const min = extend('min', ruleMin)

export const confirmed = extend('confirmed', ruleConfirmed)

export const regex = extend('regex', ruleRegex)

export const between = extend('between', ruleBetween)

export const alpha = extend('alpha', ruleAlpha)

export const integer = extend('integer', ruleInteger)

export const digits = extend('digits', ruleDigits)

export const alphaDash = extend('alphaDash', ruleAlphaDash)

export const alphaNum = extend('alpha-num', ruleAlphaNum)

export const numeric = extend('numeric', ruleNumeric)

export const length = extend('length', ruleLength)

export const positive = extend('positive', {
  validate: validatorPositive,
  message: 'Please enter positive number!',
})

export const credit = extend('credit-card', {
  validate: validatorCreditCard,
  message: 'It is not valid credit card!',
})

export const password = extend('password', {
  validate: validatorPassword,
})

export const url = extend('url', {
  validate: validatorUrlValidator,
  message: 'URL is invalid',
})

// Install English and Arabic localizations.
localize({
  zhTW: {
    messages: {
      requiredIf: '{_field_} 為必填',
      alphaDash: '{_field_} 只能輸入英文、數字、破折號或下底線',
      password: '密碼必須至少包含一個大寫文字、一個小寫文字與一個數字',
      ...zhTW.messages,
    },
  },
})
// ////////////////////////////////////////////////////////
// NOTE:
// Quasar validation for reference only
// Remove this note once development is finished and make sure to
// to convert all of them in veevalidate version
// ////////////////////////////////////////////////////////

// export const required = (val) => {
//   return (val && val.length > 0) || '*Field is required'
// }

// export const required_obj = (obj) => {
//   if (obj === null || obj === undefined) return '*Field is required'
//   return (Object.entries(obj).length > 0 && obj.constructor === Object) || '*Field is required'
// }

// export const noBlank_spacesArr = (arr) => {
//   return arr.every(val => (val.trim() && val.trim().length > 0)) || 'Blank Spaces are not allowed'
// }

// export const url = val => {
//   // If blank return
//   if (val === undefined || val === null || val.length === 0) return true

//   // Used
//   // https://stackoverflow.com/questions/4314741/url-regex-validation

//   // Other
//   // https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
//   // https://www.w3resource.com/javascript-exercises/javascript-regexp-exercise-9.php
//   // https://www.geeksforgeeks.org/how-to-validate-url-using-regular-expression-in-javascript/

//   /* eslint-disable no-useless-escape */
//   const re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/
//   /* eslint-enable no-useless-escape */
//   return re.test(val) || 'URL is invalid'
// }

// export const date = val => {

//   // If blank return
//   if (val === undefined || val === null || val.length === 0) return true

//   // https://github.com/quasarframework/quasar/blob/dev/ui/src/utils/patterns.js
//   return /^-?[\d]+\/[0-1]\d\/[0-3]\d$/.test(val) || 'Date is invalid'
// }

// export const max = (val, max) => {

//   // If blank return
//   if (val === undefined || val === null) return true

//   return val.length <= max || `More than ${max} characters are not allowed`
// }

// export const maxArr = (val, max) => {
//   return val.length <= max || `More than ${max} values are not allowed`
// }

// export const min = (val, min) => {

//   // If blank return
//   if (val === undefined || val === null || val.length === 0) return true

//   return val.length >= min || `Minimum ${min} characters are required`
// }

// export const numRange = (val, min, max) => {

//   // If blank return
//   if (val === undefined || val === null || val.length === 0) return true

//   const msg = 'Value is invalid'
//   if (min === null) return val <= max || msg
//   else if (max === null) return val >= min || msg
//   else return (val >= min && val <= max) || msg
// }
