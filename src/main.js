import { createApp } from 'vue'
import App from './App.vue'

import stores from'./stores'
import routes from './routes'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import SwiperClass from 'swiper'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/css'

SwiperClass.use([])

const app = createApp ({
    extends: App,
    beforeCreate (){
        stores.dispatch("checkToken") // 새로고침시 토큰 확인
        console.log("새로고침됨");
    }
}) ;

app.use(routes);
app.use(stores);
app.use(ElementPlus)
app.use(VueAwesomeSwiper)
app.mount('#app');