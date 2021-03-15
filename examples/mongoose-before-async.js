//We only runt this module for the mongoose conection creation.
require('./db/mongoose')
const express = require('express')
//Import the models:
const User = require('./models/user')
const Task = require('./models/task')

const app = express()
const port = process.env.PORT || 3000

//This set automatically parse for coming JSON to object.
app.use(express.json())

app.post('/users',(req,res)=>{
    const user = new User(req.body)
    user.save().then((user)=>{
        res.status(201).send(user)
    }).catch((e)=>{
        //res.status() Set the response status before send it (Default is 200).
        //Go to httpstatuses.com for more statuses info.
        res.status(400).send(e)
    })
})

app.get('/users',(req,res)=>{
    //Mongoose query for searching in DB. The Syntax is: Model.find({FILTER}).then().catch().
    //find() return an array of users.
    User.find({},).then((users)=>{
        res.send(users)
    }).catch((e)=>{
        res.status(500).send()
    })
})

//:id is an express path parameter. We can use id in the request and it defined by the URL path.
//To use path parameter we need to use req.params.PARAMETER_KEY. For searching by ID findById()
//is recommanded. For searching with filters findOne() should be using. If no matching user found
//in database there is no error, we should handle it. Because of the fact that ObjectId is 12-byte
//findById() will try to cast the string passed to ObjectId. If the string length is different than
//12 or any other casting issues it may be failed and skip "then" and go to "catch".
app.get('/users/:id',(req,res)=>{
    const _id = req.params.id
    User.findById(_id).then((user)=>{
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    }).catch((e)=>{
        res.status(500).send()
    })
})

app.post('/tasks',(req,res)=>{
    const task = new Task(req.body)
    task.save().then((task)=>{
        res.status(201).send(task)
    }).catch((e)=>{
        res.status(400).send(e)
    })
})

app.get('/tasks',(req,res)=>{
    Task.find({}).then((tasks)=>{
        res.send(tasks)
    }).catch((e)=>{
        res.status(500).send()
    })
})

app.get('/tasks/:id',(req,res)=>{
    const _id = req.params.id
    Task.findById(_id).then((task)=>{
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }).catch((e)=>{
        res.status(500).send()
    })
})

app.listen(port,()=>{
    console.log('Server is up on port ' + port)
})