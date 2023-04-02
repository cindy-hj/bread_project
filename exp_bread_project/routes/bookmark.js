var express = require('express');
var router = express.Router();

// 모델 객체
var Bookmark = require('../models/bookmarkmodel');


// 즐겨찾기 조회
router.get('/select', async function(req, res, next) {
    try{
        const query = { bakeryId : Number(req.query.bakeryId) };
        if (req.query.email) { // 특정 회원의 즐겨찾기 조회
            query.email = req.query.email;
        }
        const result = await Bookmark.find(query)
        // console.log("최초 즐겨찾기 했었나", result.length);

        const bakeryResult = result.filter(obj => obj.isBookmarked === true);
        // console.log("즐겨찾기 한 객체", bakeryResult);
        const bakeryCount = bakeryResult.length;
        // console.log("빵집별 즐겨찾기 수", bakeryCount)

        if(result.length) { // 빵집 입장에서도 어떤 회원도 즐겨찾기 안했다면 값을 받아올 필요가 없음
            return res.send({ status : 200, bakeryCount, result });        
        }
        return res.send({ status : 0, result })
    }

    catch(e){
        console.error(e); 
        return res.send({ status : -1, result : e });
    }

});

// 즐겨찾기 최초 추가
router.post('/insert', async(req, res, next) => {
    const { bakeryId, bakeryName, email } = req.body;
    try{
        const bookmark = Bookmark({
            bakeryId,
            bakeryName,
            email, 
            isBookmarked: true,  
        });    
        const result = await bookmark.save();

        if(result !== null) {
            return res.send({ status : 200, isBookmarked : true });
        }
        return res.send({ status : 0 });
    } catch(e) {
        console.error(e);
        return res.send({ status : -1, result : e });
    }
});

// 즐겨찾기 여부 변경 -> isBookmarked 값을 변경시킴
router.put('/update', async function(req, res, next) {
    try {
        const query = { bakeryId : Number(req.query.bakeryId), email : req.query.email };
        const obj   = await Bookmark.findOne(query);

        obj.isBookmarked = req.body.isBookmarked;

        const result = await obj.save();
        console.log("즐찾여부 변경", result);
        if(result !== null) {
            return res.send({status : 200});
        }
        return res.send({status : 0});
    }
    catch(e) {
        console.error(e);
        return res.send({status : -1, result : e });
    }
});


module.exports = router;