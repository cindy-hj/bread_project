import { createStore } from 'vuex';
// const authJwt = require('../../exp_bread_project/routes/jwt_auth')
import axios from "axios";

const stores = createStore({
    state: {
        isLogin : false,
        user : null,
        accessToken : null,
    },   
    //     () {
    //     let tmp = false; // 기본값은 로그아웃
    //     // 새로고침시 로그인 상태 유지
    //     // if(authJwt.result.loginSuccess) {
    //     //     tmp = true;
    //     // }
    //     return {
    //         isLogin : tmp,
    //     }
    // },

    // 다른 컴포넌트에서 사용
    getters: {
        getLogin(state) {
            return state.isLogin;
        },
    },

    // state의 값 변경시킴
    mutations: {
        setLogin(state, isLogin) {
            state.isLogin = isLogin;
        },

        setUser(state, user) {
            state.user = user;
        },

        setAccessToken(state, accessToken) {
            state.accessToken = accessToken;
        }
    },
    
    // mutation내의 함수 실행->commit
    actions: {
        // 로그인 후 페이지이동 or 새로고침시 token 유효성 확인후 유효하면 setLogin에 true값 주기
        async checkToken ({commit}) {
            
            const url = `/api/user/auth.json`;
            const headers = { "Content-Type" : "application/json" };
            const { data } = await axios.get(url, { headers });
            console.log('토큰 확인',data);

            if(data.status === 200) {
                commit("setLogin", data.loginSuccess)
            }
            


        }
    }
});

export default stores;