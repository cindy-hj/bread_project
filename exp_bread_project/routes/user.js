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
var jwt = require('./jwt_util');
var redisClient = require('./redis');

// access token
// const jwt = require('jsonwebtoken');

// 회원 가입 => 127.0.0.1:3000/api/bakery/join.json
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

// 로그인 => 127.0.0.1:3000/api/bakery/login.json
router.post('/login.json', async (req, res) => {
    const query = { email: req.body.email };
    const result = await User.findOne(query);

    if (result === null) {
        return res.json({
            status: 0,
            loginSuccess: false,
            message: "존재하지 않는 아이디입니다.",
        });
    } else {
        const check = await bcrypt.compare(req.body.password, result.password)
        if(check) {
            
    console.log("입력한비밀번호", req.body.password);
    console.log("데이터비밀번호", result.password)
            return res.send({ // client에 토큰 모두를 반환
                status :200,
                loginSuccess: true,
                // data: {
                //     accessToken,
                //     refreshToken,
                // },
                
            });
        } else {
            return res.send({
                status: -1,
                loginSuccess: false,
                message: "비밀번호가 일치하지 않습니다.",
            });
        }
    }
})

// let token;
    // try {
    //     token = jwt.sign(
    //         { userId: newUser._id, email: newUser.email },
    //         "!+$)%^sicIIHDKnvk$^",
    //         { expiresIn: "1h" },
    //     );
    // } catch (err) {
    //     const error = new Error("토큰 발생 오류");
    //     return next(error);
    // }
    // res.status(201)
    //     .send({
    //         joinSuccess: true,
    //         data: { 
    //             userId: newUser._id,
    //             email: newUser.email,
    //             token: token,
    //         },
    //     });


        // .then((isMatch) => {
        //     if(!isMatch) {
                
        //     }
        // 비밀번호 일치시
        // const accessToken = jwt.sign(jwt.user);
        // const refreshToken = jwt.refresh();

        // 발급한 refresh token을 redis에 key를 user의 id로 저장
        // redisClient.set(jwt.user.email, refreshToken);




//////////////////////////////////////////////access token만 발행


// // 로그인 => 127.0.0.1:3000/api/bakery/login.json
// router.post('/login.json', async (req, res, next) => {
//     let { email, password } = req.body;
    
//     let existingUser;
//     try {
//         existingUser = await User.findOneAndDelete({ email: email });
//     } catch {
//         const error = new Error("회원을 찾지 못했습니다.");
//         return new(error);
//     }
//     if(!existingUser || existingUser.password != password) {
//         const error = new Error("아이디나 비밀번호가 틀렸습니다.");
//         return next(error);
//     }
//     let token;
//     try {
//         token = jwt.sign(
//             { userId: existingUser._id, email: existingUser.email },
//             "!+$)%^sicIIHDKnvk$^",
//             { expireIn: "1h"},
//         );
//     } catch(err) {
//         console.log(err);
//         const error = new Error("토큰 발생 실패");
//         return next(error);
//     }
//     res.status(200)
//         .json({
//             loginSuccess: true,
//             data: {
//                 userId: existingUser._id,
//                 email: existingUser.email,
//                 token: token,
//             },
//         });
// });

// router.get('/accessResource', (req, res)=>{  
//     const token = req.headers.authorization.split(' ')[1]; 
//     //Authorization: 'Bearer TOKEN'
//     if(!token)
//     {
//         res.status(200).json({success:false, message: "Error! Token was not provided."});
//     }
//     //Decoding the token
//     const decodedToken = jwt.verify(token,"secretkeyappearshere" );
//     res.status(200).json({
//         success:true, 
//         data: {
//             userId:decodedToken.userId,
//             email:decodedToken.email
//         },
//     });   
// });

module.exports = router;