import { createApp } from 'vue'
import App from './App.vue'

// import Vue from 'vue'
// import VueCookies from 'vue-cookies'

// Vue.use(VueCookies)

import stores from'./stores'
import routes from './routes';

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(
    App,
    stores.dispatch("checkToken") // 새로고침시 토큰 확인
) ;

app.use(routes);
app.use(stores);
app.use(ElementPlus)
app.mount('#app');