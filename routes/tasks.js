const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// GET all tasks
router.get('/', async (req, res) => {
    try {
        console.log('📖 Fetching all tasks...');
        const tasks = await Task.find().sort({ createdAt: -1 });
        console.log(`✅ Found ${tasks.length} tasks`);
        res.json(tasks);
    } catch (err) {
        console.error('❌ Error fetching tasks:', err);
        res.status(500).json({ message: err.message });
    }
});

// GET single task
router.get('/:id', async (req, res) => {
    try {
        console.log('📖 Fetching task:', req.params.id);
        const task = await Task.findById(req.params.id);
        if (!task) {
            console.log('❌ Task not found');
            return res.status(404).json({ message: 'Task not found' });
        }
        console.log('✅ Task found:', task);
        res.json(task);
    } catch (err) {
        console.error('❌ Error fetching task:', err);
        res.status(500).json({ message: err.message });
    }
});

// CREATE task
router.post('/', async (req, res) => {
    try {
        console.log('📝 Creating new task with data:', req.body);
        
        const task = new Task({
            title: req.body.title,
            description: req.body.description,
            priority: req.body.priority || 'medium'
        });

        const newTask = await task.save();
        console.log('✅ Task created successfully:', newTask);
        res.status(201).json(newTask);
    } catch (err) {
        console.error('❌ Error creating task:', err);
        res.status(400).json({ message: err.message, error: err });
    }
});

// UPDATE task
router.put('/:id', async (req, res) => {
    try {
        console.log('🔄 Updating task:', req.params.id, 'with data:', req.body);
        
        const task = await Task.findById(req.params.id);
        if (!task) {
            console.log('❌ Task not found');
            return res.status(404).json({ message: 'Task not found' });
        }

        if (req.body.title != null) task.title = req.body.title;
        if (req.body.description != null) task.description = req.body.description;
        if (req.body.status != null) task.status = req.body.status;
        if (req.body.priority != null) task.priority = req.body.priority;

        const updatedTask = await task.save();
        console.log('✅ Task updated successfully:', updatedTask);
        res.json(updatedTask);
    } catch (err) {
        console.error('❌ Error updating task:', err);
        res.status(400).json({ message: err.message });
    }
});

// DELETE task
router.delete('/:id', async (req, res) => {
    try {
        console.log('🗑️ Deleting task:', req.params.id);
        
        const task = await Task.findById(req.params.id);
        if (!task) {
            console.log('❌ Task not found');
            return res.status(404).json({ message: 'Task not found' });
        }

        await Task.findByIdAndDelete(req.params.id);
        console.log('✅ Task deleted successfully');
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        console.error('❌ Error deleting task:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;