var express = require('express');
var router = express.Router();
var path = require('path');

// 시간 포맷 변경
// var moment = require('moment');
// require('moment-timezone');
// moment.tz.setDefault('Asia/Seoul');

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


module.exports = router;