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

export default {
    components: {

        MenuPage,
        // FooterPage,
        
    },
    setup() {
        return {
            Search
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
