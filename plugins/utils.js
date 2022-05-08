export const validUploadImage = (img, limitSize) => {
  console.log(img)
  let result = true
  if (img.size > limitSize * 1024) {
    result = 'upload_size_limit'
  }

  switch (img.type) {
    case 'image/jpeg':
    case 'image/jpe':
    case 'image/png':
      break
    default:
      result = 'upload_type_wrong'
  }

  return result
}

const utils = {
  name: 'utils',
  linkProps(item) {
    const props = {}

    if (item.link_type === 4) {
      props.href = item.link
      props.target = '_blank'
    } else {
      switch (item.link_type) {
        case 1:
          props.to = `/${item.link}`
          break
        case 2:
          props.to = `/categories/${item.link}`
          break
        case 3:
          props.to = `/products/${item.link}`
          break
      }
    }
    props.rel = 'nofollow'

    return props
  }
}

export default ({ app }, inject) => {
  inject('utils', utils)
}
