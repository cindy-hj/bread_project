var mongoose = require('mongoose');
var sequence = require('mongoose-sequence')(mongoose);

var BookmarkSchema = new mongoose.Schema({
    _id           : { type : Number }, // 글번호, 기본키
    bakeryId     : { type : Number, default : 0 }, // 빵집번호 
    bakeryName   : { type : String, default : ''}, // 빵집 이름
    email         : { type : String, default : ''}, // 회원
    isBookmarked  : { type : Boolean, default : false }, // 즐겨찾기 여부
    // regdate       : { type : Date,   default : Date.now}, // 등록일자
    // regdate1      : { type : Date,   default : '' }, // 시간 포맷 변경
});

BookmarkSchema.plugin(sequence, {
    id          : 'SEQ_BOOKMARK_NO', // counters에 id값
    inc_field   : '_id', // 스키마 값
    start_seq   : 1 // 시퀀스 시작값
});

module.exports = mongoose.model('bookmark', BookmarkSchema)