const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const ogs = require('open-graph-scraper');
const passport = require('passport');
const path = require('path');
const google_passport = require('passport');
const http = require('http');
const https = require('https');

const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const session = require('express-session');

const app = express();
const port = process.env.PROT || 8001;
const mysql = require('mysql');
// //로컬에서 쓸때
// const data = fs.readFileSync('./database.json');
//깃허브 올릴때
const data = fs.readFileSync(__dirname + '/database.json');

const cors = require('cors');

// const googleClinet = fs.readFileSync('./google_client_secret.json');
// const gconf = JSON.parse(googleClinet);
// const GOOGLE_CLIENT_ID = gconf.web.client_id;
// const GOOGLE_CLIENT_SECRET = gconf.web.client_secret;

//console.log('GOOGLE_CLIENT_ID', GOOGLE_CLIENT_ID);
//console.log('GOOGLE_CLIENT_SECRET', GOOGLE_CLIENT_SECRET);

const conf = JSON.parse(data);

let connection;

console.log('수정 00115');

handleDisconnect();

app.use(
    cors({
        origin: 'http://leicestercity.pro', // server의 url이 아닌, 요청하는 client의 url
        credentials: true,
    })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
    session({
        secret: 'loginInfo',
        // cookie: {
        //     domain: 'leicestercity.pro',
        //     path: '/',
        //     originalMaxAge: 86400000,
        //     httpOnly: true,
        //     secure: false,
        //     sameSite: 'none',
        // },
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(
    express.static(path.join(__dirname + '/client/football_client_ts/build'))
);

app.get('/', (req, res) => {
    res.sendFile(
        path.join(__dirname + '/client/football_client_ts/build/index.html')
    );
});

app.get('/api/usercheck/:id', (req, res) => {
    const sql = 'SELECT COUNT(*) as cnt FROM user_info WHERE user_id = ?';
    let params = [req.params.id];
    connection.query(sql, params, (err, rows, fields) => {
        res.send(rows);
    });
});

app.post(
    '/api/login',
    passport.authenticate('local', {
        failureRedirect: '/api/loginfail',
        function(request, response) {
            request.session.save(function () {
                response.redirect(`/`);
            });
        },
    }),
    (req, res) => {
        const id = req.body.id;
        const pw = req.body.pw;

        // const id = req.query.id;
        // const pw = req.query.pw;

        const sql =
            'SELECT user_id, user_pw, user_email, user_nickname, user_img FROM user_info WHERE user_id = ? AND user_pw = ?';
        const params = [id, pw];
        req.session.userId = req.query.id;
        req.session.userPw = req.query.pw;
        req.session.save();
        connection.query(sql, params, (err, rows, fields) => {
            // if (rows) {
            //     console.log('rows', rows);
            // } else {
            //     console.log('회원정보없음');
            // }

            res.send(rows);
        });
    }
);

app.get('/api/loginfail', (req, res) => {
    res.send('');
});

app.get('/api/logout', (req, res) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        } else {
            res.redirect('/');
        }
    });
});

passport.serializeUser((user, done) => {
    console.log('세션!', user.user_id);
    const params = [user.user_id, user.user_pw];
    done(null, params);
});

passport.deserializeUser((params, done) => {
    console.log('세션 params: ');
    const sql =
        'SELECT user_id, user_pw, user_email, user_nickname, user_img, user_login_type FROM user_info WHERE user_id = ? AND user_pw = ?';
    connection.query(sql, params, (err, rows, fields) => {
        if (err) {
            console.log('에러', err);
        }
        done(null, rows);
    });
});

passport.use(
    new LocalStrategy(
        {
            usernameField: 'id',
            passwordField: 'pw',
            session: true,
            passReqToCallback: false,
        },
        (userid, userpw, done) => {
            console.log('로컬스토리지', userid, userpw);
            const callback = (value) => {
                if (value[0]) {
                    return done(null, value[0]);
                } else {
                    return done(null, false, {
                        message: '회원정보를 확인해주세요.',
                    });
                }
            };
            userInfoFilteredByID(userid, userpw, callback);
        }
    )
);

