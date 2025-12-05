const mongoose = require('mongoose');


const taskSchema = new mongoose.Schema({
    project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
    },
    name: {
        type: String,
        required: true
     },
     description: {
        type: String,
        required: true
     },
     status: {
        type: String,
        enum: ['Todo', 'in-progress', 'done']
     }
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;