export const isObject = (obj) => typeof obj === 'object' && obj !== null

export const isToday = (date) => {
  const today = new Date()
  return (
    /* eslint-disable operator-linebreak */
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
    /* eslint-enable */
  )
}

const getRandomFromArray = (array) =>
  array[Math.floor(Math.random() * array.length)]

// ? Light and Dark variant is not included
// prettier-ignore
export const getRandomBsVariant = () => getRandomFromArray(['primary', 'secondary', 'success', 'warning', 'danger', 'info'])

export const isDynamicRouteActive = (route) => {
  const { route: resolvedRoute } = this.$router.resolve(route)
  return resolvedRoute.path === this.$router.currentRoute.path
}

export const calcmaxHeight = (block) => {
  const blockStyles = window.getComputedStyle(block)
  const blockLineHeight = Number(blockStyles.lineHeight.split('px')[0])
  return blockLineHeight
}

export const calculateHeight = (img, proportional) => {
  const styles = window.getComputedStyle(img)
  const width = Number(styles.width.split('px')[0])
  const w = proportional.split(':')[0]
  const h = proportional.split(':')[1]
  return width * (h / w)
}

export const getHeight = (img) => {
  const styles = window.getComputedStyle(img)
  const height = Number(styles.height.split('px')[0])
  return height
}
