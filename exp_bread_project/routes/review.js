var express = require('express');
var router = express.Router();
var path = require('path');

// 시간 포맷 변경
var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');

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
    const { bakery_id, writer, point, content } = req.body; 
    // console.log("이미지 파일 정보", req.files);
    try{
        const review = Review({
            bakery_id,
            writer,
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
        // const page = Number(req.query.page); // 1
        const query = { bakery_id: Number(req.query.bakery) };
        const project = { 
            'images.filedata' : 0,
            'images.filename' : 0,
            'images.filesize' : 0,
            'images.filetype' : 0,
        } 
        const result = await Review.find(query, project)
                                   .sort({ _id : -1 }) // 정렬
                                //    .skip( (page-1)*10 ) // 스킵
                                //    .limit( 10 ); // 조회할 개수
 
        // console.log("리뷰 조회 결과", result);

        for(let tmp of result) {
            tmp.regdate1 = moment(tmp.regdate).tz('Asia/Seoul').format("YYYY-MM-DD HH:mm:ss");
        //     tmp.imageurl = `/api/review/image?name=${tmp.name}`;
        // console.log("regdate는 받나", tmp.regdate);
        console.log("regdate1은 받나", tmp.regdate1);
        }
        

        // 페이지네이션용 전체 개수(검색어가 포함된 개수)
        const total = await Review.countDocuments(query);

        return res.send({ status : 200, total : total, result : result });
    }

    catch(e){
        console.error(e); 
        return res.send({ status : -1, result : e });
    }

});

// 리뷰 수정 => 127.0.0.1:3000/api/review/update?_id=15
// 수정 => 조건을 기존데이터 읽은다음 변경항목 대체 => 저장
// router.put('/update', async function(req, res, next) {
//     try {
//         const query     = { _id : Number(req.query._id) };
//         const obj       = await Board.findOne(query);
//         obj.content     = req.body.content;
//         obj.point       = req.body.point;
//         obj.images = req.files.map(file => ({
//             filedata : file.buffer,
//             filename : file.filename,
//             filetype : file.mimetype,
//             filesize : file.size,
//             imageurl : `${req.protocol}://${req.get('host')}/api/review/image?name=${file.filename}`
//         }))

//         const result = await obj.save();
//         if(result !== null) {
//             return res.send({status : 200});
//         }
//         return res.send({status : 0});
//     }
//     catch(e) {
//         console.error(e);
//         return res.send({status : -1, result : e });
//     }
// });

// 리뷰 갯수, 상점 평점 조회
router.get('/grade', async function(req, res, next) {
    try{
        // 리뷰 갯수
        const reviewCount = await Review.countDocuments({
            // $nor: [{ deleted: true }],
            bakery_id: Number(req.query.bakery),
        })
        // console.log("리뷰갯수", reviewCount);

        // 별점 합
        const pointSum = await Review.aggregate([
            { $match: { bakery_id: Number(req.query.bakery )} },
            { $group: { _id: "$bakery_id", totalPoints: { $sum: "$point" } } }
        ])
        // console.log("별점 합", pointSum[0].totalPoints);

        // 평점
        const grade = Number(pointSum[0].totalPoints)/Number(reviewCount);
        // console.log("평점", grade);
        
        return res.send({ status : 200, result : {reviewCount, grade} });
    }

    catch(e){
        console.error(e); 
        return res.send({ status : -1, result : e });
    }

});


module.exports = router;