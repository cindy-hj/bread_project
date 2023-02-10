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

// 회원 가입 => 127.0.0.1:3000/api/bakery/join.json
router.post('/join.json', upload.single("file"), async function(req, res, next) {
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




module.exports = router;