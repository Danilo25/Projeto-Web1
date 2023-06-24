document.addEventListener('DOMContentLoaded', function () {
  // Carregar as tarefas existentes do arquivo JSON
  var tasks = [];

  // Variáveis para a manipulação da tela modal
  var addTaskModal = document.getElementById('add-task-modal');
  var taskmodal = document.getElementById('task-modal');

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
        if (!taskmodal.classList.contains('show')) {
          selectedTaskIndex = index; // Atualiza o índice da tarefa selecionada
          openModal();
        }
      });

      taskItem.appendChild(taskText);
      taskList.appendChild(taskItem);
    });
  }

  // Carregar as tarefas existentes do arquivo JSON
  fetch('/api/tasks/file')
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      tasks = data;
      renderTasks(); // Exibe as tarefas na página
    })
    .catch(function (error) {
      console.log('Erro ao obter as tarefas do arquivo:', error);
    });

  // Abrir tela de adicionar tarefas
  function openAddTaskModal() {
    if(!taskmodal.classList.contains('show')){
    addTaskModal.classList.add('show');
    addTaskBtn.style.visibility = 'hidden';
    addTaskBtn.classList.add('disable-hover');
  }

    var descriptionInput = document.getElementById('new-task-description');
    var descriptionLimit = document.getElementById('description-limit');
    var caracteres = 150 - descriptionInput.value.length;
    descriptionLimit.textContent = 'Caracteres restantes: ' + caracteres;

    // Evento de input para atualizar o contador de caracteres
    descriptionInput.addEventListener('input', function () {
      var caracteres = 150 - descriptionInput.value.length;
      descriptionLimit.textContent = 'Caracteres restantes: ' + caracteres;
    });
  }

  saveTaskBtn.addEventListener('click', function (event) {
    event.preventDefault();
    addTask();
  });

  closeAddTaskBtn.addEventListener('click', function (event) {
    event.preventDefault();
    addTaskModal.classList.remove('show');
    addTaskBtn.style.visibility = 'visible';
    addTaskBtn.classList.remove('disable-hover');
  });

  // Função para fechar a tela de adicionar tarefas
  function closeAddTaskModal() {
    addTaskModal.classList.remove('show');
    addTaskBtn.style.visibility = 'visible';
    addTaskBtn.classList.remove('disable-hover');
  }

  // Evento de clique no botão "Adicionar Tarefa"
  addTaskBtn.addEventListener('click', function () {
    openAddTaskModal();
  });

  // Função para abrir a tela modal
  function openModal() {
    if (selectedTaskIndex !== -1 && !addTaskModal.classList.contains('show')) {
      var task = tasks[selectedTaskIndex];
      taskmodal.classList.add('show');
      addTaskBtn.classList.add('disable-hover');
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
    taskmodal.classList.remove('show');
    addTaskBtn.classList.remove('disable-hover');
    selectedTaskIndex = -1; // Limpa o índice da tarefa selecionada
  }

  // Ação de excluir tarefa
  deleteTaskBtn.addEventListener('click', function () {
    if (selectedTaskIndex !== -1) {
      var taskId = tasks[selectedTaskIndex].id;
      deleteTask(taskId);
    }
  });

  // Ação de marcar ou desmarcar tarefa como concluída
  completeTaskBtn.addEventListener('click', function () {
    if (selectedTaskIndex !== -1) {
      var task = tasks[selectedTaskIndex];
      var taskId = task.id;
      var completed = !task.completed;
      updateTaskCompletion(taskId, completed);
    }
  });

  // Ação de fechar a tela modal
  closeTaskBtn.addEventListener('click', function () {
    closeModal();
  });

  // Função para adicionar uma nova tarefa
  function addTask() {
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

      var task = { text: taskText, description: descriptionText, completed: false };

      fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
      })
        .then(function (response) {
          console.log('Pegue isso:', task);
          if (response.ok) {
            return response.json();
          } else {
            console.log('Erro ao adicionar a tarefa:', response.status);
          }
        })
        .then(function (data) {
          if (data) {
            task.id = data.id;
            tasks.push(task);
            saveTasks();
            taskInput.value = '';
            descriptionInput.value = '';
            renderTasks();
            closeAddTaskModal(); // Fechar o modal após adicionar a tarefa
            console.log('Tarefa adicionada com sucesso!');
          }
        })
        .catch(function (error) {
          console.log('Erro ao adicionar a tarefa:', error);
        });
    }
  }

  // Função para excluir uma tarefa
  function deleteTask(taskId) {
    fetch(`/api/tasks/${taskId}`, {
      method: 'DELETE'
    })
      .then(function (response) {
        console.log('Quero excluir a tarefa com ID:', taskId);
        if (response.ok) {
          tasks = tasks.filter(function (task) {
            return task.id !== taskId;
          });
          saveTasks();
          renderTasks();
          closeModal();
          console.log('Tarefa excluída com sucesso!');
        } else {
          console.log('Erro ao excluir a tarefa:', response.status);
        }
      })
      .catch(function (error) {
        console.log('Erro ao excluir a tarefa:', error);
      });
  }

  // Função para atualizar o status de conclusão de uma tarefa
  function updateTaskCompletion(taskId, completed) {
    fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ completed: completed })
    })
      .then(function (response) {
        console.log('Quero atualizar o status de conclusão da tarefa com ID:', taskId);
        if (response.ok) {
          var task = tasks.find(function (task) {
            return task.id === taskId;
          });
          if (task) {
            task.completed = completed;
            saveTasks();
            renderTasks();
            closeModal();
            console.log('Status de conclusão da tarefa atualizado com sucesso!');
          }
        } else {
          console.log('Erro ao atualizar o status de conclusão da tarefa:', response.status);
        }
      })
      .catch(function (error) {
        console.log('Erro ao atualizar o status de conclusão da tarefa:', error);
      });
  }

  // Função para salvar as tarefas no arquivo JSON
  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // Renderizar as tarefas na página ao carregar
  renderTasks();
});