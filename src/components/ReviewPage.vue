<template>
    <div class="wrap">
        <div class="reviewHeader">
            <h2 class="name">{{ state.name }}</h2>
            <span>에 대한 솔직한 리뷰를 써주세요.</span>
            <div class="rating">
                <span>별점 {{ state.score-1 }}</span>
                <div class="star" v-for="index in 5" :key="index" @click="check(index)">
                    <span v-if="index < state.score">★</span>
                    <span v-if="index >= state.score">☆</span>
                </div>
            </div>
        </div>
        <div class="reviewBody">
            <el-input
                v-model="state.content"
                maxlength="10000"
                placeholder="user님, 주문하신 메뉴는 어떠셨나요? 빵집의 분위기와 서비스도 궁금해요!"
                show-word-limit
                rows=12
                resize="none"
                type="textarea"
            />
        </div>
        <div class="reviewImg">
            <el-dialog v-model="state.dialogVisible">
                <img style="width:100%" :src="state.dialogImageUrl" alt="Preview Image" />
            </el-dialog>

            <el-upload action="#" 
                list-type="picture-card" 
                :auto-upload="false" 
                :on-remove="handelRemove"
                :on-preview="handlePreview"
                v-model:file-list="state.files"
            >
            <el-icon><Plus /></el-icon>
            </el-upload>
        </div>
        <div class="reviewButton">
            <el-button type="primary" plain size="large" @click="handleInsert()">리뷰 쓰기</el-button>
            <el-button plain size="large">취소</el-button>
        </div>
    </div>
</template>

<script>
import { reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Plus } from '@element-plus/icons-vue'
import axios from 'axios';
import { useStore } from 'vuex';

export default {
    components : {
        Plus, 
    },

    setup () {
        const route = useRoute();
        const router = useRouter();
        const store = useStore();

        const state = reactive({
            email : computed(() => store.getters.getUser.email),
            user : '',

            content : '',
            bakery: route.query.bakery,
            name: route.query.name,

            files : [], // 첨부파일 목록
            dialogVisible : false, // + 미리보기 다이얼로그
            dialogImageUrl : '', // 미리보기 이미지 url

            score : 0,
        })

        // 별점
        const check = (index) => {
            state.score = index + 1;
        }

        // 로그인 한 회원정보
        const handleUser = async() => {
            const url = `/api/user/findOne`;
            const headers = { "Content-Type" : "application/json" };
            const body = {
                email : state.email
            }
            const { data } = await axios.post(url, body, {headers});
            console.log('회원정보확인',data);

            if(data.status === 200) {
                state.user = data.result;
            }  
        }

        // 후기 입력
        const handleInsert = async() => {
            const url = `api/review/insert`;
            const headers = {"Content-Type":"multipart/form-data"};
            const body = new FormData();

            body.append("bakery_id", state.bakery);
            body.append("writer", state.user.name);
            body.append("point", state.score-1);
            body.append("content", state.content);

            // 파일명, 크기, 내용, 종류
            for (let i = 0; i < state.files.length; i++) {
                body.append("images", state.files[i].raw);
            }

            const { data } = await axios.post(url, body, {headers});
            console.log("후기업로드데이터",data);
            if(data.status === 200) {
                // const path = sessionStorage.getItem("CURRENT_PATH");
                const query = JSON.parse(sessionStorage.getItem("QUERY"));

                router.push({path:"/select", query:{ bakery: query.bakery }});
            }
        };
      
        const handelRemove = (e) => {
           console.log(`삭제 =>`, e);
        }
        const handlePreview = (e) => {
           state.dialogImageUrl = e.url;
           state.dialogVisible = true;
           console.log(`미리보기 =>`, e);
        }


        onMounted(async () => {
            await store.dispatch("checkToken");
            await handleUser();
        });

        return {
            state,
            handleInsert,
            handelRemove,
            handlePreview,
            check,
        }
    }
}
</script>

<style lang="css" scoped>
.wrap{
    width: 700px;
    margin: 50px auto;
}
.name{
    display: inline-block;
}
.reviewImg{
    margin-top: 10px;
}
.reviewButton{
    float: right;
}
.rating{
    float: right;
    margin-top: 25px;
}
.star{
    display: inline-block;
}
</style>