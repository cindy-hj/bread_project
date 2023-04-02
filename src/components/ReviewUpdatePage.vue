<template>
    <div class="wrap">
        <div class="reviewHeader">
            <h2 class="name">{{ state.name }}</h2>
            <span>에 대한 솔직한 리뷰를 써주세요.{{ state.files }}</span>
            <div class="rating">
                <span>별점 {{ state.score -1 }}</span>
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
                show-word-limit
                rows=12
                resize="none"
                type="textarea"
            />
        </div>
        <div class="reviewImg">
            <el-dialog v-model="state.dialogVisible">
                <!-- <img v-for="(url, index) in state.getImageUrl" :key="index" style="width:100%" :src="url" alt="Preview Image" /> -->
                <img style="width:100%" :src="state.dialogImageUrl" alt="Preview Image" />
            </el-dialog>

            <el-upload action="#" 
                list-type="picture-card" 
                :auto-upload="false" 
                :multiple="true"
                :on-remove="handleRemove"
                :on-preview="handlePreview"
                v-model:file-list="state.files"
            >
            <el-icon><Plus /></el-icon>
            </el-upload>
        </div>
        <div class="reviewButton">
            <el-button type="primary" plain size="large" @click="handleUpdate()">리뷰 수정</el-button>
            <el-button plain size="large">취소</el-button>
        </div>
    </div>
</template>

<script>
import { reactive, /*computed,*/ onMounted } from 'vue';
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
            bakery: route.query.bakery,
            review: route.query.review,
            name: route.query.name,

            score : 0,
            content : '',
            // files : [], // 첨부파일 목록
            // getImageUrl: [], // get으로 가져온 이미지 미리보기

            dialogVisible : false, // + 미리보기 다이얼로그
            dialogImageUrl : '', // 미리보기 이미지 url
        })

        // 별점
        const check = (index) => {
            state.score = index + 1;
        }

        // 기존 데이터 읽어오기
        const handleData = async() => {
            const url = `/api/review/selectone?review=${state.review}`;
            const headers = { 'Content-Type': 'application/json' };
            const { data } = await axios.get(url, { headers });
            console.log('리뷰데이터', data);

            if (data.status === 200) {
                state.row = data.result;
                state.content = data.result.content;
                state.score = data.result.point +1;
                // state.files = data.result.images;

                // for (let i = 0; i < data.result.images.length; i++) {
                //     state.getImageUrl.push(data.result.images[i].imageurl);
                // }
                // state.dialogVisible = true;
            }
        }
        // 후기 수정
        const handleUpdate = async() => {
            const url = `api/review/update?_id=${state.review}`;
            const headers = {"Content-Type":"multipart/form-data"};
            const body = new FormData();

            body.append("content", state.content);
            body.append("point", state.score-1);

            // 파일명, 크기, 내용, 종류
            for (let i = 0; i < state.files.length; i++) {
                body.append("images", state.files[i].raw);
            }
            const { data } = await axios.put(url, body, {headers});
           
            console.log("후기업로드데이터",data);
            if(data.status === 200) {
                router.push({path:"/select", query:{ bakery: state.bakery }});
            }
        };
      
        const handleRemove = (e) => {
           console.log(`삭제 =>`, e);
        }
        const handlePreview = (e) => {
           state.dialogImageUrl = e.url;
           state.dialogVisible = true;
           console.log(`미리보기 =>`, e);
        }


        onMounted(async () => {
            await store.dispatch("checkToken");
            // await handleUser();
            handleData();
        });

        return {
            state,
            handleUpdate,
            handleRemove,
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