import * as Components from './components'
import * as Directives from './directives'
// import { NormalMenu } from './services';

export default {
  install: (app:any) => {
    for (const [name, Component] of Object.entries(Components)) {
      app.component(Component.name || name, Component)
    }

    for (const [name, Directive] of Object.entries(Directives)) {
      app.directive(Directive.name || name, Directive)
    }

    // app.config.globalProperties.$menu = new NormalMenu();
    app.config.globalProperties.globalData = 'test-global-data'
  }
}
