const Router = require('express-promise-router')
const validator = require('express-validator');
const router = new Router()
const pool = require('../model')
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })
router.use(bodyParser.urlencoded({ extended: false }))

// Is Logged
function adminIsLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}

// Is not logged
function adminNotLoggedIn(req, res, next) {
    if (!req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}

/* GET users listing. */
router.get('/danhsach', adminIsLoggedIn, function(req, res, next) {
    (async() => {
        const client = await pool.connect()
        let error = req.flash('error');
        let success = req.flash('success')
        try {
            const result = await client.query('SELECT * FROM theloai')
            res.render('admin/theloai/danhsach',{
                theloai: result.rows,
                title: 'News_TTB Website',
                user : req.user,
                error: error,
                success: success
            });
        } finally {
            client.release()
        }
    })().catch(e => console.log(e.stack))
});


router.post('/sua/:id', adminIsLoggedIn, function(req, res, next) {
    req.checkBody('suaten', 'Tên thể loại không hợp lệ, vui lòng kiểm tra lại').notEmpty();
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
        (async() => {
            const client = await pool.connect()
            try {
                // const result = await client.query('SELECT * FROM theloai WHERE idtheloai =' + id)
                await client.query("UPDATE theloai SET tentheloai = '" + ten + "' WHERE idtheloai = " + id)
                req.flash('success', 'Sửa thành công');
                res.redirect("/admin/theloai/danhsach")
            } finally {
                client.release()
            }
        })().catch(e => console.log(e.stack))
    }
});

router.post('/them', adminIsLoggedIn, function(req, res, next) {
    req.checkBody('themten', 'Tên thể loại không hợp lệ, vui lòng kiểm tra lại').notEmpty();
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
        const ten = req.body.themten;
        (async() => {
            const client = await pool.connect()
            try{
                const result = await client.query('SELECT MAX(idtheloai) FROM theloai')
                // console.log(result.rows[0].max)
                await client.query("INSERT INTO theloai(idtheloai, tentheloai) VALUES("+ result.rows[0].max +"+1, '" + ten + "')")
                req.flash('success', 'Thêm thành công');
                res.redirect("/admin/theloai/danhsach")
            } finally{
                client.release()
            }
        })().catch(e => console.log(e.stack))
    }
});

router.post('/xoa/:id', adminIsLoggedIn, function(req, res, next) {
    const id = req.params.id;
    console.log(id);
    (async() => {
        const client = await pool.connect()
        try {
            await client.query("DELETE FROM theloai WHERE idtheloai = '" + id +"';  DELETE FROM loaitin WHERE idtheloai = '" + id +"'")
            req.flash('success', 'Xóa thành công')
            res.redirect("/admin/theloai/danhsach")
        } finally {
            client.release()
        }
    })().catch(e => console.log(e.stack))
});

module.exports = router