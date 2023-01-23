<template>
    <div class="wrap">
        <div class="contents">
            <div class=section id="sectionA">
                <div class="map">
                    <div
                        id="map"
                        style="width: 350px; height: 350px"
                    ></div>
                </div>
                <div class="buttonWrap"></div>
            </div>
            <div class=section id="sectionB">
                <div class=regionalHeader>
                    <h3>{{ state.region }}</h3>
                </div>
                <div v-for="tmp in state.rows" :key="tmp" >
                    <p>{{ tmp.name }}</p>
                    <p>{{ tmp.menu }}</p>
                    <p>{{ tmp.price }}</p>
                    <hr />

                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

export default {

    setup() {
    
        const route = useRoute();
        const state = reactive({
            region: route.query.region,
            rows: [],
            total: 0,
            page: route.query.page,

        });    

        ////////////////////////////////////////////////지도//////////////////////////////////
        const initMap = () => {
            const mapContainer = document.getElementById('map');
            const mapOptions = {
                center: new window.kakao.maps.LatLng(35.15, 129.05), // 위치
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
            const url = `/api/bakery/select.json?page=${state.page}&text=${state.region}`;
            const headers = { "Content-Type" : "application/json" };
            const { data } = await axios.get(url, { headers });
            console.log(data);

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
            // closeOverlay
        };
    }
};
</script>

<style lang="css" scoped>
.section{
    float: left;
}
</style>
