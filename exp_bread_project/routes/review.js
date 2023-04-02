var express = require('express');
var router = express.Router();
var path = require('path');
const fs = require('fs');

// 시간 포맷 변경
var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

// 파일 첨부
var multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // 업로드된 파일을 저장할 폴더
    },
    filename: function(req, file, cb) {
        cb(null, Date.now()+file.originalname); // 파일 이름 설정
    }
});
const upload = multer({ storage : storage});

// 모델 객체
var Review = require('../models/reviewmodel');



// 리뷰 등록 => 127.0.0.1:3000/api/review/insert
router.post('/insert', upload.array('images'), async(req, res, next) => {
    const { bakery_id, writer, email, point, content } = req.body; 
    // console.log("이미지 파일 정보", req.files);
    try{
        const review = Review({
            bakery_id,
            writer,
            email,
            point,
            content,
            images : req.files.map(file => ({
                filedata : file.buffer,
                filename : file.filename,
                filetype : file.mimetype,
                filesize : file.size,
                imageurl : `${req.protocol}://${req.get('host')}/api/review/image?name=${file.filename}`
            }))
        }); 
        // console.log("정보 다받았나", review);
        const result = await review.save();

        if(result !== null) {
            return res.send({ status : 200 });
        }
        return res.send({ status : 0 });
    } catch(e) {
        console.error(e);
        return res.send({ status : -1, result : e });
    }
});

// 이미지 url => 27.0.0.1:3000/api/review/image?name=파일이름
router.get('/image', (req, res) => {
    // console.log("이미지url 받으러 들어오니");
    const filename = req.query.name;
    // console.log("파일이름 받았니", filename);
    res.sendFile(path.join(__dirname, '..', 'uploads', filename), function(err) {
        if(err) {
            console.log(err);
            res.status(500).send('파일 못보냄');
        } else {
            console.log('파일 보냄!');
        }
    });
})


// 리뷰 조회 => http://127.0.0.1:3000/api/review/select?page=1&bakery=빵집id
router.get('/select', async function(req, res, next) {
    try{
        const query = { bakery_id: Number(req.query.bakery), deleted: { $ne: true } };
        const page = Number(req.query.page); // 1
        const project = { 
            'images.filedata' : 0,
            'images.filename' : 0,
            'images.filesize' : 0,
            'images.filetype' : 0,
        } 
        const result = await Review.find(query, project)
                                   .sort({ _id : -1 }) // 정렬
                                   .skip( (page-1)*5 ) // 스킵
                                   .limit( 5 ); // 조회할 개수
 
        // console.log("리뷰 조회 결과", result);

        for(let tmp of result) {
            tmp.regdate1 = moment(tmp.regdate).format("YYYY-MM-DD HH:mm:ss");
            console.log("regdate는 받나", tmp.regdate);
            console.log("regdate1은 받나", tmp.regdate1);
        }
        

        // 페이지네이션용 전체 개수(검색어가 포함된 개수)
        const total = await Review.countDocuments({
            $nor: [{ deleted: true }],
            bakery_id: req.query.bakery,
        });

        return res.send({ status : 200, total : total, result : result });
    }

    catch(e){
        console.error(e); 
        return res.send({ status : -1, result : e });
    }

});

// 리뷰 한개 수정용 조회
router.get('/selectone', async function(req, res, next) {
    try{
        const query = { _id: Number(req.query.review) };
        const result = await Review.findOne(query)

        // const images = result.images;
        // const buffers = [];
        
        // for (const image of images) {
        //     const filename = image.filename;
        //     const buffer = await fs.promises.readFile(`./uploads/${filename}`);
        //     buffers.push(buffer);
        // }
        // console.log("버퍼",buffers);

        return res.send({ status : 200, result : result });
    }

    catch(e){
        console.error(e); 
        return res.send({ status : -1, result : e });
    }

});

// 리뷰 수정 => 127.0.0.1:3000/api/review/update?_id=15
// 수정 => 조건을 기존데이터 읽은다음 변경항목 대체 => 저장
router.put('/update', upload.array('images'), async function(req, res, next) {
    try {
        const query     = { _id : Number(req.query._id) };
        const obj       = await Review.findOne(query);
        console.log("obj를 못받아오나", obj); // 받아옴
        console.log("req를 못받아오나", req.body); // 못받아옴

        obj.content     = req.body.content;
        obj.point       = req.body.point;
        obj.images = req.files.map(file => ({
            filedata : file.buffer,
            filename : file.filename,
            filetype : file.mimetype,
            filesize : file.size,
            imageurl : `${req.protocol}://${req.get('host')}/api/review/image?name=${file.filename}`
        }))

        const result = await obj.save();
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

// 리뷰 삭제 -> deleted 값 true로 변경 후 저장
router.put('/delete', async function(req, res, next) {
    try {
        const query     = { _id : Number(req.query._id) };
        const obj       = await Review.findOne(query);
        obj.deleted     = req.body.deleted;

        const result = await obj.save();
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

// 상점별 리뷰 갯수, 상점 평점 조회
router.get('/grade', async function(req, res, next) {
    try{
        // 상점별 리뷰 갯수
        const reviewCount = await Review.countDocuments({
            $nor: [{ deleted: true }],
            bakery_id: Number(req.query.bakery),
        })

        // 별점 합
        const pointSum = await Review.aggregate([
            { $match: { bakery_id: Number(req.query.bakery )} },
            { $group: { _id: "$bakery_id", totalPoints: { $sum: "$point" } } }
        ])

        // 평점
        const gradeRaw = Number(pointSum[0].totalPoints)/Number(reviewCount);
        const grade = gradeRaw.toFixed(1); // 소숫점 첫째자리 까지 출력
        
        return res.send({ status : 200, result : {reviewCount, grade} });
    }

    catch(e){
        console.error(e); 
        return res.send({ status : -1, result : e });
    }

});


module.exports = router;