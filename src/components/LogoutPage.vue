<template>
    <div>
        <h3>로그아웃</h3>
    </div>
</template>

<script>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { onMounted } from 'vue';

export default {
    setup () {
        const store = useStore();
        const router = useRouter();

        const logout = () => {
            const url = `/api/user/logout`;
            const headers = { "Content-Type": "application/json" };
            const body = {};
            axios.delete(url, { headers: headers, data: body });
            
            store.commit('setLogout');
            alert("로그아웃 되었습니다.");
            router.push({ path:'/'});
        }

        onMounted(() => {
            logout();
        });
    }
}
</script>

<style lang="scss" scoped>

</style>