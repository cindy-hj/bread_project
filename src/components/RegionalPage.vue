<template>
    <div class="wrap">
        <div class="contents">
            <div class="sectionA">
                <div class="map">
                    <div
                        id="map"
                        style="width: 100%; height: 350px"
                    ></div>
                </div>
                <div class="buttonWrap"></div>
            </div>
            <div class="sectionB"></div>
        </div>
    </div>
</template>

<script>
import { onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';

export default {
    setup() {
        const route = useRoute();
        const state = reactive({
            id: Number(route.query.id),
            map: '',
            marker: '',
        });

        onMounted(() => {
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
        });

        const initMap = () => {
            const container = document.getElementById('map');
            // window 콘솔 찍어보면 kakao밑에 maps있음. f붙은것들 함수라는뜻 LatLng는(a,b) 2개 들어가서 포지션 만들어짐
            const position = new window.kakao.maps.LatLng(35.17971, 129.07661);

            const options = {
                center: position, // 위치
                level: 5 // 배율. 크면 클수록 작게 나온다.
            };

            // Map도 (a,b) 2개 들어감
            state.map = new window.kakao.maps.Map(container, options);

            // 위치 표시하기 위한 marker 필요
            const markerOptions = {
                map: state.map,
                position: position
            };

            state.marker = new window.kakao.maps.Marker(markerOptions);
        };

        const handleMarker = () => {
            // for문을 어디에서 돌려야 하는지 아직 익숙하지 않음..
            // 냅다 변수안에서 돌리려고 하지 말고 함수 내에서 돌리고 그안에서 다시 변수 선언하면 되는구나!
            for (let tmp of state.position) {
                const position = new window.kakao.maps.LatLng(tmp.lat, tmp.lng);

                const markerOptions = {
                    map: state.map,
                    position: position
                };

                state.marker = new window.kakao.maps.Marker(markerOptions);
            }
        };



        const content = <div class="wrap">
                <div class="info"> 
                    <div class="title">
                        카카오 스페이스닷원
                        <div class="close" onclick="closeOverlay()" title="닫기"></div>
                    </div>
                    <div class="body"> 
                        <div class="img">
                            <img src="https://cfile181.uf.daum.net/image/250649365602043421936D" width="73" height="70" /> 
                       </div> 
                        <div class="desc"> 
                            <div class="ellipsis">제주특별자치도 제주시 첨단로 242</div> 
                            <div class="jibun ellipsis">(우) 63309 (지번) 영평동 2181</div> 
                            <div><a href="https://www.kakaocorp.com/main" target="_blank" class="link">홈페이지</a></div> 
                        </div> 
                    </div> 
                </div>    
            </div>



        //////// 오버레이..
        const overlay = new window.kakao.maps.CustomOverlay({
            content: content,
            map: state.map,
            position: state.marker.getPosition()       
        });

        // 마커를 클릭했을 때 커스텀 오버레이를 표시합니다
       window.kakao.maps.event.addListener(state.marker, 'click', function() {
            overlay.setMap(state.map);
        });

        // 커스텀 오버레이를 닫기 위해 호출되는 함수입니다 
        function closeOverlay() {
            overlay.setMap(null);     
        }

        return {
            state,
            handleMarker,
            closeOverlay
        };
    }
};
</script>

<style lang="css" scoped></style>
