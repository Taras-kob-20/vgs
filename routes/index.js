var express = require('express');
const request = require('request');
const tunnel = require('tunnel');
const fs = require('fs');
const config = require('../config')

var router = express.Router();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const tunnelingAgent = tunnel.httpsOverHttp({
  ca: [ fs.readFileSync('public/SANDBOX cert.pem')],
  proxy: {
    host: `${config.prefixUrl}.sandbox.verygoodproxy.com`,
    port: 8080,
    proxyAuth: `${config.proxyUser}:${config.proxyPassword}`
  }
});

var reveal = function(data, resp) {
  request({
    url: 'https://echo.apps.verygood.systems/post',
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    agent: tunnelingAgent,
    body: JSON.stringify(data)
  }, function(error, response, body){
    if(error) {
      console.log(error);
    } else {
      console.log('Status:', response.statusCode);
      console.log(JSON.parse(body));
      resp.send(JSON.parse(body).json);
    }
  });
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'VGS Test' });
});

router.post("/secure", function(request, response) {
  console.log(request.body);
  response.send(request.body);
});

router.post("/reveal", function(request, response) {
  console.log(request.body);
  reveal(request.body, response);
});

module.exports = router;
