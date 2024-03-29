var request = require('superagent');
var express = require('express');
var cheerio = require('cheerio');
var app = express();

app.get('/:hex([0-9a-f]{6})', function (req, res) {
  request.get('http://encycolorpedia.se/' + req.params.hex + '/natural-color-system-ncs').end(function (err, response) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");
    var colors = [];
    colors.push(req.params.hex);
    colors.basehex = req.params.hex;
    var $ = cheerio.load(response.text);
    $('#palette ul li ul li').find('a').each(function(i, elem) {
      var text = $(this).text();
      if(text.indexOf(" / ") > -1) {
        var text = text.split(' / #');
        colors.push({
          ncs: text[0],
          hex: text[1]
        });
      }
    });
    var map = {
      basehex: colors[0],
      color: [
        colors[1]
      ],
      grayscale: [
        colors[2]
      ],
      complementary: [
        colors[3]
      ],
      analogous: [
        colors[4],
        colors[5]
      ],
      split: [
        colors[6],
        colors[7]
      ],
      triad: [
        colors[8],
        colors[9]
      ],
      square: [
        colors[10],
        colors[11],
        colors[12]
      ],
      tetradic: [
        colors[13],
        colors[14],
        colors[15]
      ],
    }
    res.json(map);
  });
});

app.get('/', function (req, res) {
  res.redirect(301, 'http://code.maxmalm.se/ncs/');
})

app.get('*', function(req, res){
  res.send('not a valid hex string (6 chars)', 404);
});

var server = app.listen(process.env.PORT || 3300, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('App listening running http://%s:%s', host, port);
});