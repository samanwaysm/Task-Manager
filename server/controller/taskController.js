const mongoose = require("mongoose");

var taskDb = require("../model/taskSchema");


exports.addTask = async (req,res)=>{
    try {
        const { task, description } = req.body;
        const userId = req.session.userId;
        let errors = {};

        if (!task) errors.task = 'Task is required';
        if (!description) errors.description = 'Description is required';

        if (Object.keys(errors).length > 0) {
            req.session.errors = errors;
            return res.redirect('/add-task');
        }

        const newTask = {
            task,
            description,            
        };

        let userTasks = await taskDb.findOne({ userId });

        if (!userTasks) {
            userTasks = new taskDb({
                userId: new mongoose.Types.ObjectId(userId),
                tasks: [newTask]
            });
        } else {
            userTasks.tasks.push(newTask);
        }

        await userTasks.save();
        res.redirect('/');
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

exports.displayTask = async (req,res)=>{
    try {
        const userId = req.query.userId;
        const userTasks = await taskDb.findOne({ userId });

        if (!userTasks || !userTasks.tasks || userTasks.tasks.length === 0) {
            console.log('No tasks found for the user.');
            return res.status(200).json([]);
        }
        res.status(200).json(userTasks.tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

exports.editTask = async (req,res)=>{
    try {
        const { taskId } = req.params;
        const { task, description } = req.body;
        const ab = await taskDb.findOne({ 'tasks._id': taskId},{'tasks.$':1})

        const updatedTask = await taskDb.updateOne(
            { 'tasks._id': taskId },
            { '$set': {
                'tasks.$.task': task,
                'tasks.$.description': description
            }}
        );
        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json({ message: 'Task updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

exports.deleteTask = async (req,res)=>{
    try {
        const { taskId } = req.params;

        const updatedTask = await taskDb.updateOne(
            { 'tasks._id': taskId },
            { '$pull': { 'tasks': { '_id': taskId } } }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

exports.updateStatus = async (req, res) => {
    const { taskId, status } = req.body;
    try {
        const task = await taskDb.findOneAndUpdate(
            { "tasks._id": taskId },
            { "$set": { "tasks.$.status": status } },
            { new: true }
        );

        // if (!task) {
        //     return res.status(404).send({ message: "Task not found" });
        // }
        res.redirect('/')
    } catch (error) {
        res.status(500).send({ message: "Server error", error });
    }
};

exports.searchTasks = async (req, res, next) => {
    try {
        const { userId } = req.session;
        const { query } = req.query;
        console.log(userId,query);
        const tasks = await taskDb.find({
            userId,
            'tasks': {
                $elemMatch: {
                    $or: [
                        { task: { $regex: query, $options: 'i' } },
                        { description: { $regex: query, $options: 'i' } }
                    ]
                }
            }
        });

        const filteredTasks = tasks[0].tasks.filter(task =>
            new RegExp(query, 'i').test(task.task) || new RegExp(query, 'i').test(task.description)
        );
        res.status(200).json(filteredTasks);

    }catch (err) {
        next(err);
    }
};

exports.sortTasks = async (req, res, next) => {
    try {
        const { userId } = req.session;
        const { sortBy } = req.query;
        
        const sortOption = sortBy === 'recent' ? { createdAt: -1 } : { createdAt: 1 };

        // Find tasks for the user and sort them
        const userTasks = await taskDb.findOne({ userId });

        if (!userTasks || !userTasks.tasks) {
            return res.status(404).json({ message: 'No tasks found for the user.' });
        }

        const sortedTasks = userTasks.tasks.sort((a, b) => {
            if (sortOption.createdAt === -1) {
                return new Date(b.createdAt) - new Date(a.createdAt);
            } else {
                return new Date(a.createdAt) - new Date(b.createdAt);
            }
        });
        // Send sorted tasks as a response
        res.status(200).json(sortedTasks);
    } catch (err) {
        next(err);
    }
};