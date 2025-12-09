const express=require('express')
const {authMiddleware}=require('../middlewares/auth')
const Task  = require('../models/Task');
const Project=require('../models/Project')

const taskRouter = express.Router();
taskRouter.use(authMiddleware);

/**
 * GET/api/tasks
 */
taskRouter.get('/',async(req, res) =>{
    try{
        const tasks =await Task.find({user:req.user._id})

        res.json(tasks)
    }catch(error){
        console.error(error)
        res.status(500).json({ error:error.message })
    }
});

/**
 * POST /api/tasks
 */

taskRouter.post("/", async (req, res) => {
  try {
    const { task: projectId } = req.params.id;
    const  project = await Project.findById(projectId);
    if (!project)  {
        return res.status(404).json({ message: 'Project not found!' });
    }
    if (project.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to add tasks to this project' });
    }

    const task = await Task.create({
      ...req.body,
      user: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/tasks/:taskId
 */
taskRouter.get('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
        if (!task) return res.status(404).json({ message: 'Task not found' });

        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view this task' });
        }
        const tasks=await Task.find({ project: projectId })

        res.json(task)
    } catch (error) {
        res.status(500).json({error: error.message });
        
    }
});

/**
 * PUT/api/tasks/taskId #
 */

taskRouter.put('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
        if (!task) return res.status(404).json({ message: 'Task not found' });

        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this task' });
        }

        const updated = await Task.findByIdAndUpdate(req.params.id, { new: true});

        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
        
    }
});

// Delete /api/delete

taskRouter.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
        if (!task) return res.status(404).json({ message: 'Task not found' });

        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this task' });
        }

        await Task.findByIdAndDelete(req.params.id)
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
});

module.exports = taskRouter

