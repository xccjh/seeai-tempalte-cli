/**
 * @desc 指定元素滚动事件监听
 * @example
 * ```vue
 * <div v-scroll:#scroll-target="handleScroll">
 * ```
 */

export default {
  name: 'scroll',
  inserted: (el, binding) => {
    const callback = binding.value
    const options = binding.options || { passive: true }
    const target = binding.arg ? document.querySelector(binding.arg) : window

    if (!target) return

    target.addEventListener('scroll', callback, options)

    el._onScroll = {
      callback,
      options,
      target
    }
  },
  unbind: (el) => {
    if (!el._onScroll) return
    const { callback, options, target } = el._onScroll
    target.removeEventListener('scroll', callback, options)
    delete el._onScroll
  }
}
