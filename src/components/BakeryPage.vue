<template>
    <div class="bakery">
        <div class="topImage">
            <div class="imglist">
                <img :src="state.row.imageurl" />
                <img :src="state.row.imageurl" />
                <img :src="state.row.imageurl" />
                <img :src="state.row.imageurl" />
                <img :src="state.row.imageurl" />
            </div>
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
                <div class="reviewBody">
                    <div class="reviewLeft">
                        <p>유저 사진, 아이디</p>
                    </div>
                    <div class="reviewCenter">
                        <p>리뷰내용</p>
                        <img src="http://127.0.0.1:3000/api/review/image?name=1679646288797bread3.jpg" />
                    </div>
                    <div class="reviewRight">
                        <p>별점</p>
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
import { onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
    setup () {
        
        const route = useRoute();
        const router = useRouter();

        const state = reactive({
            bakery: route.query.bakery,
            row: "",
        });  
        
        const handleReview = (bakery) => {
            router.push({path:"/review", query:{bakery:bakery, _id:state.row._id}})
        }

        const handleData = async() => {
            const url = `/api/bakery/select?bakery=${state.bakery}`;
            const headers = { "Content-Type" : "application/json" };
            const { data } = await axios.get(url, { headers });
            console.log('빵집',data);

            if(data.status === 200) {
                state.row = data.result;
            }
        }

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
        });

        return {
            state,
            handleReview,
        }
    }
}
</script>

<style lang="css" scoped>
.bakery{
    position: absolute;
    width: 1350px;
}
.topImage{
    width: 100%;
    height: 350px;
}
.imglist{
    float: left;
}
img {
    width: 250px;
    height: 300px;
    margin: 10px;
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
/* .reviewBody{ */
    /* margin: 10px;
} */
.reviewLeft{
    width: 100px; 
    border: 1px solid #cccccc;  
    float: left;
    
    margin: 10px;
}
.reviewCenter{
    width: 550px;
    border: 1px solid #cccccc; 
    float: left; 
    
    margin: 10px;
}
.reviewRight{
    width: 140px;
    border: 1px solid #cccccc;  
    float: left;
    
    margin: 10px;
}
.rightWrap{
    position: relative;
    float: left;
    width: 415px;
    border: 1px solid #cccccc;
    margin-left: 10px;

}
</style>