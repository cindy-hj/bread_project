<template>
    <div class="wrap">
        <el-form
            :model="state"
            label-width="120px"
        >

        <el-form-item label="이메일">
            <el-input v-model="state.email" />
        </el-form-item>

        <el-form-item label="비밀번호">
            <el-input type="password" v-model="state.password" />
        </el-form-item>

        <el-form-item>
                <el-button
                    type="primary"
                    @click="handleLogin()"
                    >로그인</el-button
                >
                <el-button @click="handleCancel()">취소</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import axios from 'axios';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

export default {
    setup () {
        
        const router = useRouter();

        const state = reactive({
            email: '',
            password: '',
        })

        const handleLogin = async() => {
            const url = `api/user/login.json`;
            const headers = {"Content-type":"application/json"};
            const body = {
                email : state.email,
                password : state.password,
            }
            const { data } = await axios.post(url, body, {headers});
            console.log("로그인", data);

            if(data.status === 200) {
                console.log("로그인 성공");
            } else {
                console.log("로그인 실패");
            }
        }

        const handleCancel = () => {
            router.push({path:"/"});
        }

        return {
            state,
            handleCancel,
            handleLogin,
        }
    }
}
</script>

<style lang="css" scoped>
.wrap{
    margin: 100px auto;
    width: 500px;
}
</style>