document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.getElementById('add-btn');
  const todoInput = document.getElementById('todo-input');
  const todoList = document.getElementById('todo-list');

  // Modals
  const modifyModal = document.getElementById('modify-modal');
  const reminderModal = document.getElementById('reminder-modal');
  const closeModifyBtn = document.getElementById('close-modify-btn');
  const closeReminderBtn = document.getElementById('close-reminder-btn');

  // Local storage
  const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

  // Load saved tasks
  savedTasks.forEach(task => {
    createTaskElement(task.text, task.reminder, task.id, task.isChecked, task.lastUpdated);
  });

  // Add new task
  addBtn.addEventListener('click', () => {
    const taskText = todoInput.value.trim();
    if (taskText) {
      const task = {
        id: Date.now(),
        text: taskText,
        reminder: '',
        isChecked: false,
        lastUpdated: new Date().toLocaleString(),
      };
      savedTasks.push(task);
      localStorage.setItem('tasks', JSON.stringify(savedTasks));
      createTaskElement(task.text, task.reminder, task.id, task.isChecked, task.lastUpdated);
      todoInput.value = '';
    }
  });

  // Create task element
  function createTaskElement(taskText, reminder, id, isChecked, lastUpdated) {
    const li = document.createElement('li');
    li.classList.add('todo-item');
    li.dataset.id = id;

    const taskName = document.createElement('span');
    taskName.classList.add('task-name');
    if (isChecked) taskName.style.textDecoration = 'line-through';
    taskName.innerText = taskText;

    const lastUpdatedSpan = document.createElement('span');
    lastUpdatedSpan.classList.add('last-updated');
    lastUpdatedSpan.innerText = `Last updated: ${lastUpdated}`;

    const modifyBtn = document.createElement('button');
    modifyBtn.classList.add('modify-btn');
    modifyBtn.innerText = 'Modify';
    modifyBtn.addEventListener('click', () => {
      const task = savedTasks.find(task => task.id === id);
      document.getElementById('modified-task-text').value = task.text;
      modifyModal.style.display = 'flex';
      currentTaskId = id;
    });

    const reminderBtn = document.createElement('button');
    reminderBtn.classList.add('reminder-btn');
    reminderBtn.innerText = 'Set Reminder';
    reminderBtn.addEventListener('click', () => {
      reminderModal.style.display = 'flex';
      currentTaskId = id;
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.innerText = 'Delete';
    deleteBtn.addEventListener('click', () => {
      deleteTask(id);
    });

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = isChecked;
    checkbox.addEventListener('change', () => {
      toggleTaskCheck(id);
    });

    li.appendChild(checkbox);
    li.appendChild(taskName);
    li.appendChild(lastUpdatedSpan);
    li.appendChild(modifyBtn);
    li.appendChild(reminderBtn);
    li.appendChild(deleteBtn);
    todoList.appendChild(li);
  }

  // Toggle task check/uncheck
  function toggleTaskCheck(id) {
    const task = savedTasks.find(task => task.id === id);
    task.isChecked = !task.isChecked;
    task.lastUpdated = new Date().toLocaleString();
    localStorage.setItem('tasks', JSON.stringify(savedTasks));
    document.querySelector(`[data-id="${id}"] .task-name`).style.textDecoration = task.isChecked ? 'line-through' : 'none';
    document.querySelector(`[data-id="${id}"] .last-updated`).innerText = `Last updated: ${task.lastUpdated}`;
  }

  // Delete task
  function deleteTask(id) {
    const taskIndex = savedTasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
      savedTasks.splice(taskIndex, 1);
      localStorage.setItem('tasks', JSON.stringify(savedTasks));
      document.querySelector(`[data-id="${id}"]`).remove();
    }
  }

  // Modify task
  let currentTaskId = null;
  closeModifyBtn.addEventListener('click', () => {
    modifyModal.style.display = 'none';
  });

  document.getElementById('save-modify-btn').addEventListener('click', () => {
    const modifiedText = document.getElementById('modified-task-text').value.trim();
    if (modifiedText && currentTaskId) {
      const task = savedTasks.find(task => task.id === currentTaskId);
      task.text = modifiedText;
      task.lastUpdated = new Date().toLocaleString();
      localStorage.setItem('tasks', JSON.stringify(savedTasks));
      document.querySelector(`[data-id="${currentTaskId}"] .task-name`).innerText = modifiedText;
      document.querySelector(`[data-id="${currentTaskId}"] .last-updated`).innerText = `Last updated: ${task.lastUpdated}`;
      modifyModal.style.display = 'none';
    }
  });

  // Set reminder for task
  closeReminderBtn.addEventListener('click', () => {
    reminderModal.style.display = 'none';
  });

  document.getElementById('save-reminder-btn').addEventListener('click', () => {
    const reminderTime = document.getElementById('reminder-date-time').value.trim();
    if (reminderTime && currentTaskId) {
      const task = savedTasks.find(task => task.id === currentTaskId);
      task.reminder = reminderTime;
      task.lastUpdated = new Date().toLocaleString();
      localStorage.setItem('tasks', JSON.stringify(savedTasks));
      document.querySelector(`[data-id="${currentTaskId}"] .last-updated`).innerText = `Last updated: ${task.lastUpdated} | Reminder: ${task.reminder}`;
      reminderModal.style.display = 'none';
    }
  });

  // Particles.js settings
  particlesJS('particles-js', {
    particles: {
      number: {
        value: 50,
      },
      color: {
        value: '#ffffff',
      },
      shape: {
        type: 'circle',
        stroke: {
          width: 0,
        },
      },
      opacity: {
        value: 0.5,
        random: true,
      },
      size: {
        value: 5,
        random: true,
      },
      move: {
        enable: true,
        speed: 1,
        direction: 'none',
        outMode: 'out',
      },
    },
    interactivity: {
      events: {
        onhover: {
          enable: true,
          mode: 'repulse',
        },
      },
    },
  });
});