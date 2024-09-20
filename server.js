const express = require('express');
const app = express();
const PORT = 3000;

let tasks = [];

app.use(express.json());
app.use(express.static('public'));

// GET all tasks
app.get('/api/tasks', (req, res) => {
    res.json(tasks);
});

// POST a new task
app.post('/api/tasks', (req, res) => {
    const { task, dueDate, priority, type, progress } = req.body;
    tasks.push({ task, dueDate, priority, type, progress });
    res.status(201).json({ message: 'Task added successfully!' });
});

// PUT to update a task
app.put('/api/tasks/:index', (req, res) => {
    const index = req.params.index;
    const updatedTask = req.body;
    tasks[index] = updatedTask; // Update the task at the specific index
    res.status(200).json({ message: 'Task updated successfully!' });
});

// DELETE a task
app.delete('/api/tasks/:index', (req, res) => {
    const index = req.params.index;
    tasks.splice(index, 1);
    res.status(200).json({ message: 'Task deleted successfully!' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});