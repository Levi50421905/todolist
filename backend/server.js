const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Koneksi ke MongoDB Atlas
mongoose.connect('mongodb+srv://levialfarezziar:levi230503@leviar.0hfhb.mongodb.net/todolist?retryWrites=true&w=majority&appName=LeviAR')
   .then(() => {
    console.log("Connected to MongoDB Atlas");
}).catch(err => {
    console.error("Error connecting to MongoDB Atlas:", err);
});

// Model MongoDB
const taskSchema = new mongoose.Schema({
    subject: String,
    deadline: String,
    status: String
});

const Task = mongoose.model('Task', taskSchema);

// Endpoint CRUD
app.get('/tasks', async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

app.post('/tasks', async (req, res) => {
    const newTask = new Task(req.body);
    await newTask.save();
    res.json(newTask);
});

app.put('/tasks/:id', async (req, res) => {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
});

app.delete('/tasks/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
});

// Menjalankan server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
