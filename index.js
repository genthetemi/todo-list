// index.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware to parse incoming requests with JSON payloads
app.use(bodyParser.json());

// Simulated database (a JSON file)
const dataFilePath = 'todos.json';

// Utility function to read/write data
const readData = () => JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
const writeData = (data) => fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));

// Serve static files (front-end)
app.use(express.static('public'));

// Get all todos
app.get('/todos', (req, res) => {
    const todos = readData();
    res.json(todos);
});

// Add a new todo
app.post('/todos', (req, res) => {
    const todos = readData();
    const newTodo = {
        id: Date.now(),
        text: req.body.text,
        completed: false,
    };
    todos.push(newTodo);
    writeData(todos);
    res.json(newTodo);
});

// Update a todo
app.put('/todos/:id', (req, res) => {
    const todos = readData();
    const todoIndex = todos.findIndex(todo => todo.id === parseInt(req.params.id));
    if (todoIndex >= 0) {
        todos[todoIndex].text = req.body.text;
        todos[todoIndex].completed = req.body.completed;
        writeData(todos);
        res.json(todos[todoIndex]);
    } else {
        res.status(404).send('Todo not found');
    }
});

// Delete a todo
app.delete('/todos/:id', (req, res) => {
    let todos = readData();
    todos = todos.filter(todo => todo.id !== parseInt(req.params.id));
    writeData(todos);
    res.status(204).send();
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
