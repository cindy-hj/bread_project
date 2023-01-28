<template>
    <div class="wrap">
        <div class="contents">
            <div class=section id="sectionA">
                <div class="map">
                    <div
                        id="map"
                        style="width: 400px; height: 400px"
                    ></div>
                </div>
                <div class="buttonWrap">
                    <el-button type="primary" size="small" round @click="handleRegion('부산진구')">부산진구</el-button>
                    <el-button type="primary" size="small" round @click="handleRegion('남구')">남구</el-button>
                    <el-button type="primary" size="small" round @click="handleRegion('해운대구')">해운대구</el-button>
                    <el-button type="primary" size="small" round @click="handleRegion('중구')">중구</el-button>
                    <el-button type="primary" size="small" round @click="handleRegion('동래구')">동래구</el-button>
                    <el-button type="primary" size="small" round @click="handleRegion('금정구')">금정구</el-button>
                </div>
            </div>
            <div class=section id="sectionB">
                <div class=regionalHeader>
                    <h3>{{ state.region }}</h3>
                </div>
                <div v-for="tmp in state.rows" :key="tmp" >
                    <hr />
                    <p @click="handleOne(tmp.name)">{{ tmp.name }}</p>
                    <p>{{ tmp.menu }}</p>
                    <p>{{ tmp.price }}</p>
                    <p><img :src="tmp.imageurl"></p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

export default {

    setup() {
        const route = useRoute();
        const router = useRouter();

        const state = reactive({
            region: route.query.region,
            rows: [],
            total: 0,
            page: route.query.page,

        });    

        const handleOne = (name) => {
            router.push({path:"/bakery", query:{page:1, bakery:name}})
        }

        const handleRegion = (region) => {
            state.region = region;
            handleData();
            handleMap();
            router.push({path: '/regional', query: {page:1, region:region}});
        };

        ////////////////////////////////////////////////지도//////////////////////////////////
        const initMap = () => {
            console.log(state.rows[0].lat);
            const mapContainer = document.getElementById('map');
            const mapOptions = {
                // 변수 선언할때 if문 쓸수 없다!
                center: new window.kakao.maps.LatLng(state.rows[0].lat, state.rows[0].lng), // 위치
                level: 6 // 배율        
            };
            // 지도를 표시할 div와 지도 옵션으로 지도를 생성
            const map = new window.kakao.maps.Map(mapContainer, mapOptions);

            const overlay = new Array(); // 오버레이를 담을 배열 생성
            const marker = new Array(); // 마커를 담을 배열 생성

            for (let tmp of state.rows) {
                // DB에 저장된 위도, 경도값을 담음
                var position = new window.kakao.maps.LatLng(tmp.lat, tmp.lng); 
                
                // 마커 생성 및 위치 설정
                var markers = new window.kakao.maps.Marker({ 
                    map: map,
                    position: position
                });
                // 생성된 마커를 배열에 추가
                marker.push(markers); 

                var content = "<div style='z-index:3; width:50px; height:50px;'>내용</div>";
                
                // 오버레이 생성 및 옵션 설정
                var overlays = new window.kakao.maps.CustomOverlay({
                    content: content,
                    map: map,
                    zIndex:4
                    // position:''      
                });
                // 생성된 오버레이를 배열에 추가
                overlay.push(overlays);

            }
            
            for (let i=0; i<marker.length; i++) {
                // 마커를 클릭했을 때 커스텀 오버레이를 표시
                window.kakao.maps.event.addListener(marker[i], 'click', function() {
                overlay[i].setPosition( marker[i].getPosition() );
                overlay[i].setMap(map);
                });

                 
            }


            
           

            // 오버레이 내용
                // const content = <div class="wrap">
                //     <div class="info"> 
                //         <div class="title">
                //             카카오 스페이스닷원
                //             <div class="close" onclick="closeOverlay()" title="닫기"></div>
                //         </div>
                //         <div class="body"> 
                //             <div class="img">
                //                 <img src="https://cfile181.uf.daum.net/image/250649365602043421936D" width="73" height="70" /> 
                //             </div> 
                //             <div class="desc"> 
                //                 <div class="ellipsis">제주특별자치도 제주시 첨단로 242</div> 
                //                 <div class="jibun ellipsis">(우) 63309 (지번) 영평동 2181</div> 
                //                 <div><a href="https://www.kakaocorp.com/main" target="_blank" class="link">홈페이지</a></div> 
                //             </div> 
                //         </div> 
                //     </div>    
                // </div>




            // 커스텀 오버레이를 닫기 위해 호출되는 함수입니다 
            // function closeOverlay() {
            //     overlay.setMap(null);     
            // }

           

            
        };

        const handleMap = () => {
            let script = document.createElement('script');
                script.setAttribute(
                    'src',
                    '//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=de59ae56a721c2720b60880e954d70e8'
                );
                document.head.appendChild(script);
                // console.log(window);
                script.onload = () => {
                    window.kakao.maps.load(initMap);
                };
        };
        //////////////////////////////////////////////////////////


        const handleData = async() => {
            const url = `/api/bakery/select.json?page=${state.page}&region=${state.region}`;
            const headers = { "Content-Type" : "application/json" };
            const { data } = await axios.get(url, { headers });
            console.log('확인',data);

            if(data.status === 200) {
                state.rows = data.result;
                state.total = data.total;
            }
        }
        
        onMounted(() => {
            handleMap();
            handleData();
        });

        return {
            state,
            handleRegion,
            handleOne
            // closeOverlay
        };
    }
};
</script>

<style lang="css" scoped>
.section {
    float: left;
}
.buttonWrap {
    width: 300px;
    text-align: center;
}
#sectionB {
    margin-left: 30px;
}
img {
    width: 300px;
}
</style>
