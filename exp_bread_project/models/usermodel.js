var mongoose = require('mongoose');
var sequence = require('mongoose-sequence')(mongoose);

const bcrypt = require('bcrypt'); // 암호화하기 위해 불러옴
const saltRounds = 10; // salt 돌리는 횟수 

var UserSchema = new mongoose.Schema({
    _id             : { type: Number }, // 회원번호, 기본키
    email           : { type: String, default: '' }, // 이메일
    name            : { type: String, default: '' }, // 이름
    address         : { type: String, default: '' }, // 주소
    detailAddress   : { type: String, default: '' }, // 상세주소
    extraAddress    : { type: String, default: '' }, // 상세주소
    gender          : { type: String, default: '' }, // 성별
    password        : { type: String, default: '' }, // 비밀번호
    
    reveiwCount     : { type: Number, default: 0 }, // 리뷰횟수
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

// Mongoose의 pre 매소드는 save 매소드가 실행되기 전에 실행됨
// save 되기 전 hashing하기 위해 pre 매소드 내부에 hash function 작성
UserSchema.pre("save", function(next){
    const user = this; // UserSchema

    // password 변경될때 hashing 실행
    if(user.isModified('password')) {
        // genSalt: salt 생성
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if(err) return next(err);
            
            bcrypt.hash(user.password, salt, function(err, hashedPassword) {
                if (err) return next(err);

                // 에러없이 성공하면 plain text(user.password)를 hashing된 hashedPassword로 교체
                user.password = hashedPassword;
                // hashing 끝난 후 save로
                next();
            })
        })
    } else {
        // password 변경 되지 않았을때 바로 save로
        next();
    }
}) 

UserSchema.methods.comparePassword = (plainPassword) => {
    return bcrypt
        .compare(plainPassword, this.password)
        .then((isMatch) => isMatch)
        .catch((err) => err);
};

module.exports = mongoose.model('user', UserSchema)