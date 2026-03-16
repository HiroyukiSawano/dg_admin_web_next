import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/display.css'
import 'remixicon/fonts/remixicon.css'
import './styles/index.scss'


import store from './stores'
import i18n from './locales'
import global from './global'
const app = createApp(App)
app.use(store)
app.use(ElementPlus)
app.use(router)
app.use(i18n)
app.use(global)
app.mount('#app')
