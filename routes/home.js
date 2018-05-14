const Router = require('express-promise-router')
const router = new Router()
var passport = require('passport');
const pool = require('../model')

// Is Logged
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}

// Is not logged
function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}

/* GET Trang chủ. */
router.get('/', function(req, res, next) {
	(async() => {
        const client = await pool.connect();
        let error = req.flash('error');
        let user = null;
        try {
            const menu = await client.query("SELECT theloai.*, string_agg(DISTINCT loaitin.tenloaitin, ':') lt FROM theloai INNER JOIN loaitin ON loaitin.idtheloai = theloai.idtheloai GROUP BY theloai.idtheloai")
            const latestNews = await client.query("SELECT * FROM baiviet ORDER BY luotxem DESC LIMIT 10")
            const slide = await client.query("SELECT * FROM baiviet ORDER BY ngaydang DESC LIMIT 6")
            const theloai1 = await client.query("SELECT bv.* FROM baiviet bv INNER JOIN loaitin lt ON lt.idloaitin = bv.idloaitin INNER JOIN theloai tl ON tl.idtheloai = lt.idtheloai AND tl.idtheloai = 2 ORDER BY bv.ngaydang DESC LIMIT 4")
            const theloai2 = await client.query("SELECT bv.* FROM baiviet bv INNER JOIN loaitin lt ON lt.idloaitin = bv.idloaitin INNER JOIN theloai tl ON tl.idtheloai = lt.idtheloai AND tl.idtheloai = 2 ORDER BY bv.ngaydang DESC LIMIT 4")
            const theloai3 = await client.query("SELECT bv.* FROM baiviet bv INNER JOIN loaitin lt ON lt.idloaitin = bv.idloaitin INNER JOIN theloai tl ON tl.idtheloai = lt.idtheloai AND tl.idtheloai = 2 ORDER BY bv.ngaydang DESC LIMIT 4")
            const theloai4 = await client.query("SELECT bv.* FROM baiviet bv INNER JOIN loaitin lt ON lt.idloaitin = bv.idloaitin INNER JOIN theloai tl ON tl.idtheloai = lt.idtheloai AND tl.idtheloai = 2 ORDER BY bv.ngaydang DESC LIMIT 4")
            const popularPost = await client.query("SELECT * FROM baiviet ORDER BY luotxem DESC LIMIT 9")
            const mostPopular = await client.query("SELECT * FROM baiviet ORDER BY ngaydang DESC LIMIT 4")
            const mostReader = await client.query("SELECT * FROM baiviet ORDER BY luotxem DESC LIMIT 4")
            const loaitin = await client.query("SELECT * FROM loaitin ORDER BY idloaitin DESC")
            res.render('pages/layouts/index',{
                title: 'News_TTB Website',
                latestNews: latestNews.rows,
                menu: menu.rows,
                slide: slide.rows,
                theloai1: theloai1.rows,
                theloai2: theloai2.rows,
                theloai3: theloai3.rows,
                theloai4: theloai4.rows,
                popularPost: popularPost.rows,
                mostPopular: mostPopular.rows,
                mostReader: mostReader.rows,
                loaitin: loaitin.rows,
                user : user,
                error: error
            });
        } finally {
            client.release()
        }
    })().catch(e => console.log(e.stack))
});

