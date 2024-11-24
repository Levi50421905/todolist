const mongoose = require('mongoose');

let cachedDb = null;

async function connectToDatabase() {
    if (cachedDb) {
        return cachedDb;
    }

    await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    cachedDb = mongoose.connection;
    return cachedDb;
}

const taskSchema = new mongoose.Schema({
    subject: String,
    deadline: String,
    status: String
});

const Task = mongoose.model('Task', taskSchema);

module.exports = {
    connectToDatabase,
    Task
};