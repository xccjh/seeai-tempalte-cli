import './normal-menu.scss'

export class NormalMenu {
  menuData = null;

  constructor () {
    console.log('init')
  }

  // 调用方法显示菜单
  initMenu (event, menu) {
    console.log('initMenu', event, menu)
  }

  // 生成器
  createMenuItems () {
    console.log('createMenuItems')
  }

  // 调整边缘位置
  revisePosition () {
    console.log('revisePosition')
  }

  removeMenu (menu) {
    console.log('removeMenu', menu)
  }
}