const userInfoFilteredByID = (id, pw, callback) => {
    const params = [id, pw];
    const userFilterQuery =
        'SELECT user_id, user_pw, user_email, user_nickname, user_img FROM user_info WHERE user_id = ? AND user_pw = ?';
    connection.query(userFilterQuery, params, (err, rows, fields) => {
        return callback(rows);
    });

    /* result는 db에서 오는 엄청나게 다양한 정보를 담고 있고 index 0에 있는 것이 우리가 원하는 필터링을 한 유저 정보의 배열이다. 단 async 함수이므로 리턴값은 promise 객체에 감싸인 배열이고 이를 받아 줄 때는 await으로 받아 줘야 한다. */
};

// app.get(
//     '/api/google/googlelogin',
//     passport.authenticate('google', { scope: ['email', 'profile'] })
// );

// app.get(
//     '/api/google/login/callback',
//     passport.authenticate('google', {
//         successRedirect: '/api/google/firstlogin',
//         failureRedirect: '/api/google/loginfail',
//     })
// );

// app.get('/api/google/firstlogin', (req, res) => {
//     console.log('구글 로그인 성공');
// });

// app.get('/api/google/loginfail', (req, res) => {
//     console.log('구글 로그인 실패');
// });

// // login이 최초로 성공했을 때만 호출되는 함수
// // done(null, user.id)로 세션을 초기화 한다.
// passport.serializeUser((user, done) => {
//     console.log('구글 유저 정보', user);
//     done(null, user.id);
// });

// // 사용자가 페이지를 방문할 때마다 호출되는 함수
// // done(null, id)로 사용자의 정보를 각 request의 user 변수에 넣어준다.
// passport.deserializeUser((id, done) => {
//     console.log('구글 아이디', id);

//     const sql =
//         'SELECT user_id, user_pw, user_email, user_nickname, user_img FROM user_info WHERE user_id = ? AND user_pw = ?';
//     connection.query(sql, [id, ''], (err, rows, fields) => {
//         done(null, rows);
//     });
// });

// // Google login 전략
// // 로그인 성공 시 callback으로 request, accessToken, refreshToken, profile 등이 나온다.
// // 해당 콜백 function에서 사용자가 누구인지 done(null, user) 형식으로 넣으면 된다.
// // 이 예시에서는 넘겨받은 profile을 전달하는 것으로 대체했다.
// passport.use(
//     new GoogleStrategy(
//         {
//             clientID: GOOGLE_CLIENT_ID,
//             clientSecret: GOOGLE_CLIENT_SECRET,
//             callbackURL: '/api/google/login/callback',
//             passReqToCallback: true,
//         },
//         function (request, accessToken, refreshToken, profile, done) {
//             console.log('구글 프로필', profile);
//             console.log('구글 토큰', accessToken);

//             return done(null, profile);
//         }
//     )
// );

app.get('/api/sessioncheck', loginCheck, (req, res) => {
    res.send(req.user);
});

function loginCheck(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.send('로그인이 필요합니다.');
    }
}

app.get('/api/nicknamecheck/:nickname', (req, res) => {
    const sql = 'SELECT COUNT(*) as cnt FROM user_info WHERE user_nickname = ?';
    let params = [req.params.nickname];
    connection.query(sql, params, (err, rows, fields) => {
        res.send(rows);
    });
});

app.post('/api/singup', (req, res) => {
    const sql = 'INSERT INTO user_info VALUES(?, ?, ?, ?, ?, ?);';
    const id = req.body.id;
    const pw = req.body.pw;
    const email = req.body.email;
    const nickname = req.body.nickname;
    const img = req.body.img;
    const logintype = req.body.logintype;

    const params = [id, pw, email, nickname, img, logintype];
    connection.query(sql, params, (err, rows, fields) => {
        if (err) {
            res.send(err);
            return console.log('eror : ', err);
        }
        res.send(rows);
    });
});

app.get('/api/user/imgupdate', (req, res) => {
    const sql = 'UPDATE user_info SET user_img = ? WHERE user_id = ?';
    const img = req.query.img;
    const id = req.query.id;
    const params = [img, id];
    connection.query(sql, params, (err, rows, fields) => {
        if (err) {
            res.send(err);
            return console.log('eror : ', err);
        }
        res.send(rows);
    });
});

app.get('/api/user/pwupdate', (req, res) => {
    const sql = 'UPDATE user_info SET user_pw = ? WHERE user_id = ?';
    const pw = req.query.pw;
    const id = req.query.id;
    const params = [pw, id];
    connection.query(sql, params, (err, rows, fields) => {
        if (err) {
            res.send(err);
            return console.log('eror : ', err);
        }
        res.send(rows);
    });
});

