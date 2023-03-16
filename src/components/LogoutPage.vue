<template>
    <div>
        <h3>로그아웃</h3>
    </div>
</template>

<script>
import { useStore } from 'vuex';
import { reactive, computed } from 'vue';
import { useRouter } from 'vue-router';

export default {
    setup () {
        const store = useStore();
        const router = useRouter();

        store.commit('setLogin', false);
        
        const state = reactive({
            isLogin : computed(() => store.getters.getLogin)
        });
        alert("로그아웃 되었습니다.");
        router.push({path:"/"});

        return {
            state
        }

    }
}
</script>

<style lang="scss" scoped>

</style>