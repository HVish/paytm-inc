"use strict";

const express = require('express');
const app = express();

const hbs = require('express-handlebars');
const bodyParser = require('body-parser');

const checksum = require('./paytm/checksum.js');
const config = require('./locals.js');

const port = 3000;

// setup view engine
app.engine('.hbs', hbs({
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

// to support JSON-encoded bodies
app.use(bodyParser.json());
// to support URL-encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', function(req, res) {

    var data = {

        submitURL: '/generate-checksum',
        KEY: config.KEY,
        CALLBACK_URL: config.PAYTM_RESPONSE_CALLBACK_URL,
        CHANNEL_ID: 'WEB',
        CUST_ID: '298233',
        INDUSTRY_TYPE_ID: 'Retail',
        MID: config.MID,
        ORDER_ID: Date.now(),
        REQUEST_TYPE: 'DEFAULT',
        TXN_AMOUNT: '1',
        WEBSITE: 'vaahikaWEB'

    };

    res.render('home', data);

});

app.post('/generate-checksum', function(req, res) {

    var data = req.body,
        key = req.body.KEY;

    delete data.KEY;

    checksum.genchecksum(data, key, function(err, data) {

        console.log(data);

        if (checksum.verifychecksum(data, key)) {

            console.log('verified checksum');
            data.success = true;
            data.submitURL = 'https://pguat.paytm.com/oltp-web/processTransaction';

        } else {

            console.log("verification failed");
            data.failed = true;

        }
        res.render('home', data);

    });

});

app.get('/verify-checksum', function(req, res) {

    res.render('verify', {
        KEY: config.KEY
    });

});

app.post('/verify-checksum', function(req, res) {

    try {

        var data = JSON.parse(req.body.DATA),
            key = req.body.KEY;

        if (checksum.verifychecksum(data, key)) {

            console.log('verified checksum');
            res.render('verify', {
                DATA: req.body.DATA,
                KEY: key,
                success: true
            });

        } else {

            console.log("verification failed");
            res.render('verify', {
                DATA: req.body.DATA,
                KEY: key,
                failed: true
            });

        }

    } catch (e) {

        console.log("verification failed", e);
        res.render('verify', {
            DATA: req.body.DATA,
            KEY: key,
            failed: true
        });

    }

});

app.listen(port, function() {
    console.log("Server started @ http://localhost:" + port);
});
