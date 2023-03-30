<template>
    <div class="bakery">

        <div class ="modal" v-if="modalVisible">
            <el-button size="large" round @click="showNextImage()">다음</el-button>
            <el-button size="large" round @click="modalVisible = false">닫기</el-button>
            <div class="modalInBox">
                <div class="modalInBoxLeft">
                    <img :src="currentImageUrl" />
                </div>
                <div class="modalInBoxRight">
                    오른쪽
                </div>
            </div>
            
        </div>

        <div class="topImage">
            <div class="imgList" v-for="(tmp, outterIndex) in state.review" :key="outterIndex">
                <div class="imgListIn" v-for="(img, innerIndex) in tmp.images" :key="innerIndex" @click="handleModal(outterIndex, innerIndex)">
                    <img :src="img.imageurl" />
                </div>
            </div>
        </div>
        
        <div class="more" v-if="state.count > 5">
            <el-button size="large" round @click="handleMore()">더보기</el-button>
        </div>

        <div class="leftWrap">
            <el-card class="info">  
                <template #header>
                <div class="infoHeader">
                    <span id="name"><h2>{{ state.row.name }}</h2></span>
                    <span id="point">평점</span>
                    <el-button class="button" text>가고싶다</el-button>
                    <el-button class="button" text @click="handleReview(state.row.name)">리뷰쓰기</el-button>
                </div>
                </template>
                <div class="infoBody">
                    <div class="item">
                        <label class="lbl">주소</label>
                        {{ state.row.address }} {{ state.row.addressdetail }}
                    </div>
                    <div class="item">
                        <label class="lbl">전화번호</label>
                        {{ state.row.phone }}
                    </div>
                    <div class="item">
                        <label class="lbl">대표메뉴</label>
                        {{ state.row.menu }}
                    </div>
                    <div class="item">
                        <label class="lbl">가격대</label>
                        {{ state.row.price }}
                    </div>
                    <div class="item">
                        <label class="lbl">휴일</label>
                        {{ state.row.holiday }}
                    </div>
                </div>
            </el-card>
            <div class="review">
                <div class="reviewHeader">                
                    <h3>리뷰</h3>
                </div>
                <div class="reviewBody" v-for="tmp of state.review" :key="tmp">
                    <div class="reviewLeft">
                        <p>{{ tmp.writer }}</p>
                    </div>
                    <div class="reviewCenter">
                        <p>{{ tmp.regdate1 }}</p>
                        <p>{{ tmp.content }}</p>
                        <div class="reviewimg" v-for="img of tmp.images" :key="img">
                            <div class="imgReview"><img :src="img.imageurl" /></div>
                        </div>
                    </div>
                    <div class="reviewRight">
                        <span v-for="star of tmp.point" :key="star">★</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="rightWrap">
            <h3>지도</h3>
            <div class="map">
                <div
                    id="map"
                    style="width: 400px; height: 400px"
                ></div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { onMounted, reactive, watchEffect, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
    setup () {

        const route = useRoute();
        const router = useRouter();

        const state = reactive({
            bakery: route.query.bakery,
            row: "",
            review: [],
            count: 0,
            modal: false,
            sixthImage: "",
            
        });  
        
        const modalVisible = ref(false);
        const currentOutterIndex = ref(0);
        const currentInnerIndex = ref(0);


        // 리뷰 쓰기로 이동
        const handleReview = (bakery) => {
            router.push({path:"/review", query:{bakery:bakery, _id:state.row._id}})
        }

        // 빵집 데이터 읽어오기
        const handleData = async() => {
            const url = `/api/bakery/select?bakery=${state.bakery}`;
            const headers = { "Content-Type" : "application/json" };
            const { data } = await axios.get(url, { headers });
            console.log('빵집',data);

            if(data.status === 200) {
                state.row = data.result;
            }
        }

        // 리뷰 데이터 읽어오기
        const handleReviewData = async() => {
            const url = `/api/review/select?bakery=${state.row._id}`;
            const headers = { "Content-Type" : "application/json" };
            const { data } = await axios.get(url, { headers });
            console.log('리뷰데이터',data);

            if(data.status === 200) {
                state.review = data.result;

                // 리뷰 이미지 갯수 카운팅
                // watchEffect(() => {
                //     state.count = state.review.reduce((acc, cur) => {
                //         return acc + cur.images.length
                //     }, 0)
                // }) 
                // console.log("카운팅", state.count);

                watchEffect(() => {
                    state.count = 0; 
                    for (const tmp of state.review) {  // 평탄화된 review 배열 내에서 각 이미지 객체에 접근
                        for (const img of tmp.images) {
                            if (++state.count === 6) {  // index 값이 6인 이미지 객체를 찾음
                                state.sixthImage = img;
                                console.log("여섯번째",state.sixthImage.imageurl);
                                break;
                            }
                        }
                    }
                });

            }
        }

        // 리뷰 사진 모달창      
        const handleModal = (outterIndex, innerIndex) => {
            currentOutterIndex.value = outterIndex;
            currentInnerIndex.value = innerIndex;
            modalVisible.value = true;
        };

        const showNextImage = () => {
            if (currentInnerIndex.value < state.review[currentOutterIndex.value].images.length - 1) {
                currentInnerIndex.value += 1;
            } else if (currentOutterIndex.value < state.review.length - 1) {
                currentOutterIndex.value += 1;
                currentInnerIndex.value = 0;
            } else {
                alert("마지막 이미지입니다.");
            }
        };

        const currentImageUrl = computed(() => {
            return state.review[currentOutterIndex.value].images[currentInnerIndex.value].imageurl;
        });

        const handleMore = () => {
            state.review[currentOutterIndex.value].images[currentInnerIndex.value].imageurl = state.sixthImage.imageurl;
            modalVisible.value = true;
        };




        ////////////////////////////////////////////////지도//////////////////////////////////
        const initMap = async() => {
            const mapContainer = document.getElementById('map');
            const mapOptions = {
                center: await new window.kakao.maps.LatLng(state.row.lat, state.row.lng), 
                level: 6    
            };

            // 지도를 표시할 div와 지도 옵션으로 지도를 생성
            const map = await new window.kakao.maps.Map(mapContainer, mapOptions);


            // 마커
            let position = await new window.kakao.maps.LatLng(state.row.lat, state.row.lng); 
            let marker = new window.kakao.maps.Marker({ 
                map: map,
                position: position
            });

            // 오버레이
            let content = `<div style='z-index:3;'>${state.row.name}</div>
            <img src = "${state.row.imageurl}" style = 'width:50px; height:50px;' />` 
            let overlay = new window.kakao.maps.CustomOverlay({
                content: content,
                map: map,
                zIndex:4
                // position:''      
            });

            // 마커를 클릭했을 때 커스텀 오버레이를 표시
            window.kakao.maps.event.addListener(marker, 'click', function() {
                overlay.setPosition( marker.getPosition() );
                overlay.setMap(map);
            });
            window.kakao.maps.event.addListener(map, 'click', function() {
                overlay.setMap(null);
            });
            window.kakao.maps.event.addListener(overlay, 'click', function() {
                overlay.setMap(null);
            });

        };

        const handleMap = () => {
            let script = document.createElement('script');
                script.setAttribute(
                    'src',
                    '//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=de59ae56a721c2720b60880e954d70e8'
                );
                document.head.appendChild(script);
                script.onload = async() => {
                    await window.kakao.maps.load(initMap);
                };
        };

        //////////////////////////////////////////////////////////

        onMounted(async() => {
            await handleData();
            handleMap();
            handleReviewData();
        });

        return {
            state,
            handleReview,
            handleModal,
            handleMore,

            modalVisible,
            currentOutterIndex,
            currentInnerIndex,
            showNextImage,
            currentImageUrl,
        }
    }
}
</script>

