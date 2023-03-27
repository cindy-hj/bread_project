<template>
    <div>
        <header>
            <el-menu
                :default-active="activeIndex"
                class="el-menu-demo"
                mode="horizontal"
                :ellipsis="false"
                @select="handleSelect"
            >
                <el-menu-item index="0">
                    <router-link
                        to="/"
                        style="text-decoration: none"
                        >logo로그인상태{{ state.email }}</router-link
                    >
                </el-menu-item>
                <div class="flex-grow" />

                <el-menu-item index="1">
                    <router-link
                        to="/intro"
                        style="text-decoration: none"
                        >소개</router-link
                    >
                </el-menu-item>

                <el-menu-item index="2">
                    <router-link
                        to="/CS"
                        style="text-decoration: none"
                        >고객센터</router-link
                    >
                </el-menu-item>

                <el-menu-item index="3">
                    <el-input
                        style="margin-top: 10px"
                        v-model="input2"
                        class="w-50 m-2"
                        placeholder="지역, 가게명"
                        :suffix-icon="Search"
                    />
                </el-menu-item>

                <el-sub-menu index="4">
                    <template #title>이미지</template>
                    <router-link to="/login" style="text-decoration: none" v-if="!state.isLogin"><el-menu-item index="4-1">로그인</el-menu-item></router-link>
                    <router-link to="/join" style="text-decoration: none" v-if="!state.isLogin"><el-menu-item index="4-2">회원가입</el-menu-item></router-link>
                    <router-link to="/mypage" style="text-decoration: none" v-if="state.isLogin"><el-menu-item index="4-3">나의정보</el-menu-item></router-link>
                    <router-link to="/logout" style="text-decoration: none" v-if="state.isLogin"><el-menu-item index="4-3">로그아웃</el-menu-item></router-link>
                    <!-- <el-sub-menu index="4-4">
                        <template #title>item four</template>
                        <el-menu-item index="4-4-1">item one</el-menu-item>
                        <el-menu-item index="4-4-2">item two</el-menu-item>
                        <el-menu-item index="4-4-3">item three</el-menu-item>
                    </el-sub-menu> -->
                </el-sub-menu>
            </el-menu>
        </header>
    </div>
</template>

<script>
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useStore } from 'vuex';
import { reactive, computed } from 'vue';

export default {
    setup () {

        const activeIndex = ref('1')
        const handleSelect = () => {
        // (key: string, keyPath: string[]) => {
            // console.log(key, keyPath)
        }
        const input2 = ref('')

        const store = useStore();
        const state = reactive({
            isLogin : computed(() => store.getters.getLogin),
            email : computed(() => store.getters.getUser.email)
        });


        return {
            activeIndex,
            handleSelect,
            input2,
            Search,
            state
        }
    }
}
</script>

<style lang="css" scoped>

</style>
