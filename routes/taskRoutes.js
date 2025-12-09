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
 * POST /api/tasks/projectID/task
 */

taskRouter.post("/:projectId/task", async (req, res) => {
  try {
    // const { task: projectId } = req.params.id;
    const { projectId } = req.params;
    const  project = await Project.findById(projectId);
    if (!project)  {
        return res.status(404).json({ message: 'Project not found!' });
    }
    if (project.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to add tasks to this project' });
    }

    const task = await Task.create({
      ...req.body,
      project: projectId
    });

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/projects/:projectId
 */
taskRouter.get("/:projectId", async (req, res) => {
	try {
		const { projectId } = req.params;
		const project = await Project.findById(projectId);
		if (!project) {
			return res.status(404).json({
				message: Project`Project with id: ${projectId} not found!`,
			});
		}
		//console.log(req.user)
		if (project.user.toString() !== req.user._id.toString()) {
			return res.status(403).json({ message: "User is not authorized!" });
		}
		const tasks = await Task.find({ project: projectId });
		res.json(tasks);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
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

/**
 * DELETE /api/projects/projectId
 */

taskRouter.delete("/:projectId", async (req, res) => {
  try {
        const deleteProject = await Project.findById(req.params.projectId)//finding the user's project with the help of id.
    if (req.user._id !== deleteProject.user.toString()){
      return res.status(403).json({message: "This user is not authorized to Delete this project."});
    }

    await Task.deleteMany({ project: req.params.projectId });
    
    const project = await Project.findByIdAndDelete(req.params.projectId)
    res.json({message: "Project DELETED"})
  } catch (error) {
    res.status(500).json({error: error.message})
  }
});

module.exports = taskRouter

