<template>
    <div class="wrap">
    <div class="container">
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
                        >logo</router-link
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
                    <el-menu-item index="4-1">로그인</el-menu-item>
                    <el-menu-item index="4-2">회원가입</el-menu-item>
                    <!-- <el-menu-item index="4-3">나의정보</el-menu-item> -->
                    <!-- <el-sub-menu index="4-4">
                    <template #title>item four</template>
                    <el-menu-item index="4-4-1">item one</el-menu-item>
                    <el-menu-item index="4-4-2">item two</el-menu-item>
                    <el-menu-item index="4-4-3">item three</el-menu-item>
                </el-sub-menu> -->
                </el-sub-menu>
            </el-menu>
        </header>

        <router-view></router-view>
    </div>

    <footer>footer</footer>
    </div>
</template>

<script>
import { Search } from '@element-plus/icons-vue';
export default {
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
.wrap {
  position: relative;
}
.flex-grow {
    flex-grow: 1;
}
footer {
  background-color: gray;
  height: 200px;
  
  position: relative;
  transform: translateY(-100%);
  
}
</style>
