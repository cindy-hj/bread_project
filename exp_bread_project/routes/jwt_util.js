// jwt를 위한 유틸함수
const { promisify } = require('util'); // 비동기로 돌리려는 함수를 promise로 감싸주지 않고 사용 가능
const jwt = require('jsonwebtoken');
const redisClient = require('./redis');
const secret = process.env.SECRET; // 환경변수...?

module.exports = {
    sign: (user) => { // access token 발급
        const payload = { // access token에 들어갈 payload
            email: user.email,
            isAdmin: user.isAdmin,
        };

        return jwt.sign(payload, secret, { // secret으로 sign하여 발급하고 return
            algorithm: "HS256", // 암호화 알고리즘
            expiresIn: "1h", // 유효기간
        });
    },
    verify: (token) => { // access token 검증
        let decoded = null;
        try {
            decoded = jwt.verify(token, secret);
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
    refresh: () => { // refresh token 발급
        return jwt.sign({}, secret, { // refresh token은 payload 없이 발급
            algorithm: "HS256",
            expiresIn: "14d",
        });
    },
    refreshVerify: async (token, userEmail) => { // refresh token 검증
        // redis 모듈은 기본적으로 promise를 반환하지 않으므로 promisify를 이용하여 promise를 반환 하도록함
        const getAsync = promisify(redisClient.get).bind(redisClient);

        try {
            const data = await getAsync(userEmail); // refresh token 가져오기
            if(token === data) {
                try {
                    jwt.verify(token, secret);
                    return true;
                } catch(err) {
                    return false;
                }
            } else {
                return false;
            }
        } catch(err) {
            return false;
        }
    },

};