/* GET Trang chủ. */
router.get('/trang-chu', isLoggedIn, function(req, res, next) {
    (async() => {
        const client = await pool.connect();
        let error = req.flash('error');
        try {
            const menu = await client.query("SELECT theloai.*, string_agg(DISTINCT loaitin.tenloaitin, ':') lt FROM theloai INNER JOIN loaitin ON loaitin.idtheloai = theloai.idtheloai GROUP BY theloai.idtheloai")
            const latestNews = await client.query("SELECT * FROM baiviet ORDER BY luotxem DESC LIMIT 10")
            const slide = await client.query("SELECT * FROM baiviet ORDER BY ngaydang DESC LIMIT 6")
            const theloai1 = await client.query("SELECT bv.* FROM baiviet bv INNER JOIN loaitin lt ON lt.idloaitin = bv.idloaitin INNER JOIN theloai tl ON tl.idtheloai = lt.idtheloai AND tl.idtheloai = 2 ORDER BY bv.ngaydang DESC LIMIT 4")
            const theloai2 = await client.query("SELECT bv.* FROM baiviet bv INNER JOIN loaitin lt ON lt.idloaitin = bv.idloaitin INNER JOIN theloai tl ON tl.idtheloai = lt.idtheloai AND tl.idtheloai = 2 ORDER BY bv.ngaydang DESC LIMIT 4")
            const theloai3 = await client.query("SELECT bv.* FROM baiviet bv INNER JOIN loaitin lt ON lt.idloaitin = bv.idloaitin INNER JOIN theloai tl ON tl.idtheloai = lt.idtheloai AND tl.idtheloai = 2 ORDER BY bv.ngaydang DESC LIMIT 4")
            const theloai4 = await client.query("SELECT bv.* FROM baiviet bv INNER JOIN loaitin lt ON lt.idloaitin = bv.idloaitin INNER JOIN theloai tl ON tl.idtheloai = lt.idtheloai AND tl.idtheloai = 2 ORDER BY bv.ngaydang DESC LIMIT 4")
            const popularPost = await client.query("SELECT * FROM baiviet ORDER BY luotxem DESC LIMIT 9")
            const mostPopular = await client.query("SELECT * FROM baiviet ORDER BY ngaydang DESC LIMIT 4")
            const mostReader = await client.query("SELECT * FROM baiviet ORDER BY luotxem DESC LIMIT 4")
            const loaitin = await client.query("SELECT * FROM loaitin ORDER BY idloaitin DESC")
            res.render('pages/layouts/index',{
                title: 'News_TTB Website',
                latestNews: latestNews.rows,
                menu: menu.rows,
                slide: slide.rows,
                theloai1: theloai1.rows,
                theloai2: theloai2.rows,
                theloai3: theloai3.rows,
                theloai4: theloai4.rows,
                popularPost: popularPost.rows,
                mostPopular: mostPopular.rows,
                mostReader: mostReader.rows,
                loaitin: loaitin.rows,
                user : req.user,
                error: error
            });
        } finally {
            client.release()
        }
    })().catch(e => console.log(e.stack))
});

/* GET Chi tiet. */
router.get('/chi-tiet/:idloaitin/:id', function(req, res, next) {
    (async() => {
        const client = await pool.connect();
        let error = req.flash('error');
        let user = null;
        try {
            const menu = await client.query("SELECT theloai.*, string_agg(DISTINCT loaitin.tenloaitin, ':') lt FROM theloai INNER JOIN loaitin ON loaitin.idtheloai = theloai.idtheloai GROUP BY theloai.idtheloai")
            const latestNews = await client.query("SELECT * FROM baiviet ORDER BY luotxem DESC LIMIT 10")
            const slide = await client.query("SELECT * FROM baiviet ORDER BY ngaydang DESC LIMIT 6")
            const popularPost = await client.query("SELECT * FROM baiviet ORDER BY luotxem DESC LIMIT 9")
            const mostPopular = await client.query("SELECT * FROM baiviet ORDER BY ngaydang DESC LIMIT 4")
            const mostReader = await client.query("SELECT * FROM baiviet ORDER BY luotxem DESC LIMIT 4")
            const loaitin = await client.query("SELECT * FROM loaitin ORDER BY idloaitin DESC")
            const result = await client.query('SELECT * FROM baiviet bv INNER JOIN loaitin lt ON lt.idloaitin = bv.idloaitin INNER JOIN theloai tl ON tl.idtheloai = lt.idtheloai AND bv.idbaiviet = ' + req.params.id)
            const lienquan = await client.query('SELECT * FROM baiviet WHERE idloaitin = ' + req.params.idloaitin + ' AND idbaiviet != ' + req.params.id)
            res.render('pages/chitiet',{
                title: 'News_TTB Website',
                latestNews: latestNews.rows,
                menu: menu.rows,
                slide: slide.rows,
                popularPost: popularPost.rows,
                mostPopular: mostPopular.rows,
                mostReader: mostReader.rows,
                loaitin: loaitin.rows,
                baiviet: result.rows[0],
                lienquan: lienquan.rows,
                user : user,
                error: error
            });
        } finally {
            client.release()
        }
    })().catch(e => console.log(e.stack))
});

