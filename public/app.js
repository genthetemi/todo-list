// Fetch todos from the server
const fetchTodos = async () => {
    const response = await fetch('/todos');
    const todos = await response.json();
    displayTodos(todos);
};

// Display todos
const displayTodos = (todos) => {
    const todoContainer = document.getElementById('todos');
    todoContainer.innerHTML = '';
    todos.forEach(todo => {
        const todoItem = document.createElement('div');
        todoItem.className = 'todo';
        todoItem.innerHTML = `
            <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleComplete(${todo.id})" />
            <span>${todo.text}</span>
            <button onclick="deleteTodo(${todo.id})">Delete</button>
        `;
        todoContainer.appendChild(todoItem);
    });
};

// Add new todo
const addTodo = async () => {
    const newTodoText = document.getElementById('new-todo').value;
    if (newTodoText) {
        await fetch('/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: newTodoText }),
        });
        fetchTodos();
        document.getElementById('new-todo').value = '';
    }
};

// Delete todo
const deleteTodo = async (id) => {
    await fetch(`/todos/${id}`, { method: 'DELETE' });
    fetchTodos();
};

// Toggle todo complete
const toggleComplete = async (id) => {
    const todos = await (await fetch('/todos')).json();
    const todo = todos.find(t => t.id === id);
    await fetch(`/todos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: todo.text, completed: !todo.completed }),
    });
    fetchTodos();
};

// Fetch todos on load
window.onload = fetchTodos;
