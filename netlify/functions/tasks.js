const mongoose = require('mongoose');

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

// Fungsi serverless untuk menangani permintaan GET dan POST
exports.handler = async (event, context) => {
   try {
      if (event.httpMethod === 'GET') {
          // Menangani GET request untuk mengambil semua tugas
          const tasks = await Task.find();
          return {
              statusCode: 200,
              body: JSON.stringify(tasks),
          };
      } else if (event.httpMethod === 'POST') {
          // Menangani POST request untuk menambah tugas baru
          const taskData = JSON.parse(event.body);
          const newTask = new Task(taskData);
          await newTask.save();
          return {
              statusCode: 201,
              body: JSON.stringify(newTask),
          };
      } else {
          return {
              statusCode: 405, // Method Not Allowed
              body: JSON.stringify({ error: 'Method Not Allowed' }),
          };
      }
   } catch (err) {
       return {
           statusCode: 500, // Internal Server Error
           body: JSON.stringify({ error: 'Internal Server Error' }),
       };
   }
};