/* GET Danh sach. */
router.get('/danh-sach/:name', function(req, res, next) {
    (async() => {
        const client = await pool.connect();
        let error = req.flash('error');
        let user = null;
        try {
            const menu = await client.query("SELECT theloai.*, string_agg(DISTINCT loaitin.tenloaitin, ':') lt FROM theloai INNER JOIN loaitin ON loaitin.idtheloai = theloai.idtheloai GROUP BY theloai.idtheloai")
            const latestNews = await client.query("SELECT * FROM baiviet ORDER BY luotxem DESC LIMIT 10")
            const slide = await client.query("SELECT * FROM baiviet ORDER BY ngaydang DESC LIMIT 6")
            const popularPost = await client.query("SELECT * FROM baiviet ORDER BY luotxem DESC LIMIT 9")
            const mostPopular = await client.query("SELECT * FROM baiviet ORDER BY ngaydang DESC LIMIT 4")
            const mostReader = await client.query("SELECT * FROM baiviet ORDER BY luotxem DESC LIMIT 4")
            const loaitin = await client.query("SELECT * FROM loaitin ORDER BY idloaitin DESC")
            const result = await client.query("SELECT * FROM baiviet bv INNER JOIN loaitin lt ON lt.idloaitin = bv.idloaitin AND lt.tenloaitin = '" + req.params.name + "'")
            res.render('pages/danhsach',{
                title: 'News_TTB Website',
                latestNews: latestNews.rows,
                menu: menu.rows,
                slide: slide.rows,
                popularPost: popularPost.rows,
                mostPopular: mostPopular.rows,
                mostReader: mostReader.rows,
                loaitin: loaitin.rows,
                danhsach: result.rows,
                user : user,
                error: error
            });
        } finally {
            client.release()
        }
    })().catch(e => console.log(e.stack))
});

router.post('/tim-kiem', (req, res, next) => {
    const searchterm = req.body.searchterm;
    (async() => {
        const client = await pool.connect();
        let error = req.flash('error');
        let user = null;
        try {
            const menu = await client.query("SELECT theloai.*, string_agg(DISTINCT loaitin.tenloaitin, ':') lt FROM theloai INNER JOIN loaitin ON loaitin.idtheloai = theloai.idtheloai GROUP BY theloai.idtheloai")
            const latestNews = await client.query("SELECT * FROM baiviet ORDER BY luotxem DESC LIMIT 10")
            const slide = await client.query("SELECT * FROM baiviet ORDER BY ngaydang DESC LIMIT 6")
            const popularPost = await client.query("SELECT * FROM baiviet ORDER BY luotxem DESC LIMIT 9")
            const mostPopular = await client.query("SELECT * FROM baiviet ORDER BY ngaydang DESC LIMIT 4")
            const mostReader = await client.query("SELECT * FROM baiviet ORDER BY luotxem DESC LIMIT 4")
            const loaitin = await client.query("SELECT * FROM loaitin ORDER BY idloaitin DESC")
            const result = await client.query("SELECT DISTINCT idbaiviet, tacgia, tieude, tomtat, noidung, urlanh, luotxem, ngaydang FROM baiviet Where (tieude  LIKE '%"+ searchterm +"%') OR (tomtat  LIKE '%"+ searchterm +"%') OR (noidung  LIKE '%"+ searchterm +"%') ORDER BY idbaiviet")
            console.log(result);
           res.render('pages/search',{
                title: 'News_TTB Website',
                latestNews: latestNews.rows,
                menu: menu.rows,
                slide: slide.rows,
                popularPost: popularPost.rows,
                mostPopular: mostPopular.rows,
                mostReader: mostReader.rows,
                loaitin: loaitin.rows,
                danhsach: result.rows,
                user : user,
                error: error
            });
        } finally {
            client.release()
            console.log("Tìm kiếm thành công")
        }
    })(req,res).catch((e) => {
        console.log(e.stack)
        // req.flash("error", "Tìm kiếm thất bại / Lỗi: " + e.message)
    })
})

router.get('/file-manager.html', function(req, res, next) {
  res.render('layouts/index', { title: 'Roxy Fileman for Node.js' });
});

module.exports = router