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
var Bakery   = require('../models/bakerymodel');

// 빵집 등록 => 127.0.0.1:3000/api/bakery/insert.json
router.post('/insert.json', upload.single("file"), async function(req, res, next) {
    try{
        // console.log('req.body=>', req.body);
        // console.log('req.file=>', req.file);

        const bakery    = new Bakery();
        bakery.name = req.body.name;
        bakery.address = req.body.address;
        bakery.addressdetail = req.body.addressdetail;
        bakery.phone = req.body.phone;
        bakery.parking = req.body.parking;
        bakery.menu = req.body.menu;
        bakery.price = req.body.price;
        bakery.holiday = req.body.holiday;
        bakery.point = req.body.point;
        bakery.hit = req.body.hit;
        bakery.bookmarkcount = req.body.bookmarkcount;
        bakery.lat = Number(req.body.lat);
        bakery.lng = Number(req.body.lng);
        bakery.strength = req.body.strength;
        bakery.filedata = req.file.buffer;
        bakery.filename = req.file.originalname;
        bakery.filetype = req.file.mimetype;
        bakery.filesize = req.file.size;
    
        const result = await bakery.save();
        
        if(result !== null) {
            return res.send({ status : 200 });
        }
        return res.send({ status : 0 });
    }
    catch(e){
        console.error(e); 
        return res.send({ status : -1, result : e });
    }
});

// 지역별 빵집 조회 => http://127.0.0.1:3000/api/bakery/select.json?page=1&region=''
router.get('/select.json', async function(req, res, next) {
    try{
        const text = req.query.region; // 검색어
        const page = Number(req.query.page); // 1
        
        // 전체 데이터에서 제목이 검색어가 포함된 것 가져오기
        const query = { address : new RegExp( text, 'i' ) }; // RegExp는 포함된 것을 찾아내는 정규식
        const project = { 
            filedata: 0, 
            filename: 0, 
            filesize: 0, 
            filetype: 0,
        } // 필요 없는거 빼면 속도 빨라진다!
        const result = await Bakery.find(query, project)
                                   .sort({ _id : -1 }) // 정렬
                                   .skip( (page-1)*10 ) // 스킵
                                   .limit( 10 ); // 조회할 개수
 
        // 목록에서 등록일, 이미지 URL 수동으로 생성하기
        for(let tmp of result) {
            // format("YYYY-MM-DD DD:mm:ss")
            tmp.regdate1 = moment(tmp.regdate).format("YYYY-MM-DD");
            tmp.imageurl = `/api/bakery.image?_id=${tmp._id}`;
        }

        // 페이지네이션용 전체 개수(검색어가 포함된 개수)
        const total = await Bakery.countDocuments(query);

        return res.send({ status : 200, total : total, result : result });
    }

    catch(e){
        console.error(e); 
        return res.send({ status : -1, result : e });
    }

});



module.exports = router;