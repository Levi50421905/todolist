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

// Fungsi untuk menangani PUT request (update task)
exports.handler = async (event, context) => {
   try {
      if (event.httpMethod === 'PUT') {
          const taskId = event.pathParameters.id;
          const updatedData = JSON.parse(event.body);
          const updatedTask = await Task.findByIdAndUpdate(taskId, updatedData, { new: true });
          return {
              statusCode: 200,
              body: JSON.stringify(updatedTask),
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
