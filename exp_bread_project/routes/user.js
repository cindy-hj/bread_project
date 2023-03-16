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

// 비밀번호 암호화
const bcrypt = require('bcrypt'); 
const saltRounds = 10;

// jwt
const jwt = require('./jwt_util');
// const redisClient = require('./redis_util'); // refresh token을 redis에 저장
let refreshToken = null; // refresh Token을 서버에 저장

// 회원 가입 => 127.0.0.1:3000/api/user/join.json
router.post('/join.json', async(req, res, next) => {
    const { email, name, address, detailAddress, extraAddress, gender, password } = req.body;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    try{
        const user = User({
            email, 
            name, 
            address, 
            detailAddress, 
            extraAddress, 
            gender, 
            password: hashedPassword,
            isAdmin: false,  
        });    
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

// 로그인 => 127.0.0.1:3000/api/user/login.json
router.post('/login.json', async (req, res) => {
    const email = { email: req.body.email };
    const result = await User.findOne(email);
    
    if (result === null) {
        return res.json({
            status: 0,
            loginSuccess: false,
            message: "존재하지 않는 아이디입니다.",
        });
    } else {
        const check = await bcrypt.compare(req.body.password, result.password)
        if(check) {
            const accessToken = await jwt.sign(email);
            refreshToken = jwt.refresh(email);
            console.log("억세스", accessToken);
            console.log("리프레시", refreshToken);

            // redisClient.set(query.toString(), JSON.stringify({token: refreshToken}));
            
            return res.cookie("ACCESS", accessToken, {httpOnly : true})
                        .status(200)
                        .json({
                            loginSuccess: true,
                            status: 200
                        })
        } else {
            return res.send({
                status: -1,
                loginSuccess: false,
                message: "비밀번호가 일치하지 않습니다.",
            });
        }
    }
})

// 토큰 유효성 체크
router.get('/auth.json', async(req, res, next)=> {
    const accessToken = req.cookies.ACCESS;
    if(!accessToken) {
        return res.status(401).json({message : "access token을 찾을 수 없습니다."})
    }

    try {
        const decoded = jwt.verify(accessToken);
        // access token 유효
        if(decoded.loginSuccess) {
            return res.status(200)
                        .json({
                            email : decoded.email,
                            isAdmin : decoded.isAdmin,
                            loginSuccess : decoded.loginSuccess,
                            status : 200,
                            message : decoded.message
                        });
        } else {
            // access token 만료
            console.log("리프레시", refreshToken);
            if(!refreshToken) {
                return res.status(401).json({message: "refresh token을 찾을 수 없습니다."})
            }

            try {
                const decoded = jwt.refreshVerify(refreshToken);
                const email = { email: decoded.email };
                console.log("리프레시디코디드", decoded);

                // refresh token 유효, 새로운 access token 생성
                if(decoded.loginSuccess) {
                    const accessToken = await jwt.sign(email);
                    return res.cookie("ACCESS", accessToken, {httpOnly : true})
                                .status(200)
                                .json({
                                    loginSuccess: true,
                                    status: 200
                                })
                } else { // refresh token 만료
                    return res.send({
                        status: 0,
                        loginSuccess: false,
                        message: "refresh token이 만료되었습니다.",
                    });
                }
            } catch(e) {
                console.error(e);
                return res.send({ status : -1, result : e });
            }
        }

    } catch(err) {
        res.status(401)
            .json({
                loginSuccess : false,
                message : "복호화 실패"
            })
    }

})

module.exports = router;