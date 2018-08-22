var express = require('express');
var router = express.Router();
var request = require('request');
var api_key = "api_key"

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('verify');
});

router.post('/verify', function(req, res, next) {
    var phone_number = req.body.phone_number;
    var country_code = req.body.country_code;

    console.log("body: ", req.body);

    if (phone_number && country_code) {
        requestPhoneVerification(phone_number, country_code, function (err, response) {
            if (err) {
                console.log('error creating phone reg request', err);
                res.status(500).json(err);
            } else {
                console.log('Success register phone API call: ', response);
                res.render('verifycheck',{phone_number:phone_number,country_code:country_code})
            }
        });
    } else {
        console.log('Failed in Register Phone API Call', req.body);
        res.status(500).json({error: "Missing fields"});
    }
});

requestPhoneVerification = function (phone_number, country_code, callback) {
        request.post({
        url: "https://api.authy.com/protected/json/phones/verification/start",
        form: {
            "api_key": api_key,
            "phone_number": phone_number,
            "via": "sms",
            "country_code": country_code,
            "code_length": 4
        },
        headers: {"User-Agent": "PhoneVerificationRegNode/0.1 (node " + process.version + ")"},
        qs: {},
        json: true,
        jar: false,
        strictSSL: true
    }, callback);
};

router.post('/verify-token', function(req, res, next) {
    var country_code = req.body.country_code;
    var phone_number = req.body.phone_number;
    var token = req.body.token;
    
    if (phone_number && country_code && token) {
        verifyPhoneToken(phone_number, country_code, token, function (err, response) {
            if (err) {
                console.log('error creating phone reg request', err);
                res.status(500).json(err);
            } else {
                console.log('Confirm phone success confirming code: ', response);
                res.send("success");
            }

        });
    } else {
        console.log('Failed in Confirm Phone request body: ', req.body);
        res.status(500).json({error: "Missing fields"});
    }
});

verifyPhoneToken = function (phone_number, country_code, token, callback) {

    console.log('in verify phone');
    request.get({
        url: "https://api.authy.com/protected/json/phones/verification/check",
        form: {
            "api_key": api_key,
            "verification_code": token,
            "phone_number": phone_number,
            "country_code": country_code
        },
        headers: {"User-Agent": "PhoneVerificationRegNode/0.1 (node " + process.version + ")"},
        qs: {},
        json: true,
        jar: false,
        strictSSL: true
    }, callback);
};

module.exports = router;