app.get('/api/user/nicknameupdate', (req, res) => {
    const sql = 'UPDATE user_info SET user_nickname = ? WHERE user_id = ?';
    const nickName = req.query.nickName;
    const id = req.query.id;
    const params = [nickName, id];
    connection.query(sql, params, (err, rows, fields) => {
        if (err) {
            res.send(err);
            return console.log('eror : ', err);
        }
        res.send(rows);
    });
});

app.get('/api/community/read/list', (req, res) => {
    let sql = '';
    if (req.query.type.search) {
        sql = `SELECT a.community_no, a.user_id, a.community_title, a.community_date, 
        a.community_content,a.community_view, a.community_commend,
        a.community_img_01,a.community_img_02,a.community_img_03,a.community_img_04,a.community_img_05,
        b.user_nickname,b.user_img
        FROM community AS a LEFT JOIN user_info AS b ON a.user_id = b.user_id WHERE ${req.query.type.searchOption} LIKE ? ORDER BY ${req.query.type.sort} DESC`;
    } else {
        sql = `SELECT a.community_no, a.user_id, a.community_title, a.community_date, 
        a.community_content,a.community_view, a.community_commend,
        a.community_img_01,a.community_img_02,a.community_img_03,a.community_img_04,a.community_img_05,
        b.user_nickname,b.user_img
        FROM community AS a LEFT JOIN user_info AS b ON a.user_id = b.user_id ORDER BY ${req.query.type.sort} DESC`;
    }
    const search = req.query.type.search + '%';
    const params = [search];
    connection.query(sql, params, (err, rows, fields) => {
        if (err) {
            res.send(err);
            return console.log('eror : ', err);
        }
        res.send(rows);
    });
});

app.get('/api/home/community', (req, res) => {
    const sql = `SELECT a.community_no, a.user_id, a.community_title, a.community_date, 
        a.community_content,a.community_view, a.community_commend,
        a.community_img_01,a.community_img_02,a.community_img_03,a.community_img_04,a.community_img_05,
        b.user_nickname,b.user_img
        FROM community AS a LEFT JOIN user_info AS b ON a.user_id = b.user_id  ORDER BY community_commend DESC LIMIT 5;`;
    connection.query(sql, (err, rows, fields) => {
        if (err) {
            res.send(err);
            return console.log('eror : ', err);
        }
        res.send(rows);
    });
});

app.get('/api/community/read/detail', (req, res) => {
    const sql = `SELECT a.community_no, a.user_id, a.community_title, a.community_date, 
    a.community_content,a.community_view, a.community_commend,
    a.community_img_01,a.community_img_02,a.community_img_03,a.community_img_04,a.community_img_05,
    b.user_nickname,b.user_img
    FROM community AS a LEFT JOIN user_info AS b ON a.user_id = b.user_id where community_no = ?`;

    const no = req.query.no;
    const params = [no];
    connection.query(sql, params, (err, rows, fields) => {
        if (err) {
            res.send(err);
            return console.log('eror : ', err);
        }
        res.send(rows);
    });
});

app.get('/api/community/comment/read/detail', (req, res) => {
    const sql = `SELECT * FROM user_info AS a LEFT JOIN comment_list AS b ON a.user_id = b.user_id
    WHERE b.commend_no = ?;`;

    const no = req.query.no;
    const params = [no];
    connection.query(sql, params, (err, rows, fields) => {
        if (err) {
            res.send(err);
            return console.log('eror : ', err);
        }
        res.send(rows);
    });
});

