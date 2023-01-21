<template>
    <div class="container">
        <header>
            <img src="../assets/img/bread_main.jpg" style="height: 400px; width: 100%;"/>
        </header>
        <div class="contents">
            <div class="sectionA">
                <h3> 지역별 빵집</h3>
                <vueper-slides
                    class="no-shadow"
                    :visible-slides="3"
                    :slide-ratio="1 / 4"
                    :dragging-distance="70"
                >
                    <vueper-slide v-for="i of regionalList" :key="i" :title="i.title" :image="i.image" @click="handleRouter(i.title)"/>
                </vueper-slides>
            </div>

            <div class="sectionB">
                <h3>키워드별 빵집</h3>
                <div class="keywordContainer">
                    <div class="keywordBox">
                        <img src="../assets/img/bread_main.jpg" />
                    </div>
                    <div class="keywordBox">
                        <img src="../assets/img/bread1.jpg" />
                    </div>
                    <div class="keywordBox">
                        <img src="../assets/img/bread2.jpg" />
                    </div>
                    <div class="keywordBox">
                        <img src="../assets/img/bread3.jpg" />
                    </div>
                </div>
                <div class="keywordButton">
                    <el-button type="primary" plain @click="handleKeyword1">뷰맛집</el-button>
                    <el-button type="primary" plain @click="handleKeyword2">주차가능</el-button>
                    <el-button type="primary" plain @click="handleKeyword3">인테리어</el-button>
                    <el-button type="primary" plain @click="handleKeyword4">단체모임</el-button>
                </div>
                
            </div>
            <div class="sectionC">
                <h3>평점 높은 빵집</h3>
                <div class="topRatedContainer">
                    <div class="ratedLeft">
                        <div class="ratedBoxContainer">
                            <div class="ratedBox">
                                <img src="../assets/img/bread_main.jpg" />
                            </div>
                            <div class="ratedBox">
                                <img src="../assets/img/bread1.jpg" />
                            </div>
                            <div class="ratedBox">
                                <img src="../assets/img/bread2.jpg" />
                            </div>
                            <div class="ratedBox">
                                <img src="../assets/img/bread3.jpg" />
                            </div>
                        </div>
                    </div>
                    <div class="ratedRight">
                        <ul>
                            <li @click="handleRated1">1등</li>
                            <li @click="handleRated2">2등</li>
                            <li @click="handleRated3">3등</li>
                            <li @click="handleRated4">4등</li>
                            <li @click="handleRated5">5등</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { VueperSlides, VueperSlide } from 'vueperslides'
import 'vueperslides/dist/vueperslides.css'

export default {
    components: { VueperSlides, VueperSlide },

    setup () {

        const router = useRouter();

        const regionalList = [
        { title: '부산진구', image:'https://picsum.photos/500/300?image=12' },
        { title: '남구', image:'https://picsum.photos/500/300?image=11' },
        { title: '해운대구', image:'https://picsum.photos/500/300?image=10' },
        { title: '중구', image:'https://picsum.photos/500/300?image=9' },
        { title: '동래구', image:'https://picsum.photos/500/300?image=7' },
        { title: '금정구', image:'https://picsum.photos/500/300?image=6' }
        ];
        

        const handleKeyword1 = () => {
            document.querySelector('.keywordContainer').style.transform = 'translate(0)'
        }
        const handleKeyword2 = () => {
            document.querySelector('.keywordContainer').style.transform = 'translate(-70vw)'
        }
        const handleKeyword3 = () => {
            document.querySelector('.keywordContainer').style.transform = 'translate(-140vw)'
        }
        const handleKeyword4 = () => {
            document.querySelector('.keywordContainer').style.transform = 'translate(-210vw)'
        }


        const handleRated1 = () => {
            document.querySelector('.ratedBoxContainer').style.transform = 'translate(0)'
        }
        const handleRated2 = () => {
            document.querySelector('.ratedBoxContainer').style.transform = 'translate(-35vw)'
        }
        const handleRated3 = () => {
            document.querySelector('.ratedBoxContainer').style.transform = 'translate(-70vw)'
        }
        const handleRated4 = () => {
            document.querySelector('.ratedBoxContainer').style.transform = 'translate(-115vw)'
        }
        const handleRated5 = () => {
            document.querySelector('.ratedBoxContainer').style.transform = 'translate(-140vw)'
        }

        const handleRouter = (region) => {
            router.push({path:"/regional", query:{text:region}})
        }

        /api/bakery/select.json?page=${state.page}&text=${state.region}
        
        return {
            regionalList,
            handleKeyword1,
            handleKeyword2,
            handleKeyword3,
            handleKeyword4,
            handleRated1,
            handleRated2,
            handleRated3,
            handleRated4,
            handleRated5,
            handleRouter
        }
    }
}
</script>

<style lang="css" scoped>
*{
    margin: 0;
    padding: 0;
}
ul, li{
    list-style: none;
}
/* .container{
    position: fixed;
} */
.contents{
    width: 70vw;
    position: absolute;
    left: 50%;
    margin-left: -35vw;
}
.sectionA{
    background-color: bisque;
}

.sectionB{
    background-color: rgb(255, 186, 101);
    overflow: hidden;
}

.sectionC{
    background-color: rgb(255, 244, 231);
}

.keywordContainer{
    width: 280vw;
    transition: transform 1s;
}
.keywordBox{
    width: 70vw;
    float: left;
}
.keywordBox img{
    width: 500px;
    height: 400px;
}
.keywordButton{
    text-align: center;
}
.topRatedContainer{
    float: left;
}
.ratedLeft{
    width: 35vw;
    float: left;
    background-color: blueviolet;
    overflow: hidden;
}
.ratedBoxContainer{
    width: 140vw;
    float: left;
    background-color: aqua;
    transition: transform 1s;
}
.ratedBox{
    width: 35vw;
    float: left;
}
.ratedBox img{
    width: 100%;
}
.ratedRight{
    width: 35vw;
    float: left;
    background-color: aquamarine;
}

</style>