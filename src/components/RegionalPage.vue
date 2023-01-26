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
                    <p>{{ tmp.name }}</p>
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

        const handleRegion = (region) => {
            state.region = region;
            handleData();
            handleMap();
            router.push({path: '/regional', query: {page:1, region:region}});
        };

        ////////////////////////////////////////////////지도//////////////////////////////////
        const initMap = () => {
            const mapContainer = document.getElementById('map');
            const mapOptions = {
                center: new window.kakao.maps.LatLng(state.rows[0].lat, state.rows[0].lng), // 위치
                level: 6 // 배율
            };

            const map = new window.kakao.maps.Map(mapContainer, mapOptions);

            // marker
            for (let tmp of state.rows) {
                const position = new window.kakao.maps.LatLng(tmp.lat, tmp.lng);
                // console.log(tmp.lng);
                const markerOptions = {
                    map: map,
                    position: position
                };

                const marker = new window.kakao.maps.Marker(markerOptions);

                // 오버레이
                const overlay = new window.kakao.maps.CustomOverlay({
                    content: '내용',
                    map: map,
                    position: marker.getPosition()       
                });

                // 마커를 클릭했을 때 커스텀 오버레이를 표시합니다
                window.kakao.maps.event.addListener(marker, 'click', function() {
                    overlay.setMap(map);
                });

                // 커스텀 오버레이를 닫기 위해 호출되는 함수입니다 
                // function closeOverlay() {
                //     overlay.setMap(null);     
                // }
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
            handleRegion
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
