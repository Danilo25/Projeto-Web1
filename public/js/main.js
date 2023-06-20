document.addEventListener('DOMContentLoaded', function() {
  // Carregar as tarefas existentes do arquivo JSON
  var tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
  
  // Variáveis para a manipulação da tela modal
  var addTaskModal = document.getElementById('add-task-modal');
  var modal = document.getElementById('modal');
  
  var titleT = document.getElementById('task-title');
  var taskDescription = document.getElementById('task-description');
  
  var addTaskBtn = document.getElementById('add-task-btn');
  var saveTaskBtn = document.getElementById('save-task-btn');
  var closeAddTaskBtn = document.getElementById('cancel-task-btn');
  
  var deleteTaskBtn = document.getElementById('delete-task');
  var completeTaskBtn = document.getElementById('complete-task');
  var closeTaskBtn = document.getElementById('close-task');
  
  var selectedTaskIndex = -1; // Índice da tarefa selecionada
  
  // Função para atualizar a exibição das tarefas na página
  function renderTasks() {
    var taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
  
    tasks.forEach(function (task, index) {
      var taskItem = document.createElement('li');
      var taskText = document.createElement('span');
      taskText.innerText = task.text;
  
      // Marcar como concluída
      if (task.completed) {
        taskText.classList.add('completed');
      }
  
      // Abrir a tela modal ao clicar na tarefa
      taskText.addEventListener('click', function () {
        if (!modal.classList.contains('show')) {
          selectedTaskIndex = index; // Atualiza o índice da tarefa selecionada
          openModal();
        }
      });
  
      taskItem.appendChild(taskText);
      taskList.appendChild(taskItem);
    });
  }
  //Abrir tela de adicionar tarefas
  function openAddTaskModal() {
    addTaskModal.classList.add('show');
  }
  
  // Função para fechar a tela de adicionar tarefas
  function closeAddTaskModal() {
    addTaskModal.classList.remove('show');
  }
  
  // Evento de clique no botão "Adicionar Tarefa"
  addTaskBtn.addEventListener('click', function () {
    addTask();
  })
  
  // Função para abrir a tela modal
  function openModal() {
    if (selectedTaskIndex !== -1) {
      var task = tasks[selectedTaskIndex];
      modal.classList.add('show');
      titleT.innerHTML = task.text;
      taskDescription.innerHTML = task.description;
    }
  
  
    // Verificar se a tarefa está concluída
    if (task.completed) {
      completeTaskBtn.textContent = 'Desmarcar';
    } else {
      completeTaskBtn.textContent = 'Concluir';
    }
  }
  
  // Função para fechar a tela modal
  function closeModal() {
    modal.classList.remove('show');
    selectedTaskIndex = -1; // Limpa o índice da tarefa selecionada
  }
  
  // Ação de excluir tarefa
  deleteTaskBtn.addEventListener('click', function () {
    if (selectedTaskIndex !== -1) {
      tasks.splice(selectedTaskIndex, 1);
      saveTasks();
      renderTasks();
      closeModal();
    }
  });
  
  // Ação de marcar ou desmarcar tarefa como concluída
  completeTaskBtn.addEventListener('click', function () {
    if (selectedTaskIndex !== -1) {
      var task = tasks[selectedTaskIndex];
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
      closeModal();
    }
  });
  
  // Ação de fechar a tela modal
  closeTaskBtn.addEventListener('click', function () {
    closeModal();
  });
  
  // Função para adicionar uma nova tarefa
  // Função para adicionar uma nova tarefa
  function addTask() {
    var caracteres = 150;
    var taskInput = document.getElementById('new-task-input');
    var taskText = taskInput.value.trim();
    var descriptionInput = document.getElementById('new-task-description');
    var descriptionText = descriptionInput.value.trim();
  
    if (taskText !== '') {
      // Verificar limite de caracteres da descrição
      if (descriptionText.length > 150) {
        alert('A descrição deve ter no máximo 150 caracteres.');
        return;
      }
  
      tasks.push({ text: taskText, description: descriptionText, completed: false });
      saveTasks();
      taskInput.value = '';
      descriptionInput.value = '';
      renderTasks();
      closeAddTaskModal(); // Fechar o modal após adicionar a tarefa
    }
  }
  
  // Evento de input na descrição da tarefa para atualizar o contador de caracteres restantes
  document.getElementById('new-task-description').addEventListener('input', function () {
    var descriptionInput = document.getElementById('new-task-description');
    var descriptionLimit = document.getElementById('description-limit');
    caracteres = 150 - descriptionInput.value.length;
    descriptionLimit.textContent = 'Caracteres restantes: ' + caracteres;
  });
  
  // Evento de clique no botão "Adicionar Tarefa"
  addTaskBtn.addEventListener('click', function () {
    openAddTaskModal();
  });
  
  // Evento de clique no botão "Salvar" dentro do modal de adicionar tarefas
  saveTaskBtn.addEventListener('click', function () {
    addTask();
  });
  
  // Evento de clique no botão "Cancelar" dentro do modal de adicionar tarefas
  closeAddTaskBtn.addEventListener('click', function () {
    closeAddTaskModal();
  });
  
  // Função para salvar as tarefas no arquivo JSON
  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
  
  // Renderizar as tarefas na página ao carregar
  renderTasks();
  });