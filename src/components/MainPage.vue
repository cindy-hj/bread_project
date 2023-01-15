<template>
    <div class="container">
        <header>
            <img src="../assets/img/bread_main.jpg" style="height: 400px; width: 100%;"/>
        </header>
        <section>
            <div class="sectionA">
                <h3> 지역별 빵집</h3>
                <vueper-slides
                    class="no-shadow"
                    :visible-slides="3"
                    :slide-ratio="1 / 4"
                    :dragging-distance="70"
                >
                    <vueper-slide v-for="i of regionalList" :key="i" :title="i.toString()" />
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
                    <ul>
                        <li>1등</li>
                        <li>2등</li>
                        <li>3등</li>
                        <li>4등</li>
                        <li>5등</li>
                    </ul>
            </div>
        </section>
        
    </div>
</template>

<script>
import { VueperSlides, VueperSlide } from 'vueperslides'
import 'vueperslides/dist/vueperslides.css'

export default {
    components: { VueperSlides, VueperSlide },

    setup () {
        const regionalList = ['부산진구', '남구', '해운대구', '중구', '동래구', '금정구'];
        



        const handleKeyword1 = () =>{
            document.querySelector('.keywordContainer').style.transform = 'translate(0)'
        }
        const handleKeyword2 = () =>{
            document.querySelector('.keywordContainer').style.transform = 'translate(-70vw)'
        }
        const handleKeyword3 = () =>{
            document.querySelector('.keywordContainer').style.transform = 'translate(-140vw)'
        }
        const handleKeyword4 = () =>{
            document.querySelector('.keywordContainer').style.transform = 'translate(-210vw)'
        }
        
        return {
            regionalList,
            handleKeyword1,
            handleKeyword2,
            handleKeyword3,
            handleKeyword4,
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
section{
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
</style>