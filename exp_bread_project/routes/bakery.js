var express = require('express');
var router = express.Router();

// 시간 포맷 변경
// var moment = require('moment');
// require('moment-timezone');
// moment.tz.setDefault('Asia/Seoul');

// 파일 첨부 
var multer = require('multer') 
var upload = multer({storage : multer.memoryStorage()});

// 모델 객체
var Bakery   = require('../models/bakerymodel');

// 빵집 등록 => 127.0.0.1:3000/api/bakery/insert
router.post('/insert', upload.single("file"), async function(req, res, next) {
    try{
        const { name, address, addressdetail, phone, parking, menu, price, holiday, point, hit, 
            bookmarkcount, strength, lat, lng } = req.body;
        const bakery = Bakery({ 
            name, 
            address, 
            addressdetail, 
            phone,
            parking, 
            menu,
            price, 
            holiday,
            point,
            hit,
            bookmarkcount,
            strength,
            lat : Number(lat),
            lng : Number(lng),
            
            filedata : req.file.buffer,
            filename : req.file.originalname,
            filetype : req.file.mimetype,
            filesize : req.file.size,
        });   

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

// 이미지URL만들기 => http://127.0.0.1:3000/api/bakery/image?_id=3
router.get('/image', async function (req, res, next) {
    try {
      const query = { _id: Number(req.query._id) };
      const project = { filedata: 1, filetype: 1 };
      const result = await Bakery.findOne(query, project);
      //console.log(result);
  
      res.contentType(result.filetype);
  
      return res.send(result.filedata);
  
    } catch (e) {
      console.error(e);
      return res.send({ status: -1, result: e });
    }
  });

// 지역별 빵집 조회 => http://127.0.0.1:3000/api/bakery/regional?page=1&region=지역
router.get('/regional', async function(req, res, next) {
    try{
        const page = Number(req.query.page); // 1
        const region = req.query.region; // 지역
        
        // 전체 데이터에서 제목이 검색어가 포함된 것 가져오기
        const query = { address : new RegExp(region, 'i') }; // RegExp는 포함된 것을 찾아내는 정규식, i는 대소문자 무시하는 flag
        const project = { 
            filedata: 0, 
            filename: 0, 
            filesize: 0, 
            filetype: 0,
        } 
        const result = await Bakery.find(query, project)
                                   .sort({ _id : -1 }) // 정렬
                                   .skip( (page-1)*10 ) // 스킵
                                   .limit( 10 ); // 조회할 개수
 
        // 이미지 URL을 생성은 했으나 file값은 받아오지 않았으므로 file값을 따로 받아오는 get을 만들어야함
        // 합쳐서 하지 않는이유? 다른 곳에서도(ex:상점 1개 조회) 이미지를 불러오는 get을 쓸 수 있으므로 그때마다 file값 불러오기 번거로우니까 모듈로 분리
        for(let tmp of result) {
            // format("YYYY-MM-DD DD:mm:ss")
            // tmp.regdate1 = moment(tmp.regdate).format("YYYY-MM-DD");
            tmp.imageurl = `/api/bakery/image?_id=${tmp._id}&ts=${Date.now()}`;
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

// 빵집 상세페이지 조회 http://127.0.0.1:3000/api/bakery/select?bakery=빵집
router.get('/select', async function(req, res, next) {
    try{
        const bakery = req.query.bakery; 
        const query = { name : new RegExp(bakery, 'i') };
        const project = { 
            filedata: 0, 
            filename: 0, 
            filesize: 0, 
            filetype: 0,
        } 
        // console.log("베이커리", bakery);
        const result = await Bakery.findOne(query, project);
        // console.log("결과",result);
        // result.regdate1 = moment(result.regdate).format("YYYY-MM-DD");
        result.imageurl = `/api/bakery/image?_id=${result._id}&ts=${Date.now()}`;

        return res.send({ status : 200, result : result });
    } catch(e){
        console.error(e); 
        return res.send({ status : -1, result : e });
    }
});


  


module.exports = router;