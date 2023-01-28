import { createWebHistory, createRouter } from "vue-router";

import MainPage from '@/components/MainPage.vue';
import IntroPage from '@/components/IntroPage.vue';
import CSPage from '@/components/CSPage.vue';
import LoginPage from '@/components/LoginPage.vue';
import JoinPage from '@/components/JoinPage.vue';
import MyPage from '@/components/MyPage.vue';
import RegionalPage from '@/components/RegionalPage.vue';
import BakeryPage from '@/components/BakeryPage.vue';


const routes = [
    {path : '/', component : MainPage },
    {path : '/intro', component : IntroPage },
    {path : '/CS', component : CSPage },
    {path : '/login', component : LoginPage },
    {path : '/join', component : JoinPage },
    {path : '/mypage', component : MyPage },
    {path : '/regional', component : RegionalPage },
    {path : '/bakery', component : BakeryPage },
]


const router = createRouter({
    history: createWebHistory(),
    routes : routes
});

export default router;