import { createApp } from 'vue'
import App from './App.vue'
import '../style/index.scss'
import { Antd } from './assets/plugins'
import './registerServiceWorker'
import router from './app/router'
import store from './app/store'
import CommonPart from './common'

const app = createApp(App).use(store).use(router).use(CommonPart).use(Antd)
app.mount('#app')
