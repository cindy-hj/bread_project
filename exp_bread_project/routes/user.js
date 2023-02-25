var express = require('express');
var router = express.Router();

// 시간 포맷 변경
var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');

// 파일 첨부
var multer = require('multer')
var upload = multer({storage : multer.memoryStorage()});

// 모델 객체
var User = require('../models/usermodel');

// 로그인시 이용할 jwt
const jwt = require('../utils/jwt_util');
const redisClient = require('../utils/redis');


// 회원 가입 => 127.0.0.1:3000/api/bakery/join.json
router.post('/join.json', async function(req, res, next) {
    try{
        const user = new User();
        user.email = req.body.email;
        user.name = req.body.name;
        user.address = req.body.address;
        user.detailaddress = req.body.detailaddress;
        user.gender = req.body.gender;
        user.password = req.body.password;
        user.isadmin = false; // 관리자유무 기본 false, 관리자 등록시 DB에 직접 true 입력

        const result = await user.save();

        if(result !== null) {
            return res.send({ status : 200 });
        }
        return res.send({ status : 0 });
    } catch(e) {
        console.error(e);
        return res.send({ status : -1, result : e });
    }
});

// 로그인 => 127.0.0.1:3000/api/bakery/login.json
router.post('/login.json', async (req, res) => {
    // 로그인을 할때 아이디와 비밀번호를 받는다
    const query = { email: req.body.email };
    const result = await User.findOne(query);

    if (result === null) {
        return res.json({
            loginSuccess: false,
            message: "존재하지 않는 아이디입니다.",
        });
    } else {
        result.comparePassword(req.body.password)
              .then((isMatch) => {
                    if(!isMatch) {
                        return res.json({
                            loginSuccess: false,
                            message: "비밀번호가 일치하지 않습니다.",
                        });
                    }
                // 비밀번호 일치시
                const accessToken = jwt.sign(jwt.user);


              })
    }
})




module.exports = router;