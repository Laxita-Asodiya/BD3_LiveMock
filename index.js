const express = require("express");
const app = express();

app.use(express.json());

const tasks = [
  {
    id: 1,
    title: "Fix a critical bug",
    project: "Project Alpha",
    assignedTo: "Bob",
    priority: "low",
    status: "open",
  },
  {
    id: 2,
    title: "Implement a new feature",
    project: "Project Alpha",
    assignedTo: "Charlie",
    priority: "low",
    status: "in progress",
  },
  {
    id: 3,
    title: "Write documentation",
    project: "Project Beta",
    assignedTo: "Bob",
    priority: "medium",
    status: "open",
  },
  {
    id: 4,
    title: "write logic",
    project: "Project demo",
    assignedTo: "Bob",
    priority: "high",
    status: "in progress",
  },
];


//Function to fetch all projects

function fetchAllTasksForProject(projectName) {
  const projectTasks = tasks.filter((i) => {
    if (i.project.toLowerCase() === projectName.toLowerCase()) {
      return i;
    }
  });
  return projectTasks;
}

//function to sort by tasks in decending order

function sortByTasks() {
  const projectCounts = [];

  tasks.forEach((task) => {
    const project = projectCounts.find((i) => i.project === task.project);

    if (project) {
      project.taskCount += 1;
    } else {
      projectCounts.push({ project: task.project, taskCount: 1 });
    }
  });
  projectCounts.sort((a, b) => b.taskCount - a.taskCount);

  return projectCounts;
}


function sortTasksByPriority(){

    const sortedByPriority=[]

    const highPriorityTasks=tasks.filter((i)=>{
        if(i.priority==="high") sortedByPriority.push(i)
    })

    const mediumPriorityTasks=tasks.filter((i)=>{
        if(i.priority==="medium") sortedByPriority.push(i)
    })

    const lowPriorityTask=tasks.filter((i)=>{
        if(i.priority==="low") sortedByPriority.push(i)
    })
    

    return sortedByPriority

}



//Add new task

function addNewTask(task) {
  if (
    task.title == undefined ||
    task.project == undefined ||
    task.assignedTo == undefined ||
    task.priority == undefined ||
    task.status == undefined
  ) return "Required parameteres are missing!"

  const id=tasks.length+1

  const newTask={
    id:id,
    title:task.title,
    project:task.project,
    assignedTo:task.assignedTo,
    priority:task.priority,
    status:task.status
  }

  tasks.push(newTask)

  return tasks

}


function fetchTasksByName(name){
    const task= tasks.filter((i)=>{
        if((i.assignedTo).toLowerCase()===(name).toLowerCase()){
            return i
        }
    })
    return task
}

function fetchAllPendingTasks(){
    const pendingTasks=tasks.filter((i)=>{
        if(i.status==='in progress'){
            return i
        }
    })
    return pendingTasks
}


function updateTaskById(id,status){
    const task=tasks.find((i)=>{
        if(i.id===id) {
            i.status=status
            return i
        }
    })

    return task
}

//View All Tasks for a Project

app.get("/projects/:name/tasks", (req, res) => {
  try {
    const name = req.params.name;
    if (!name || name === undefined)
      return res.status(404).json({ error: "Project name is required!" });

    const result = fetchAllTasksForProject(name);

    if (result.length <= 0)
      return res.status(200).json({ message: "No tasks for this project!" });
    res.status(200).json({ projectTaks: result });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

//Sort Tasks by Project Size

app.get("/projects/sort/by-task-size", (req, res) => {
  try {
    const result = sortByTasks();
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

//Add a New Task

app.get("/tasks", (req, res) => {
  try {
    const newTask = req.body;
    if(!newTask) res.status(404).json({message:"Task data is required!"})
    const result=addNewTask(newTask)

    res.status(201).json({Tasks:result})
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.get('/users/:name/tasks',(req,res)=>{
    try{
        const name=req.params.name 
        if(!name) return res.status(204).json({message:"Name is required!"})
        const result=fetchTasksByName(name)
        res.status(200).json(result)
    }catch(error){
        res.status(500).json({ error: error });
    }
})

app.get('/tasks/pending',(req,res)=>{
    try{
        const result=fetchAllPendingTasks()

        if(result.length<=0) return res.status(200).json({message:"No pending tasks!"})

        res.status(200).json({pending_tasks:result})
    }catch(error){
        res.status(500).json({ error: error });
    }
})

app.get('/tasks/sort/by-priority',(req,res)=>{
    try{

        const result=sortTasksByPriority()

        res.status(200).json({sortedTasksByPriority:result})
    }catch(error){
        res.status(500).json({ error: error });
    }
})

app.post('/tasks/:id/status',(req,res)=>{
    try{
        const id=parseInt(req.params.id)
        const status=req.body.status

        if(!id) return res.status(404).json({message:"Id is required!"})
        const result=updateTaskById(id,status)
        
        return res.status(201).json({updatedTask:result})
    }catch(error){
        res.status(500).json({ error: error });
    }
})

app.listen(3000, () => {
  console.log(`Server is running on port 3000!`);
});
