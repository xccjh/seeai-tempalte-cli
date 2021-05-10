import { Json, AtrFormOpt } from '../base/common'
import { Observable, Subscriber, timer } from 'rxjs'

export class ToolsUtil {
  static ossPrefix = process.env.VUE_APP_OSS_URL;

  static cacheOrgCode = '';

  /**
   * 从问号里拿orgCode，/?qkc#/
   */
  static getOrgCodeFromQuestionMark = () => {
    const hrefs = window.location.href.split('?')
    if (hrefs.length >= 2) {
      const paramStr = hrefs[1]
      // 参数字符串里有没带 =?/#
      let orgCode = paramStr.split('=')[0]
      orgCode = orgCode.split('?')[0]
      orgCode = orgCode.split('/')[0]
      orgCode = orgCode.split('#')[0]
      orgCode = orgCode.split('/')[0]
      return orgCode
    } else {
      return ''
    }
  };

  static getProdId (fn) {
    const codeUid = localStorage.getItem('SCHOLAR_CODEUID_' + this.getOrgCode())
    if (codeUid) {
      fn(codeUid)
    } else {
      timer(100).subscribe(() => {
        this.getProdId(fn)
      })
    }
  }

  static async getProdIdSync () {
    return new Promise((resolve) => {
      this.getProdId((proId) => {
        resolve(proId)
      })
    })
  }

  static createCacheKey (prefix: string) {
    return `SCHOLARST_${prefix}_${ToolsUtil.getOrgCode()}`
  }

  static getTwoWords (str) {
    if (str && str.replace(/[\u4e00-\u9fa5]/g, 'aa').length > 60) {
      return str.substring(0, 50) + '...'
    } else {
      return str || '--'
    }
  }

  static getMaxSeq (arr) {
    if (!arr) {
      return 0
    }
    let max = 0
    arr.forEach(item => {
      if (item.seq > max) {
        max = item.seq
      }
    })
    return max + 1
  }

  static watchTool = (watchObj = {}, watchKey = 'flag', initState = false, callback = (val) => val) => {
    let watchFlag = initState
    Object.defineProperty(watchObj, watchKey, {
      get () {
        return watchFlag
      },
      set (val) {
        watchFlag = val
        callback(val)
      }
    })
  };

  static getAjax = (url, data?) => {
    return new Observable<any>((observer: Subscriber<any>) => {
      // XMLHttpRequest对象用于在后台与服务器交换数据
      const xhr = new XMLHttpRequest()
      xhr.onreadystatechange = () => {
        // readyState == 4说明请求已完成
        if (xhr.readyState === 4) {
          if (xhr.status === 200 || xhr.status === 304) {
            // 从服务器获得数据
            observer.next(xhr.responseText)
            observer.complete()
            // observer.unsubscribe();
          } else {
            observer.next('题库服务异常')
            observer.complete()
            // observer.unsubscribe();
          }
        }
      }
      let urls = url
      if (data) {
        urls += '?' + queryParam(data)
      }
      xhr.open('GET', urls, true)
      xhr.send()
    })
  };