app.post('/api/community/write', (req, res) => {
    const sql = `INSERT INTO community (
        user_id, community_title, community_date, 
        community_content,community_view, community_commend,
        community_img_01,community_img_02,community_img_03,community_img_04,community_img_05 )
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
    const id = req.body.id;
    const title = req.body.title;
    const communityDate = date();
    const content = req.body.content;
    const view = req.body.view;
    const commend = req.body.commend;
    const img01 = req.body.img01;
    const img02 = req.body.img02;
    const img03 = req.body.img03;
    const img04 = req.body.img04;
    const img05 = req.body.img05;

    const params = [
        id,
        title,
        communityDate,
        content,
        view,
        commend,
        img01,
        img02,
        img03,
        img04,
        img05,
    ];
    connection.query(sql, params, (err, rows, fields) => {
        if (err) {
            res.send(err);
            return console.log('eror : ', err);
        }
        res.send(rows);
    });
});

app.post('/api/community/comment/write', (req, res) => {
    const sql = `INSERT INTO comment_list (commend_no, user_id, comment_date, comment_content)VALUES (?,?,?,?);`;

    const no = req.body.commend_no;
    const id = req.body.user_id;
    const comment_date = date();
    const content = req.body.comment_content;

    const params = [no, id, comment_date, content];
    connection.query(sql, params, (err, rows, fields) => {
        if (err) {
            res.send(err);
            return console.log('eror : ', err);
        }
        res.send(rows);
    });
});

app.post('/api/community/update', (req, res) => {
    const sql = `UPDATE community SET 
    community_title = ?,
    community_date = ?,
    community_content = ?,
    community_view = ?,
    community_commend = ?,
    community_img_01 = ?,
    community_img_02 = ?,
    community_img_03 = ?,
    community_img_04 = ?,
    community_img_05 =?
    WHERE community_no = ? AND user_id = ?`;
    const title = req.body.community.title;
    const communityDate = date();
    const content = req.body.community.content;
    const view = req.body.community.view;
    const commend = req.body.community.commend;
    const img01 = req.body.community.img01;
    const img02 = req.body.community.img02;
    const img03 = req.body.community.img03;
    const img04 = req.body.community.img04;
    const img05 = req.body.community.img05;

    const no = req.body.info.no;
    const id = req.body.info.id;

    const params = [
        title,
        communityDate,
        content,
        view,
        commend,
        img01,
        img02,
        img03,
        img04,
        img05,
        no,
        id,
    ];
    connection.query(sql, params, (err, rows, fields) => {
        if (err) {
            res.send(err);
            return console.log('eror : ', err);
        }
        res.send(rows);
    });
});

app.get('/api/community/delete', (req, res) => {
    console.log(req.query);
    const sql = 'DELETE FROM community WHERE community_no = ? AND user_id = ?';
    const no = req.query.no;
    const id = req.query.id;
    const params = [no, id];
    connection.query(sql, params, (err, rows, fields) => {
        if (err) {
            res.send(err);
            return console.log('eror : ', err);
        }
        res.send(rows);
    });
});

app.get('/api/community/viewsplus', (req, res) => {
    const sql =
        'UPDATE community SET community_view = community_view + 1 WHERE community_no = ?';
    const no = req.query.no;
    const params = [no];
    connection.query(sql, params, (err, rows, fields) => {
        if (err) {
            res.send(err);
            return console.log('eror : ', err);
        }
        res.send(rows);
    });
});

app.get('/api/community/commendplus', (req, res) => {
    //console.log('imgupdate', req.query);
    const sql_1 =
        'UPDATE community SET community_commend = community_commend + 1 WHERE community_no = ?';
    const sql_2 =
        'INSERT INTO commend_list(commend_no, user_id, commend_date) VALUES(?, ?, ?);';
    const no = req.query.no;
    const id = req.query.id;
    const commend_date = date();
    const params1 = [no];
    const params2 = [no, id, commend_date];
    connection.query(sql_2, params2, (err, rows, fields) => {
        if (err) {
            res.send(err);
            return console.log('eror : ', err);
        }

        connection.query(sql_1, params1, (err, rows, fields) => {
            console.log('결과값!', rows);
            if (err) {
                res.send(err);
                return console.log('eror : ', err);
            }
            res.send(rows);
        });
    });
});

app.get('/api/footballdata/areas', (req, res) => {
    const api_url = 'http://api.football-data.org/v4/areas/';
    const request = require('request');
    const options = {
        url: api_url,
    };
    request.get(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' });
            res.send(body);
        } else {
            res.status(response.statusCode).end();
            console.log('error = ' + response.statusCode);
        }
    });
});

app.get('/api/footballdata/standings', (req, res) => {
    const leagueCode = req.query.leagueCode;
    const season = req.query.season;

    const api_url = `http://api.football-data.org/v4/competitions/${leagueCode}/standings`;
    const request = require('request');
    const options = {
        url: api_url,
        qs: {
            season,
        },
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Auth-Token': '8e41f936bc9449b1bb62ffcfb1c11514',
        },
    };
    request.get(options, function (error, response, body) {
        //console.log('response', response);
        if (!error && response.statusCode == 200) {
            res.send(body);
        } else {
            res.status(response.statusCode).end();
        }
    });
});

