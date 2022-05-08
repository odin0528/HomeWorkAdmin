import { isObject } from '~/@core/utils/utils'

/**
 * Return which component to render based on it's data/context
 * @param {Object} item nav menu item
 */
export const resolveVerticalNavMenuItemComponent = item => {
  if (item.header) return 'layouts-nav-menu-header'
  if (item.children) return 'layouts-nav-menu-group'
  return 'layouts-nav-menu-link'
}

/**
 * Return which component to render based on it's data/context
 * @param {Object} item nav menu item
 */
export const resolveHorizontalNavMenuItemComponent = item => {
  if (item.children) return 'horizontal-nav-menu-group'
  return 'horizontal-nav-menu-link'
}

/**
 * Return route name for navigation link
 * If link is string then it will assume it is route-name
 * IF link is object it will resolve the object and will return the link
 * @param {Object, String} link navigation link object/string
 */
export const resolveNavDataRouteName = link => {
  if (isObject(link.route)) {
    const { route } = this.$router.resolve(link.route)
    return route.name
  }
  return link.route
}

/**
 * Check if nav-link is active
 * @param {Object} link nav-link object
 */
export const isNavLinkActive = link => {
  // Matched routes array of current route
  const matchedRoutes = this.$router.currentRoute.matched

  // Check if provided route matches route's matched route
  const resolveRoutedName = resolveNavDataRouteName(link)

  if (!resolveRoutedName) return false

  return matchedRoutes.some(route => route.name === resolveRoutedName || route.meta.navActiveLink === resolveRoutedName)
}

/**
 * Check if nav group is
 * @param {Array} children Group children
 */
export const isNavGroupActive = children => {
  // Matched routes array of current route
  const matchedRoutes = this.$router.currentRoute.matched

  return children.some(child => {
    // If child have children => It's group => Go deeper(recursive)
    if (child.children) {
      return isNavGroupActive(child.children)
    }

    // else it's link => Check for matched Route
    return isNavLinkActive(child, matchedRoutes)
  })
}