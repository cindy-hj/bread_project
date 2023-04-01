var express = require('express');
var router = express.Router();

// 모델 객체
var Bookmark = require('../models/bookmarkmodel');


// 즐겨찾기 조회
router.get('/select', async function(req, res, next) {
    try{
        const query = { bakeryId : Number(req.query.bakeryId), email : req.query.email };
        const result = await Bookmark.find(query)
        console.log("즐겨찾기 조회", result.length);
        if(result.length) {
            return res.send({ status : 200, result });        
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