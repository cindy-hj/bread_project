import { createStore } from 'vuex';
import axios from "axios";

const stores = createStore({
    state: {
        isLogin : false,
        email : '',
        isAdmin : false,
    },   

    // 다른 컴포넌트에서 사용
    getters: {
        getLogin(state) {
            return state.isLogin 
        },
        getUser(state) {
            return {    
                email: state.email, 
                isAdmin: state.isAdmin,
            }
        }
    },

    // 동기적인 작업, state의 값 변경
    mutations: {
        setLogin(state) {
            state.isLogin = true;
        },
        setUser(state, data) {
            state.email = data.email;
            state.isAdmin = data.isAdmin;
        },
        setLogout(state) {
            state.isLogin = false;
            state.email = '';
            state.isAdmin = '';
        },
    },
    
    // 비동기 작업, mutation내의 함수 실행->commit
    actions: {
        // 로그인 후 페이지이동 or 새로고침시 token 유효성 확인후 유효하면 setLogin에 true값 주기
        async checkToken ({commit}) {
            const url = `/api/user/auth`;
            const headers = { "Content-Type" : "application/json" };
            const { data } = await axios.get(url, { headers });
            console.log('스토어 토큰 확인',data);
            
            if(data.status === 200) {
                commit("setLogin");
                commit("setUser", data);
            } else {
                commit("setLogout");
            }
        }
    }
});

export default stores;