app.get('/api/footballdata/player', (req, res) => {
    const leagueCode = req.query.leagueCode;
    const season = req.query.season;

    const api_url = `http://api.football-data.org/v4/competitions/${leagueCode}/scorers`;
    const request = require('request');
    const options = {
        url: api_url,
        qs: {
            limit: 10,
            season,
        },
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Auth-Token': '8e41f936bc9449b1bb62ffcfb1c11514',
        },
    };
    request.get(options, function (error, response, body) {
        //console.log('response', response);
        if (!error && response.statusCode == 200) {
            res.send(body);
        } else {
            res.status(response.statusCode).end();
            console.log('error = ' + response.statusCode);
        }
    });
});

app.get('/api/footballdata/news', function (req, res) {
    var api_url =
        'https://openapi.naver.com/v1/search/news.json?query=' +
        req.query.search;
    var request = require('request');
    var options = {
        url: api_url,
        headers: {
            'X-Naver-Client-Id': 'zWI7ml8adhqq1WPXT5QB',
            'X-Naver-Client-Secret': 'uw_diePrIL',
        },
        qs: {
            start: req.query.page,
            display: 10,
            sort: 'sim',
        },
    };

    request.get(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' });
            const value = JSON.parse(body);
            let count = 0;
            value.items.map((item, index, row) => {
                console.log('뉴스 아이템:', item);
                let options = {
                    url: item.link,
                };
                ogsCall(options)
                    .then((url) => {
                        count++;
                        value.items[index].imgurl = url;
                        if (count === row.length) {
                            //res.end(JSON.stringify(value));

                            return value;
                        }
                    })
                    .then((e) => {
                        if (e) {
                            res.end(JSON.stringify(value));
                        }
                    });
            });

            // let options = {
            //     url: 'https://sports.news.naver.com/news.nhn?oid=417&aid=0000854504',
            // };
            // ogsCall(options);
        } else {
            res.status(response.statusCode).end();
            console.log('error = ' + response.statusCode);
        }
    });
});

app.listen(port, () => console.log(`Listening on port!!! ${port}`));
// const options = {
//     key: fs.readFileSync(__dirname + '/private.pem'),
//     cert: fs.readFileSync(__dirname + '/certificate.pem'),
// };

//options.agent = new https.Agent(options);

// https
//     .createServer(options, (req, res) => {
//         res.writeHead(200);
//         res.end('hello world\n');
//     })
//     .listen(port);

function date() {
    let now = new Date();
    let year = now.getFullYear();
    let todayMonth =
        now.getMonth() + 1 <= 10
            ? `0${now.getMonth() + 1}`
            : now.getMonth() + 1;
    let todayDate = now.getDate() <= 10 ? `0${now.getDate()}` : now.getDate();
    let hours = now.getHours() <= 10 ? `0${now.getHours()}` : now.getHours();
    let minutes =
        now.getMinutes() <= 10 ? `0${now.getMinutes()}` : now.getMinutes();
    let seconds =
        now.getSeconds() <= 10 ? `0${now.getSeconds()}` : now.getSeconds();
    let date =
        year +
        '-' +
        todayMonth +
        '-' +
        todayDate +
        ' ' +
        hours +
        ':' +
        minutes +
        ':' +
        seconds;
    return date;
}

async function ogsCall(options) {
    try {
        return await ogs(options).then((data) => {
            const { error, result, response } = data;
            // console.log('error:', error); // This returns true or false. True if there was an error. The error itself is inside the results object.
            // console.log('result:', result); // This contains all of the Open Graph results
            // console.log('response:', response); // This contains the HTML of page
            console.log('뉴스사진:', result);
            return result.ogImage.url;
        });
    } catch (error) {
        console.log('뉴스 에러: ', error);
    }
}

function handleDisconnect() {
    connection = mysql.createConnection({
        host: conf.host,
        user: conf.user,
        password: conf.password,
        port: conf.port,
        database: conf.database,
    });

    connection.connect(function (err) {
        console.log('서버실행');
        if (err) {
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000);
        } // to avoid a hot loop, and to allow our node script to
    }); // process asynchronous requests in the meantime.
    // If you're also serving http, display a 503 error.
    connection.on('error', function (err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            // Connection to the MySQL server is usually
            handleDisconnect(); // lost due to either server restart, or a
        } else {
            // connnection idle timeout (the wait_timeout
            throw err; // server variable configures this)
        }
    });
}
