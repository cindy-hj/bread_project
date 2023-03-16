// jwt
const jwt = require('jsonwebtoken');
require('dotenv').config();

// redis
// const { promisify } = require('util'); // 비동기로 돌리려는 함수를 promise로 감싸주지 않고 사용 가능
// const redisClient = require('./redis_util');

var User = require('../models/usermodel');


module.exports = {
    // email값으로 user를 찾아서 여기에서 isAdmin 값을 넣어줘야 access와 refresh가 달라짐
    sign: async(user) => { // access token 발급
        const email = { email: user.email }
        const userOne = await User.findOne(email);

        const payload = { // access token에 들어갈 payload
            email: userOne.email,
            isAdmin: userOne.isAdmin,
        };

        return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
            expiresIn: process.env.JWT_ACCESS_TIME, // 유효기간
        });
    },
    verify: (token) => { // access token 검증
        let decoded = null;
        try {
            decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return {
                loginSuccess: true,
                email: decoded.email,
                isAdmin: decoded.isAdmin,
            };
        } catch (err) {
            return {
                loginSuccess: false,
                message: err.message,
            };
        }   
    },
    refresh: (user) => { // refresh token 발급
        const payload = { // refresh token에 들어갈 payload
            email: user.email,
        };

        return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
            expiresIn: process.env.JWT_REFRESH_TIME,
        });
    },

    refreshVerify: (token) => { // refresh token 검증
        let decoded = null;
        try {
            decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return {
                loginSuccess: true,
                email: decoded.email,
            };
        } catch (err) {
            return {
                loginSuccess: false,
                message: err.message,
            };
        }   
    },

    //////////////////////////////////////redis 사용시
    // refreshVerify: async (token, email) => { // refresh token 검증
    //     // redis 모듈은 기본적으로 promise를 반환하지 않으므로 promisify를 이용하여 promise를 반환 하도록함
    //     const getAsync = promisify(redisClient.get).bind(redisClient);

    //     try {
    //         const data = await getAsync(email); // refresh token 가져오기
    //         if(token === data) {
    //             try {
    //                 jwt.verify(token, secret);
    //                 return true;
    //             } catch(err) {
    //                 return false;
    //             }
    //         } else {
    //             return false;
    //         }
    //     } catch(err) {
    //         return false;
    //     }
    // },

};



