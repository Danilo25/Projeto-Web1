var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var fs = require('fs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/tmp/');
  }
});

var upload = multer({ storage: storage });

var tasksFile = 'tarefas.json'; // Nome do arquivo JSON para armazenar as tarefas

function readTasksFromFile() {
  try {
    var data = fs.readFileSync(tasksFile, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.log('Erro ao ler o arquivo de tarefas:', err);
    return [];
  }
}

function saveTasksToFile(tasks) {
  try {
    var data = JSON.stringify(tasks);
    fs.writeFileSync(tasksFile, data, 'utf8');
    console.log('Tarefas salvas no arquivo com sucesso!');
  } catch (err) {
    console.log('Erro ao salvar as tarefas no arquivo:', err);
  }
}

var tasks = readTasksFromFile();
var taskIdCounter = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/tarefas.html');
});

app.get('/api/tasks', function (req, res) {
  res.json(tasks);
});

app.post('/api/tasks', function (req, res) {
  var task = {
    id: taskIdCounter++,
    text: req.body.text,
    description: req.body.description,
    completed: false
  };
  tasks.push(task);
  saveTasksToFile(tasks);
  res.json(task);
});

app.delete('/api/tasks/:id', function (req, res) {
  var taskId = parseInt(req.params.id);
  var index = tasks.findIndex(function (task) {
    return task.id === taskId;
  });
  if (index !== -1) {
    var deletedTask = tasks.splice(index, 1);
    saveTasksToFile(tasks);
    res.json(deletedTask);
  } else {
    res.sendStatus(404);
  }
});

app.put('/api/tasks/:id', function (req, res) {
  var taskId = parseInt(req.params.id);
  var completed = req.body.completed;
  var task = tasks.find(function (task) {
    return task.id === taskId;
  });
  if (task) {
    task.completed = completed;
    saveTasksToFile(tasks);
    res.json(task);
  } else {
    res.sendStatus(404);
  }
});

var server = app.listen(8080, function () {
  console.log("Exemplo escutando em http://localhost:%s", server.address().port);
});
