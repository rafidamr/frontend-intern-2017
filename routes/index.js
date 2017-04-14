var express = require('express');
var router = express.Router();
var request = require('request-promise');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Prelo' });
});

/* POST the requested body through the server. */
router.post('/', function(req, res, next){
    
    var uname = req.body.username_or_email;
    var pass = req.body.password;
    
    var opt = {
        uri: 'https://dev.prelo.id/api/auth/login',
        method: 'POST',
        body: {
            username_or_email: uname,
            password: pass
        },
        json: true
    }
    
    request(opt)
        .then(function(response){
            token = response._data.token;
            console.log('Token :'+ token);        // Save the token
            res.redirect('/lovelist/' + token);            
        })
        .catch(function(err){
            var error = err.response.body._message;
            console.log(error);
            res.render('index', { title: 'Prelo', error: error })
        })
});

/* GET the lovelist page after passing the token. */
router.get('/lovelist/:token', function(req, res, next){
    var opt2 = {
        uri: 'https://dev.prelo.id/api/me/lovelist',
        method: 'GET',
        qs: {
            access_token: req.params.token
        },
        headers: {
            'User-Agent': 'Super Agent/0.0.1',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        json: true
    }

    request(opt2)
        .then(function (response2) {
            res.render('lovelist', { title: 'Lovelist' });
        })
        .catch(function (err2) {
            res.send('Error')
        });
});

module.exports = router;