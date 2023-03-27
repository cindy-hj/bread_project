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
import ReviewPage from '@/components/ReviewPage.vue';

import store from "../stores";
import { computed } from 'vue';

// 로그인 안한 회원은 접근 못하도록
const onlyAuthUser = async(to, from, next) => {
    await store.dispatch("checkToken")
    const isLogin = computed(() => store.getters.getLogin)
    console.log("네비가드 로그인",  isLogin.value);

    if(!isLogin.value) {
        alert('로그인이 필요한 페이지입니다.');
        next("/login");
    } else {
        next();
    }
}


// 로그인 한 회원은 접근 못하도록
// const rejectAuthUser = (to, from, next) => {
//     const logged = store.getters.getLogin;
//     if(logged) { 
//         const path = sessionStorage.getItem("CURRENT_PATH");
//         const query = JSON.parse(sessionStorage.getItem("QUERY"));
//         alert('잘못된 접근입니다.')
//         next({path:path, query:query}); 
//         return; 
//     }
//     next();
// }


const routes = [
    {path : '/', component : MainPage },
    {path : '/intro', component : IntroPage },
    {path : '/CS', component : CSPage },
    {path : '/login', component : LoginPage, /*beforeEnter: rejectAuthUser*/},
    {path : '/logout', component : LogoutPage},
    {path : '/join', component : JoinPage, /*beforeEnter: rejectAuthUser*/},
    {path : '/mypage', component : MyPage, beforeEnter: onlyAuthUser},
    {path : '/regional', component : RegionalPage },
    {path : '/select', component : BakeryPage },
    {path : '/review', component : ReviewPage, beforeEnter: onlyAuthUser},
]

const router = createRouter({
    history: createWebHistory(),
    routes : routes
});


// 로그인 후 원래 가려던 페이지로 이동 
router.beforeEach((to, from, next)=>{
    if(to.path !== '/login' && to.path !== '/logout') {
        sessionStorage.setItem("CURRENT_PATH", to.path);
        sessionStorage.setItem("QUERY", JSON.stringify(to.query));
    }
    next();
});

export default router;