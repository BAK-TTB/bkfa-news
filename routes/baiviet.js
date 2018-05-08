const Router = require('express-promise-router')
var moment = require('moment');
const router = new Router()
const pool = require('../model')
var bodyParser = require('body-parser')
const validator = require('express-validator');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
router.use(bodyParser.urlencoded({ extended: false }))

/* GET users listing. */
router.get('/danhsach', function(req, res, next) {
    (async() => {
        const client = await pool.connect()
        let error = req.flash('error');
        let success = req.flash('success')
        try {
            // const theloai = await client.query('SELECT * FROM tintuc')
            const loaitin = await client.query('SELECT * FROM loaitin')
            const result = await client.query('SELECT * FROM baiviet bv, loaitin lt WHERE bv.idloaitin = lt.idloaitin')
            res.render('admin/baiviet/danhsach',{
                baiviet: result.rows,
                loaitin: loaitin.rows,
                title: 'News_TTB Website',
                error: error,
                success: success
            });
        } finally {
            client.release()
        }
    })().catch(e => console.log(e.stack))
});


router.post('/sua/:id', function(req, res, next) {
    req.checkBody('suaten', 'Tên loại tin không hợp lệ, vui lòng kiểm tra lại').notEmpty();
    req.checkBody('suatheloai', 'Tên thể loại không hợp lệ, vui lòng kiểm tra lại').notEmpty();
    let errors = req.validationErrors();

    if(errors){
        let messages = [];
        errors.forEach(function(error){
            messages.push(error.msg);
        });
        // res.send(messages);
        req.flash('error', messages);
        res.redirect('back');
    }else {
        const id = req.params.id;
        const ten = req.body.suaten;
        const idtheloai = req.body.suatheloai;
        (async() => {
            const client = await pool.connect()
            try {
                await client.query("UPDATE loaitin SET tenloaitin = '"+ ten +"', idtheloai = '" + idtheloai + "' WHERE idloaitin = " + id)
                req.flash('success', 'Sửa thành công');
                res.redirect("/loaitin/danhsach")
            } finally {
                client.release()
            }
        })().catch(e => console.log(e.stack))
    }
});

router.get('/them', function(req, res, next){
    (async() => {
        const client = await pool.connect()
        let error = req.flash('error');
        let success = req.flash('success')
        try {
            const theloai = await client.query('SELECT * FROM theloai')
            const loaitin = await client.query('SELECT * FROM loaitin')
            res.render('admin/baiviet/them',{
                theloai: theloai.rows,
                loaitin: loaitin.rows,
                title: 'News_TTB Website',
                error: error,
                success: success
            });
        } finally {
            client.release()
        }
    })().catch(e => console.log(e.stack))
});

router.post('/thembv', function(req, res, next) {
    req.checkBody('tieude', 'Tiêu đề bài viết không hợp lệ, vui lòng kiểm tra lại!').notEmpty();
    req.checkBody('tacgia', 'Bài viết của ai?').notEmpty();
    req.checkBody('loaitin', 'Chưa chọn loại tin!').notEmpty();
    req.checkBody('tomtat', 'Tóm tắt bài viết không hợp lệ, vui lòng kiểm tra lai!').notEmpty();
    req.checkBody('noidung', 'Nội dung bài viết không hợp lệ, vui lòng kiểm tra lai!').notEmpty();
    req.checkBody('anh', 'Cần chọn ảnh chủ đề bài viết. OK.').notEmpty();
    let errors = req.validationErrors();
    if(errors){
        let messages = [];
        errors.forEach(function(error){
            messages.push(error.msg);
        });
        // res.send(messages);
        req.flash('error', messages);
        res.redirect('back');
    }else {
        const tieude = req.body.tieude;
        const tacgia = req.body.tacgia;
        const idloaitin = req.body.loaitin;
        const tomtat = req.body.tomtat;
        const noidung = req.body.noidung;
        const anh = req.body.anh;

        (async() => {
            const client = await pool.connect()
            try{
                const result = await client.query('SELECT MAX(idbaiviet) FROM baiviet')
                // console.log(result.rows[0].max)
                await client.query("INSERT INTO baiviet(idbaiviet, tacgia, tieude, tomtat, noidung, urlanh, luotxem, ngaydang, idloaitin) VALUES("+ result.rows[0].max +"+1, '" + tacgia + "', '" + tieude + "', '" + tomtat + "', '" + noidung + "', 'a.png', '0', '"+ moment().format() +"', '" + idloaitin + "')")
                req.flash('success', 'Thêm thành công');
                res.redirect("/admin/baiviet/them")
            } finally{
                client.release()
            }
        })().catch(e => console.log(e.stack))

    }
});

router.post('/xoa/:id', function(req, res, next) {
    const id = req.params.id;
    (async() => {
        const client = await pool.connect()
        try {
            await client.query("DELETE FROM loaitin WHERE idloaitin = " + id)
            req.flash('success', 'Xóa thành công')
            res.redirect("/loaitin/danhsach")
        } finally {
            client.release()
        }
    })().catch(e => console.log(e.stack))
});

module.exports = router

