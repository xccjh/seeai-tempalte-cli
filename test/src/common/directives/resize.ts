/**
 * @desc 元素大小变动
 * @example
 * ```vue
 * <div v-resize="handleResize">
 * ```
 */

import ResizeObserver from 'resize-observer-polyfill'
import { Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

export default {
  name: 'resize',
  inserted: (el, binding) => {
    if (!(typeof binding.value === 'function')) return
    const subject = new Subject()

    el._resize = new ResizeObserver(handleResize)
    el._resize.observe(el)

    el._resizeSubscription = subject.pipe(
      debounceTime(50)
    ).subscribe(() => {
      binding.value()
    })

    function handleResize () {
      subject.next(true)
    }
  },
  unbind: (el) => {
    el._resize.disconnect()
    el._resizeSubscription.unsubscribe()
  }
}
