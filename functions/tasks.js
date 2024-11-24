const mongoose = require('mongoose');
require('dotenv').config();

// Schema
const taskSchema = new mongoose.Schema({
    subject: String,
    deadline: String,
    status: String
});

// Mengecek apakah model sudah ada sebelumnya
const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);

// Database connection
let cachedDb = null;
async function connectDb() {
    if (cachedDb) return cachedDb;
    
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI);
        cachedDb = db;
        return db;
    } catch (error) {
        console.error('DB Connection error:', error);
        throw error;
    }
}

exports.handler = async (event) => {
    try {
        await connectDb();
        
        const headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
        };

        // Handle CORS preflight
        if (event.httpMethod === 'OPTIONS') {
            return { statusCode: 200, headers };
        }

        if (event.httpMethod === 'GET') {
            const tasks = await Task.find();
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(tasks)
            };
        }

        if (event.httpMethod === 'POST') {
            const data = JSON.parse(event.body);
            const task = new Task(data);
            await task.save();
            return {
                statusCode: 201,
                headers,
                body: JSON.stringify(task)
            };
        }

        if (event.httpMethod === 'PUT') {
            const id = event.path.split('/').pop();
            const data = JSON.parse(event.body);
            const task = await Task.findByIdAndUpdate(id, data, { new: true });
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(task)
            };
        }

        if (event.httpMethod === 'DELETE') {
            const id = event.path.split('/').pop();
            await Task.findByIdAndDelete(id);
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ message: 'Deleted successfully' })
            };
        }

    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ error: error.message })
        };
    }
};