<style lang="css" scoped>
.bakery{
    position: absolute;
    width: 1340px;
}
.modal {
    background-color: rgba(0,0,0,0.5);
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 2;
    top: 0px;
}
.modalInBox{
    /* border: 1px solid #cccccc; */
    width: 80%;
    height: 80%;
    position: relative;
    left: 10%;
    top: 5%;
}
.modalInBoxLeft{
    background-color: black;
    width: 70%;
    height: 100%;
    overflow: hidden;
    float: left;
}
.modalInBoxLeft img{
    width: 100%;
}
.modalInBoxRight{
    background-color: white;
    width: 30%;
    height: 100%;
    float: left;
}
.topImage{
    display: flex;
    /* flex-wrap: wrap; */
    overflow: hidden;
}
.imgList {
    display: flex;
}
.imgListIn {
    width: 250px;
    height: 300px;
    margin: 9px;
    /* flex: 1; */
}
/* .spacer {
  width: 10px; 
  display: inline-block;
  vertical-align: top; 
} */
.imgListIn img {
  width: 100%;
  height: 100%; 
  display: block;
}
.more {
    /* border: 1px solid #cccccc;
    width: 80px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    padding: 5px; */

    position: absolute;
    right: 30px;
    top: 250px;
}
.leftWrap{
    position: relative;
    width: 900px;
    margin-left: 10px;
    float: left;
}
.info{
    margin-bottom: 20px;
}
#name{
   margin-right: 20px; 
   display: inline-block;
}
.button{
    float: right;
}
.lbl{
    display : inline-block;
    width   : 100px;
    margin  : 10px;
    
}
.review{
    margin: 20px;
}
.reviewBody{ 
    display: flex;
    position: relative;
}
.reviewLeft{
    width: 100px; 
    /* border: 1px solid #cccccc;   */
    float: left;   
    position: relative;
    margin: 10px;
}
.reviewCenter{
    width: 550px;
    /* border: 1px solid #cccccc;  */
    float: left;     
    position: relative;
    margin: 10px;
}
.reviewRight{
    width: 140px;
    /* border: 1px solid #cccccc;   */
    float: left;
    position: relative;
    margin: 10px;
}
.reviewBody:after {
  content: "";
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 2px;
  background-color: #cccccc;
  margin-top: 30px;
}
.imgReview {
    width: 100px;
    height: 100px;
    margin: 10px;
    float: left;
}
.imgReview img {
  width: 100%;
  height: 100%; 
}
.rightWrap{
    position: relative;
    float: left;
    width: 415px;
    border: 1px solid #cccccc;
    margin-left: 10px;

}


</style>