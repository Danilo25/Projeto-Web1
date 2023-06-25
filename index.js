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

// Função para ler as tarefas do arquivo JSON
function readTasksFromFile() {
  try {
    var data = fs.readFileSync(tasksFile, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.log('Erro ao ler o arquivo de tarefas:', err);
    return [];
  }
}

// Função para salvar as tarefas no arquivo JSON
function saveTasksToFile(tasks) {
  try {
    var data = JSON.stringify(tasks);
    fs.writeFileSync(tasksFile, data, 'utf8');
    console.log('Tarefas salvas no arquivo com sucesso!');
  } catch (err) {
    console.log('Erro ao salvar as tarefas no arquivo:', err);
  }
}

var tasks = readTasksFromFile(); // Carrega as tarefas do arquivo JSON
var taskIdCounter = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1; // Obtém o próximo ID com base nas tarefas existentes

app.get('/', function (req, res) {
  var tasksFromFile = readTasksFromFile(); // Lê as tarefas do arquivo JSON
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
  saveTasksToFile(tasks); // Salva as tarefas no arquivo JSON
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
    saveTasksToFile(tasks); // Salva as tarefas no arquivo JSON
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
    saveTasksToFile(tasks); // Salva as tarefas no arquivo JSON
    res.json(task);
  } else {
    res.sendStatus(404);
  }
});
// Rota para visualizar o conteúdo do arquivo tarefas.json
app.get('/api/tasks/file', function (req, res) {
  try {
    var data = fs.readFileSync(tasksFile, 'utf8');
    var tasksFromFile = JSON.parse(data);
    res.json(tasksFromFile);
  } catch (err) {
    console.log('Erro ao ler o arquivo de tarefas:', err);
    res.sendStatus(500);
  }
});

var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Exemplo escutando em http://localhost:%s", port);
});