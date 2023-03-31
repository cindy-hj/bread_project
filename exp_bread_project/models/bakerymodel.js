var mongoose = require('mongoose');
var sequence = require('mongoose-sequence')(mongoose);

var BakerySchema = new mongoose.Schema({
    _id           : { type : Number }, // 글번호, 기본키
    name          : { type : String, default : '' }, // 가게명
    address       : { type : String, default : '' }, // 주소(구)
    addressdetail : { type : String, default : '' }, // 주소 상세
    phone         : { type : String, default : '' }, // 전화번호
    parking       : { type : String, default : '' }, // 주차공간
    menu          : { type : String, default : '' }, // 메뉴
    price         : { type : String, default : '' }, // 가격
    holiday       : { type : String, default : '' }, // 휴일
    point         : { type : Number, default : 0 }, // 평점
    hit           : { type : Number, default : 0 }, // 조회수
    bookmarkcount : { type : Number, default : 0 }, // 즐겨찾기수
    strength      : { type : String, default : '' }, // 강점
    
    lat : { type : String, default : '' }, // 위도
    lng : { type : String, default : '' }, // 경도
    
    regdate : { type : Date,   default : Date.now }, // 등록일자
    regdate1 : { type : Date,   default : '' }, // 시간 포맷 변경

    filedata : { type : Buffer, default : null }, // 파일데이터
    filename : { type : String, default : '' }, // 파일명
    filetype : { type : String, default : '' }, // 파일 종류
    filesize : { type : Number, default : 0  }, // 파일 크기
    imageurl : { type : String, default : '' }, // 이미지 URL
});

BakerySchema.plugin(sequence, {
    id          : 'SEQ_BAKERY_NO', // counters에 id값 
    inc_field   : '_id', // 위의 컬럼중에서 시퀀스 사용할 것
    start_seq   : 1 // 시퀀스 시작값
});

module.exports = mongoose.model('bakery', BakerySchema)


