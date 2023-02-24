<template>
    <div class="wrap">
        <el-form
            :model="state"
            label-width="120px"
        >

            <el-form-item label="이메일">
                <el-input :ref="el => {arr[0]=el}" v-model="state.email_id" style="width: 151px;" autofocus/>
                <span>@</span>
                <el-select
                   :ref="el => {arr[1]=el}"
                    v-model="state.email_add"
                    placeholder="이메일 주소를 선택하세요"
                >
                    <el-option
                        label="google.com"
                        value="google"
                    />
                    <el-option
                        label="naver.com"
                        value="naver"
                    />
                    <el-option
                        label="daum.net"
                        value="daum"
                    />
                </el-select>
            </el-form-item>

            <el-form-item label="비밀번호">
                <el-input :ref="el => {arr[2]=el}" type="password" v-model="state.password" />
            </el-form-item>

            <el-form-item label="이름">
                <el-input :ref="el => {arr[3]=el}" v-model="state.name" />
            </el-form-item>

            <el-form-item label="주소">
                <el-input class="addr" id="postcode" v-model="state.postcode" placeholder="우편번호" style="width: 151px;"/>
                <el-button class="addr" @click="onPostcode()">우편번호 찾기</el-button>
                <el-input class="addr" id="address" :ref="el => {arr[4]=el}" v-model="state.address" placeholder="주소" />
                <el-input class="addr" id="detailAddress" :ref="el => {arr[5]=el}" v-model="state.detailAddress" placeholder="상세주소" style="width: 209px;" />
                <el-input class="addr" id="extraAddress" v-model="state.extraAddress" placeholder="참고항목" style="width: 151px;" />
            </el-form-item>

            <el-form-item label="성별">
                <el-radio-group v-model="state.gender">
                    <el-radio label="남" />
                    <el-radio label="여" />
                </el-radio-group>
            </el-form-item>
            
            <el-form-item>
                <el-button
                    type="primary"
                    @click="handleJoin()"
                    >회원가입</el-button
                >
                <el-button @click="handleCancel()">취소</el-button>
            </el-form-item>
        </el-form>
    </div>  
</template>

<script>
import axios from 'axios';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
    setup() {
        const router = useRouter();

        const state = reactive({
            email_id: '',
            email_add: '',
            password: '',
            name: '',
            postcode: '',
            address: '',
            detailAddress: '',
            extraAddress: '',
            gender: ''
        })

        const arr = ref([]);

        const handleJoin = async() => {
            if(state.email_id.length <= 0) {
                alert("이메일 아이디를 입력하세요.")
                arr.value[0].focus();
                return false;
            }
            if(state.email_add.length <= 0) {
                alert("이메일 주소를 선택하세요.")
                arr.value[1].focus();
                return false;
            }
            if(state.password.length <= 0) {
                alert("비밀번호를 입력하세요.")
                arr.value[2].focus();
                return false;
            }
            if(state.name.length <= 0) {
                alert("이름을 입력하세요.")
                arr.value[3].focus();
                return false;
            }
            if(state.address.length <= 0) {
                alert("주소를 입력하세요.")
                arr.value[4].focus();
                return false;
            }
            if(state.detailAddress.length <= 0) {
                alert("상세주소를 입력하세요.")
                arr.value[5].focus();
                return false;
            }
            if(state.gender.length <= 0) {
                alert("성별을 선택하세요.")
                return false;
            }

            const url = `api/user/join.json`;
            const headers = {"Content-Type":"application/json"};
            const body = {
                email : `${state.email_id}@${state.email_add}`,
                name : state.name,
                address : state.address,
                detailaddress : state.detailAddress,
                gender : state.gender,
                password : state.password
            }
            const { data } = await axios.post(url, body, {headers});
            console.log(data);
            if(data.status === 200) {
                alert('회원 가입 성공!');
                router.push({path:"/"});
            }
        }

        const handleCancel = () => {
            router.push({path:"/"});
        }

        const onPostcode = () => {
            new window.daum.Postcode({
                oncomplete: function(data) {
                    // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

                    // 각 주소의 노출 규칙에 따라 주소를 조합한다.
                    // 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
                    if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                        state.address = data.roadAddress;
                    } else { // 사용자가 지번 주소를 선택했을 경우(J)
                        state.address = data.jibunAddress;
                    }

                    // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
                    if(data.userSelectedType === 'R'){
                        // 법정동명이 있을 경우 추가한다. (법정리는 제외)
                        // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
                        if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
                            state.extraAddress += data.bname;
                        }
                        // 건물명이 있고, 공동주택일 경우 추가한다.
                        if(data.buildingName !== '' && data.apartment === 'Y'){
                            state.extraAddress += (state.extraAddress !== '' ? ', ' + data.buildingName : data.buildingName);
                        }
                        // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
                        if(state.extraAddress !== ''){
                            state.extraAddress = ' (' + state.extraAddress + ')';
                        }
                        // 조합된 참고항목을 해당 필드에 넣는다.
                        document.getElementById("extraAddress").value = state.extraAddress;
                    
                    } else {
                        document.getElementById("extraAddress").value = '';
                    }

                    // 우편번호와 주소 정보를 해당 필드에 넣는다.
                    document.getElementById("postcode").value = data.zonecode;
                    document.getElementById("address").value = state.address;
                    // 커서를 상세주소 필드로 이동한다.
                    document.getElementById("detailAddress").focus();
                }
            }).open();
        }

        onMounted(()=> {
            // script 태그 생성
            let script = document.createElement("script");
            // script 태그에 추가
            script.setAttribute("src", "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js")
            // window에 추가
            document.head.appendChild(script);
            // 추가됐는지 확인
            console.log(window);
        })

        return {
            state,
            arr,
            onPostcode,
            handleJoin,
            handleCancel
        };
    }
};
</script>

<style lang="css" scoped>
.wrap{
    margin: 100px auto;
    width: 500px;
}
.addr{
    margin: 5px 10px 5px 0px;
}
</style>
