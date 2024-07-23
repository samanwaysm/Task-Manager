const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    tasks: [
        {
            task: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            },
            status: {
                type: String,
                default:'todo'
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
})

const TaskDb = mongoose.model('task', schema);

module.exports = TaskDb;