  static postAjax = (url, data, contentType = { 'Content-Type': 'application/x-www-form-urlencoded' }) => {
    return new Observable<any>((observer: Subscriber<any>) => {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', url, true)
      // 添加http头，发送信息至服务器时内容编码类型
      contentType = { ...{ 'Content-Type': 'application/x--form-urlencoded' }, ...contentType }
      Object.keys(contentType).forEach(item => {
        xhr.setRequestHeader(item, contentType[item])
      })
      let params
      if (contentType['Content-Type'] !== 'application/x-www-form-urlencoded') {
        params = JSON.stringify(data)
      } else {
        params = queryParam(data)
      }
      xhr.send(params)
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200 || xhr.status === 304) {
            observer.next(xhr.responseText)
            observer.complete()
            observer.unsubscribe()
          } else {
            observer.next('题库服务异常')
            observer.complete()
            observer.unsubscribe()
          }
        }
      }
    })
  };

  /**
   * 从子域名拿orgCode， qkc.xxxx.com
   */
  static getOrgCodeFromSubDN = () => {
    return location.host.split('.')[0]
  };

  static getOrgCode = () => {
    if (ToolsUtil.cacheOrgCode !== '') {
      return ToolsUtil.cacheOrgCode
    }

    if ((window as any).__WHO__ && (window as any).__WHO__ === 'sys') {
      ToolsUtil.cacheOrgCode = 'cjsd'
    } else {
      const org = ToolsUtil.getOrgCodeFromQuestionMark()
      if (org === '') {
        // ToolsUtil.cacheOrgCode = ToolsUtil.getOrgCodeFromSubDN();
        // if (org === '') {
        ToolsUtil.cacheOrgCode = 'cjsd'
        // }
      } else {
        ToolsUtil.cacheOrgCode = org
      }
    }
    return ToolsUtil.cacheOrgCode
  };

  static getOssUrl (url: string) {
    if (!url) {
      return ''
    }
    if (url.startsWith('http')) {
      return url
    }
    if (!url.startsWith('/')) {
      url = '/' + url
    }
    return this.ossPrefix + url
  }

  static getRandomFileName () {
    const timestimp = new Date().getTime().toString()
    const expect = 16
    let str = Math.random().toString(36).substring(2)
    while (str.length < expect) {
      str += Math.random().toString(36).substring(2)
    }
    return str.substring(0, expect) + timestimp
  }

  static getFileExt (fileName) {
    if (!fileName) {
      return ''
    }
    const index = fileName.lastIndexOf('.')
    const suffix = fileName.substr(index + 1)
    return suffix
  }

  static getFileName (fileName) {
    if (!fileName) {
      return ''
    }
    const index = fileName.lastIndexOf('/')
    const suffix = fileName.substr(index + 1)
    return suffix
  }

  static getHttpOptions (): any {
    return { isCommonHttpHeader: true }
  }

  static resetFormValue (opt: AtrFormOpt, json: Json): AtrFormOpt {
    for (const item of opt.items) {
      item.value = ''
      for (const key of Object.keys(json)) {
        if (Object.prototype.hasOwnProperty.call(json, key) && json[key] != null && json[key] !== undefined && key === item.key) {
          if (item.type === 'date') {
            item.value = new Date(json[key])
          } else if (item.type === 'dateTime') {
            item.value = new Date(json[key])
          } else {
            item.value = json[key]
          }
        }
      }
    }
    return opt
  }

  static getFormatDate (date: Date): string {
    const localTime = date.getTime() // 本地时间距 1970 年 1 月 1 日午夜（GMT 时间）之间的毫秒数
    const localOffset = date.getTimezoneOffset() * 60000 // 格林威治时间和本地时间之间的时差,单位分
    const utcTime = localTime + localOffset // 已知本地时间，换算对应格林威治时间
    const curTime = utcTime + (3600000 * 8) // 换算东八区时间
    date.setTime(curTime)

    let month: string | number = date.getMonth() + 1
    let strDate: string | number = date.getDate()

    if (month <= 9) {
      month = '0' + month
    }

    if (strDate <= 9) {
      strDate = '0' + strDate
    }
    return date.toLocaleTimeString()
  }

  static getExt (name: string): string {
    if (!name || typeof (name) !== 'string') {
      return ''
    }

    let suffix = ''
    try {
      const flieArr = name.split('.')
      suffix = flieArr[flieArr.length - 1]
    } catch (err) {
      suffix = ''
    }
    return suffix.toLocaleLowerCase()
  }

  static isMP3 (ext: string) {
    return /mp3/.test(ext)
  }

  // 判断文件类型
  static getFileType (fileName): any {
    // 获取类型结果
    let result: any = ''
    const suffix = this.getExt(fileName)
    // fileName无后缀返回 false
    if (!suffix) {
      return false
    }

    // 图片格式
    const imglist = ['png', 'jpg', 'jpeg', 'bmp', 'gif']
    // 进行图片匹配
    result = imglist.find(item => item === suffix)
    if (result) {
      return 'image'
    }
    // 匹配txt
    const txtlist = ['txt']
    result = txtlist.find(item => item === suffix)
    if (result) {
      return 'txt'
    }
    // 匹配 excel
    const excelist = ['xls', 'xlsx']
    result = excelist.find(item => item === suffix)
    if (result) {
      return 'excel'
    }
    // 匹配 word
    const wordlist = ['doc', 'docx']
    result = wordlist.find(item => item === suffix)
    if (result) {
      return 'word'
    }
    // 匹配 pdf
    const pdflist = ['pdf']
    result = pdflist.find(item => item === suffix)
    if (result) {
      return 'pdf'
    }
    // 匹配 ppt
    const pptlist = ['ppt', 'pptx']
    result = pptlist.find(item => item === suffix)
    if (result) {
      return 'ppt'
    }
    // 匹配 视频
    const videolist = ['mp4', 'm2v', 'mkv', 'rmvb', 'wmv', 'avi', 'flv', 'mov', 'm4v']
    result = videolist.find(item => item === suffix)
    if (result) {
      return 'video'
    }
    // 匹配 音频
    const radiolist = ['mp3', 'wav', 'wmv']
    result = radiolist.find(item => item === suffix)
    if (result) {
      return 'radio'
    }
    // 其他 文件类型
    return 'other'
  }

  static isPicture (path: string) {
    const suffix = this.getExt(path)
    return /(jpg|jpeg|png)$/.test(suffix)
  }

  static isDoc (path: string) {
    const suffix = this.getExt(path)
    return /(doc|docx)$/.test(suffix)
  }

  static isExl (path: string) {
    const suffix = this.getExt(path)
    return /(xls|xlsx)$/.test(suffix)
  }

  static isPPT (path: string) {
    const suffix = this.getExt(path)
    return /(ppt|pptx)$/.test(suffix)
  }

  static isPdf (path: string) {
    const suffix = this.getExt(path)
    return /pdf$/.test(suffix)
  }

  static isVideo (ext: string) {
    const suffix = this.getExt(ext)
    return /mp4|m2v|mkv|rmvb|wmv|avi|flv|mov/.test(suffix)
  }

  static getThumbUrl (path: string) {
    if (!path) {
      return ''
    }
    // 后缀获取
    const suffix = this.getExt(path)
    if (this.isPicture(suffix)) {
      return process.env.VUE_OSS_URL + path
    } else if (this.isDoc(suffix)) {
      return process.env.VUE_OSS_URL + '/common/doc.png'
    } else if (this.isExl(suffix)) {
      return process.env.VUE_OSS_URL + '/common/excel.png'
    } else if (this.isPPT(suffix)) {
      return process.env.VUE_OSS_URL + '/common/ppt.png'
    } else if (this.isPdf(suffix)) {
      return process.env.VUE_OSS_URL + '/common/pdf.png'
    } else if (this.isVideo(suffix)) {
      return process.env.VUE_OSS_URL + '/common/video.png'
    } else {
      return ''
    }
  }

  // 合并排序
  static compare (prop) {
    return (obj1, obj2) => {
      const val1 = obj1[prop]
      const val2 = obj2[prop]
      if (val1 < val2) {
        return -1
      } else if (val1 > val2) {
        return 1
      } else {
        return 0
      }
    }
  }

  // 下载文件
  static downLoadFile (url) {
    if (!url) {
      return console.log('无效连接')
    }
    const ele = document.createElement('iframe') as HTMLIFrameElement
    ele.src = url
    ele.width = '0px'
    ele.height = '0px'
    ele.style.display = 'none'
    document.body.appendChild(ele)
  }
}

export const parseToObject = (queryString) => {
  // 使用 & 符号将查询字符串分割开
  const parts = queryString.split('&')
  // 遍历所有的 "key=value" 字符串结构
  const obj = {}
  for (let i = 0, len = parts.length; i < len; i++) {
    // 使用 = 将 "key=value" 字符串分割开
    const arr = parts[i].split('=')
    // = 号前的内容是对象的属性名，= 号后的内容是对应属性的值
    const name = arr.shift()
    const value = arr.join('=')
    // 将属性添加到对象中
    obj[name] = value
  }
  // 返回创建好的对象
  return obj
}

export const cleanArray = (actual: any[]): any[] => {
  const newArray :any[] = []
  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

export const queryParam = (json?: Json): string => {
  if (!json) {
    return ''
  }
  return cleanArray(Object.keys(json).map(key => {
    if (json[key] === undefined) {
      return ''
    }
    return encodeURIComponent(key) + '=' +
      encodeURIComponent(json[key])
  })).join('&')
}
