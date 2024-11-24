const { connectToDatabase, Task } = require('./utils/db');

exports.handler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    
    try {
        await connectToDatabase();
        
        const path = event.path.replace('/.netlify/functions/api/', '');
        const method = event.httpMethod;

        // CORS Headers
        const headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
        };

        // Handle OPTIONS request
        if (method === 'OPTIONS') {
            return {
                statusCode: 200,
                headers
            };
        }

        if (path === 'tasks') {
            switch (method) {
                case 'GET':
                    const tasks = await Task.find();
                    return {
                        statusCode: 200,
                        headers,
                        body: JSON.stringify(tasks)
                    };

                case 'POST':
                    const data = JSON.parse(event.body);
                    const newTask = new Task(data);
                    await newTask.save();
                    return {
                        statusCode: 201,
                        headers,
                        body: JSON.stringify(newTask)
                    };
            }
        }

        if (path.startsWith('tasks/')) {
            const id = path.split('/')[1];
            
            switch (method) {
                case 'PUT':
                    const updateData = JSON.parse(event.body);
                    const updatedTask = await Task.findByIdAndUpdate(
                        id,
                        updateData,
                        { new: true }
                    );
                    return {
                        statusCode: 200,
                        headers,
                        body: JSON.stringify(updatedTask)
                    };

                case 'DELETE':
                    await Task.findByIdAndDelete(id);
                    return {
                        statusCode: 200,
                        headers,
                        body: JSON.stringify({ message: 'Task deleted' })
                    };
            }
        }

        return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ message: 'Not Found' })
        };

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