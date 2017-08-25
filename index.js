var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
var users = [{
        id: 1,
        username: 'admin',
        password: '123',
        email: 'trungtin@gmail.com'
    },
    {
        id: 2,
        username: 'admin1',
        password: '1233',
        email: 'trungtin1@gmail.com'
    }
];
var courses = [{
        id: 1,
        name: 'khoa hoc 1',
        fee: 10
    },
    {
        id: 2,
        name: 'khoa hoc 2',
        fee: 134
    }

]
var sescret = 'sdsdsdsdS@sdsdsd';
findUserByUsername = (username) => {
    let user = null;
    for (var i = 0; i < users.length; i++) {
        if (users[i].username == username) {
            user = users[i];
            break;
        }
    }
    return user;
}
checkAuth = (req, res, next) => {
    var token = req.body.token || req.param('token') || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, sescret, (err, decoded) => {
        	if(err){
        		return res.json({
        			msg:'Xác thực không thành công'
        		})
        	}else{
        		console.log(decoded);
        		req.decoded=decoded;
        		next();
        	}
        })
    } else {
        res.json({
            msg: 'Vui lòng đăng nhập'
        })
    }
}
app.get('/login', (req, res) => {
    res.send({
        msg: 'Vui lòng đăng nhập'
    })
});

app.post('/login', (req, res) => {
    var username = req.body.txtUsername;
    var user = findUserByUsername(username);
    if (user) {
        if (user.password == req.body.txtPassword) {
            var token = jwt.sign({
                username: username,
                email: user.email,
            }, sescret, { expiresIn: 120 });
            res.json({
                msg: 'Đăng nhập thành công',
                token: token
            });
        } else {
            res.json({
                msg: 'Mật khẩu không chính xách'
            });
        }
    } else {
        res.json({
            msg: 'Tài khoản không chính xác'
        });
    };
});

app.get('/courses',checkAuth, (req, res) => {
	res.json(courses);
});
app.listen(process.env.PORT || 3000, (req, res) => {
    console.log('Server is listening');
})