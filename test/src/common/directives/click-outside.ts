/**
 * @desc 点击元素外面才会触发的事件
 * @example
 * ```vue
 * <div v-click-outside="handleClick">
 * ```
 */

function directive (e, el, binding) {
  if (!e) return

  if (('isTrusted' in e && !e.isTrusted) ||
    ('pointerType' in e && !e.pointerType)
  ) return

  !clickedInEls(e, el) && setTimeout(() => {
    binding.value(e)
  }, 0)
}

function clickedInEls (e, el) {
  const { clientX: x, clientY: y } = e
  return !!clickedInEl(el, x, y)
}

function clickedInEl (el, x, y) {
  const b = el.getBoundingClientRect()

  return x >= b.left && x <= b.right && y >= b.top && y <= b.bottom
}

export default {
  name: 'click-outside',
  inserted: (el, binding, vnode) => {
    const onClick = (e) => directive(e, el, binding)

    const app = document.body

    app.addEventListener('click', onClick, true)
    el._clickOutside = onClick
  },
  unbind: (el, binding, vnode) => {
    if (!el._clickOutside) return

    const app = document.body
    app && app.removeEventListener('click', el._clickOutside, true)
    delete el._clickOutside
  }
}
