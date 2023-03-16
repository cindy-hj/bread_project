<template>
    <div class="wrap">
        <menu-page></menu-page>
        
        <div class=container>
            <router-view></router-view>
        </div>
        
        <!-- <footer-page></footer-page> -->
    </div>
</template>

<script>
import MenuPage from './components/MenuPage.vue';
// import FooterPage from './components/FooterPage.vue';
import { Search } from '@element-plus/icons-vue';
// import { useStore } from 'vuex';
// import { reactive, computed } from 'vue';


export default {
    components: {

        MenuPage,
        // FooterPage,
        
    },
    setup() {
        // 컴포넌트별 공용변수 사용하기 위해
        // const store = useStore();
        // const state = reactive({
        //     isLogin : computed(() => store.getters.getLogin)
        // });
        return {
            Search,
            // state,
        };
    }
};
</script>

<!-- <style lang="css" scoped src="./assets/css/main.css" /> -->
<style>
.container{
  height: auto;
  min-height: 100%;
  padding-bottom: 200px;
}
.flex-grow {
    flex-grow: 1;
}

</style>
