import { get } from '../http'

export const common = {
  getCommonData: function (data:any) { // {deviceType:194,isShowNum:true,remoteUser:'admin'}获取区域信息
    return get('/xxx', data)
  }
}
