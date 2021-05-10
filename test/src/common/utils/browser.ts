// 判断是否为ie浏览器
export function browserIsIE () {
  if (!!window.ActiveXObject || 'ActiveXObject' in window) {
    return true
  } else {
    return false
  }
}
