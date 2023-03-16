import { createWebHistory, createRouter } from "vue-router";

import MainPage from '@/components/MainPage.vue';
import IntroPage from '@/components/IntroPage.vue';
import CSPage from '@/components/CSPage.vue';
import LoginPage from '@/components/LoginPage.vue';
import LogoutPage from '@/components/LogoutPage.vue';
import JoinPage from '@/components/JoinPage.vue';
import MyPage from '@/components/MyPage.vue';
import RegionalPage from '@/components/RegionalPage.vue';
import BakeryPage from '@/components/BakeryPage.vue';

import store from "../stores";
// import { reactive, computed } from 'vue';

// 로그인 한 회원은 접근 못하도록------------>새고로침문제부터...
const rejectAuthUser = (to, from, next) => {
    if(store.state.isLogin) {
        alert('이미 로그인 되었습니다.');
        next("/");
    } else {
        next();
    }
}

// 로그인 안한 회원은 접근 못하도록
// const onlyAuthUser = (to, from, next) => {
//     if(!store.state.isLogin) {
//         alert('로그인이 필요한 페이지입니다.');
//         next("/login");
//     } else {
//         next();
//     }
// }

const checkToken = (to, from, next) => {
    store.dispatch("checkToken") 
    next();
}

const routes = [
    {path : '/', component : MainPage },
    {path : '/intro', component : IntroPage },
    {path : '/CS', component : CSPage },
    {path : '/login', component : LoginPage, beforeEnter: rejectAuthUser},
    {path : '/logout', component : LogoutPage},
    {path : '/join', component : JoinPage, beforeEnter: rejectAuthUser},
    {path : '/mypage', component : MyPage, beforeEnter: checkToken},
    {path : '/regional', component : RegionalPage },
    {path : '/bakery', component : BakeryPage },
]

const router = createRouter({
    history: createWebHistory(),
    routes : routes
});




// 특정 페이지로 이동시 vuex의 action을 불러서 토큰 확인
// router.beforeEach((to, from, next) => {
//     const state = reactive({
//         isLogin : computed(() => store.getters.getLogin)
//     });
//     console.log("이즈로그인",  state.isLogin);

//     if(state.isLogin) {    
//         store.dispatch("checkToken");
//         next();
//     } else {
//         next();
//     }
// })




export default router;