"use strict";

const express = require('express');
const app = express();

const hbs = require('express-handlebars');

const checksum = require('./paytm/checksum.js');
const config = require('./locals.js');

// setup view engine
app.engine('.hbs', hbs({
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

app.get('/', function(req, res) {

    var ver_param = {
        REQUEST_TYPE: 'DEFAULT',
        MID: config.MID,
        ORDER_ID: Date.now(),
        CUST_ID: '298233',
        TXN_AMOUNT: '1',
        CHANNEL_ID: 'WEB',
        INDUSTRY_TYPE_ID: 'Retail',
        WEBSITE: 'vaahikaWEB'
    };

    checksum.genchecksum(ver_param, config.KEY, function(err, ver_param) {
        res.render('home', ver_param);
    });

});

app.listen(3000, function() {
    console.log("Server started @ http://localhost:3000");
});
