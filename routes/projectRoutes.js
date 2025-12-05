const express=require('express')
const {authMiddleware}=require('../middlewares/auth')
const Project=require('../models/Project')

const projectRouter=express.Router()

//Protects all routes in this router
projectRouter.use(authMiddleware)

/**
 * GET/api/projects
 */
projectRouter.get('/',async(req,res)=>{
    try{
        const userProjects=await Project.find({user:req.user._id})

        res.json(userProjects)
    }catch(error){
        console.error(error)
        res.status(500).json({ error:error.message })
    }
});

/**
 * GET /api/projects/:projectId
 */
projectRouter.get("/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) {
      return res
        .status(404)
        .json({ message: `Project with id: ${projectId} not found!` });
    }
    // Authorization
    console.log(req.user._id);
    console.log(project.user);
    
    if (project.user.toString() !== req.user._id) {
      return res.status(403).json({ message: "User is not authorized!" });
    }
    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/projects
 */
projectRouter.post("/", async (req, res) => {
  try {
    const newProject = await Project.create({
      ...req.body,
      user: req.user._id,
    });

    res.status(201).json(newProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT/api/projects/project id #
 */
// projectRouter.put('/:projectId',async(req,res)=> {
//     res.send("Create project..")
// });

projectRouter.put("/:projectId", async (req, res) => {
  try {
    const updateProject = await Project.findById(req.params.projectId)//finding the user's project with the help of id.
    if (req.user._id !== updateProject.user.toString()){
      return res.status(403).json({message: "This user is not authorized to update this project."})
    }
    const project = await Project.findByIdAndUpdate( req.params.projectId, req.body, {new:true})// need more explanation
    res.json(project)
  } catch (error) {
    console.log("errer is here", req.body)
    res.status(500).json({error: error.message})
  }
});


 // Delete /api/delete
// projectRouter.delete('/:projectId',async(req,res)=> {
//     res.send("Delete project..")
// });

projectRouter.delete("/:projectId", async (req, res) => {
  try {
        const deleteProject = await Project.findById(req.params.projectId)//finding the user's project with the help of id.
    if (req.user._id !== deleteProject.user.toString()){
      return res.status(403).json({message: "This user is not authorized to Delete this project."})
    }
    const project = await Project.findByIdAndDelete(req.params.projectId)
    res.json({message: "Project DELETED"})
  } catch (error) {
    res.status(500).json({error: error.message})
  }
});



module.exports = projectRouter