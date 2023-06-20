var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/tmp/');
  }
});

var upload = multer({ storage: storage });

var tasks = []; // Array para armazenar as tarefas
var taskIdCounter = 1; // Contador incremental para gerar IDs

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/tarefas.html');
});

// Rota para obter as tarefas existentes
app.get('/api/tasks', function (req, res) {
  console.log('Quero as tarefas...');
  res.json(tasks);
  console.log('Tarefas enviadas!');
});

// Rota para adicionar uma nova tarefa
app.post('/api/tasks', function (req, res) {
  var task = {
    id: taskIdCounter++, // Incrementa o contador e utiliza como ID
    text: req.body.text,
    description: req.body.description,
    completed: false
  };
  tasks.push(task);
  res.json(task);
});

// Rota para excluir uma tarefa pelo ID
app.delete('/api/tasks/:id', function (req, res) {
  var taskId = parseInt(req.params.id);
  var index = tasks.findIndex(function (task) {
    return task.id === taskId;
  });
  if (index !== -1) {
    var deletedTask = tasks.splice(index, 1);
    res.json(deletedTask);
  } else {
    res.sendStatus(404);
  }
});

// Rota para atualizar o status de conclusão de uma tarefa pelo ID
app.put('/api/tasks/:id', function (req, res) {
  var taskId = parseInt(req.params.id);
  var completed = req.body.completed;
  var task = tasks.find(function (task) {
    return task.id === taskId;
  });
  if (task) {
    task.completed = completed;
    res.json(task);
  } else {
    res.sendStatus(404);
  }
});

var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Exemplo escutando em http://%s:%s", host, port);
});
