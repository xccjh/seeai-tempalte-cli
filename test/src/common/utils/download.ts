export function download (template, filename = '未命名', fileType) {
  let blob
  if (template instanceof Blob) {
    blob = template
  } else {
    blob = new Blob([template], { type: fileType })
  }
  let link: any = document.createElement('a')
  link.download = filename
  link.href = URL.createObjectURL(blob)
  link.click()
  link = null
}
