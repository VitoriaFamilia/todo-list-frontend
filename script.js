const API_URL = 'http://localhost:3000/tasks';

const form = document.getElementById('task-form');
const taskList = document.getElementById('task-list');

// Buscar tarefas
async function getTasks() {
  const response = await fetch(API_URL);
  const tasks = await response.json();
  renderTasks(tasks);
}

// Renderizar tarefas
function renderTasks(tasks) {
  taskList.innerHTML = '';

  tasks.forEach(task => {
    const article = document.createElement('article');
    article.className = `task ${task.completed ? 'done' : ''}`;

    article.innerHTML = `
      <div>
        <h3>${task.title}</h3>
        <p>${task.description || 'Sem descrição'}</p>
      </div>

      <div class="task-actions">
        <input type="checkbox" ${task.completed ? 'checked' : ''} />
        <button>🗑️</button>
      </div>
    `;

    const checkbox = article.querySelector('input');
    const deleteBtn = article.querySelector('button');

    // ✅ Atualizar status (CORRETO)
    checkbox.addEventListener('change', async (e) => {
      const completed = e.target.checked;

      await fetch(`${API_URL}/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed })
      });

      article.classList.toggle('done', completed);
    });

    // Deletar tarefa
    deleteBtn.addEventListener('click', async () => {
      await fetch(`${API_URL}/${task.id}`, {
        method: 'DELETE'
      });

      article.remove();
    });

    taskList.appendChild(article);
  });
}

// Criar tarefa
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;

  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description })
  });

  form.reset();
  getTasks();
});

// Inicialização
getTasks();

