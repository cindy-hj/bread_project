var mongoose = require('mongoose');
var sequence = require('mongoose-sequence')(mongoose);

var UserSchema = new mongoose.Schema({
    _id             : { type: Number }, // 회원번호, 기본키
    email           : { type: String, default: '' }, // 이메일
    name            : { type: String, default: '' }, // 이름
    address         : { type: String, default: '' }, // 주소
    detailAddress   : { type: String, default: '' }, // 상세주소
    extraAddress    : { type: String, default: '' }, // 상세주소
    gender          : { type: String, default: '' }, // 성별
    password        : { type: String, default: '' }, // 비밀번호
    
    reviewCount     : { type: Number, default: 0 }, // 리뷰횟수????????????
    bookmarkBakery  : { type: Object, default: {} }, // 즐겨찾기 한 빵집
    joinDate        : { type: Date, default: Date.now }, // 가입일자
    withdrawalDate  : { type: Date, default: '' }, // 탈퇴일자
    
    fileData        : { type: Buffer, default: null }, // 파일데이터
    fileName        : { type: String, default: '' }, // 파일명
    fileType        : { type: String, default: '' }, // 파일종류
    fileSize        : { type: Number, default: 0 }, // 파일크기
    imageUrl        : { type: String, default: '' }, // 유저프로필사진 URL
    
    isAdmin         : { type: Boolean, default: false }, // 관리자유무
});

UserSchema.plugin(sequence, {
    id          : 'SEQ_USER_NO', // counters에 id값
    inc_field   : '_id', // 스키마 값
    start_seq   : 1 // 시퀀스 시작값
});

module.exports = mongoose.model('user', UserSchema)