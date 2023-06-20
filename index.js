var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: '/tmp/'}));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/tarefas.html');
})


var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Exemplo escutando em http://%s:%s", host,
    port)
})