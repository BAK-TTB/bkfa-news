var pg = require("pg");

const pool = new pg.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'news',
    password: 'binhtk97',
    port: 5432,
});

module.exports = pool;