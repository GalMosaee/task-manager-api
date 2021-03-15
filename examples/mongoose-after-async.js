require('./db/mongoose')
const express = require('express')

const User = require('./models/user')
const Task = require('./models/task')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.post('/users',async(req,res)=>{
    const user = new User(req.body)
    //The try wrapp the await, if there is error catch(e) will catch it.
    //It's replace the then() and catch() syntax.
    try{
        await user.save()
        res.status(201).send(user)
    }catch(e) {
        res.status(400).send(e)
    }
    //Without async and await, cb is async.
    // const user = new User(req.body)
    // user.save().then((user)=>{
    //     res.status(201).send(user)
    // }).catch((e)=>{
    //     res.status(400).send(e)
    // })
})

app.get('/users',async(req,res)=>{
    try{
        const users = await User.find({})
        res.send(users)
    } catch(e){
        res.status(500).send()
    }
    //Without async and await, cb is async.
    // User.find({}).then((users)=>{
    //     res.send(users)
    // }).catch((e)=>{
    //     res.status(500).send()
    // })
})

app.get('/users/:id',async(req,res)=>{
    const _id  = req.params.id
    try{
        const user = await User.findById(_id)
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    }catch(e){
        res.status(500).send()
    }
    //Without async and await, cb is async.
    // const _id = req.params.id
    // User.findById(_id).then((user)=>{
    //     if(!user){
    //         return res.status(404).send()
    //     }
    //     res.send(user)
    // }).catch((e)=>{
    //     res.status(500).send()
    // })
})

app.patch('/users/:id',async(req,res)=>{
    const _id = req.params.id
    //Checking if there is tring to update fields that doesn't allowed or exists.
    //It is only provide the user more information about failure, without it the
    //the update ignore disallowed fields and send ok response.
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','email','password','age']
    const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))
    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updates!'})
    }
    //------------------End of checkings-----------------
    try{
        //new option set the return value as the updated object.
        //runValidator option set validator run on fields need to be updated.
        const user = await User.findByIdAndUpdate(_id,req.body,{new: true,runValidators:true})
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    } catch(e){
        res.status(400).send(e)
    }
})

app.delete('/users/:id',async(req,res)=>{
    const _id = req.params.id
    try{
        const user = await User.findByIdAndDelete(_id)
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    }catch(e){
        res.status(500).send()
    }
})

app.post('/tasks',async(req,res)=>{
    const task = new Task(req.body)
    try {
        await task.save()
        res.status(201).send(task)
    } catch(e){
        res.status(400).send(e)
    }
    //Without async and await, cb is async.
    // const task = new Task(req.body)
    // task.save().then((task)=>{
    //     res.status(201).send(task)
    // }).catch((e)=>{
    //     res.status(400).send(e)
    // })
})

app.get('/tasks',async(req,res)=>{
    try{
        const tasks = await Task.find({})
        res.send(tasks)
    } catch(e){
        res.status(500).send()
    }
    //Without async and await, cb is async.
    // Task.find({}).then((tasks)=>{
    //     res.send(tasks)
    // }).catch((e)=>{
    //     res.status(500).send()
    // })
})

app.get('/tasks/:id',async(req,res)=>{
    const _id = req.params.id
    try{
        const task = await Task.findById(_id)
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
    //Without async and await, cb is async.
    // const _id = req.params.id
    // Task.findById(_id).then((task)=>{
    //     if(!task){
    //         return res.status(404).send()
    //     }
    //     res.send(task)
    // }).catch((e)=>{
    //     res.status(500).send()
    // })
})

app.patch('/tasks/:id',async(req,res)=>{
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description','completed']
    const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))
    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updates!'})
    }
    try {
        const task = await Task.findByIdAndUpdate(_id,req.body,{new:true,runValidators:true})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch(e){
        res.status(400).send(e)
    }
})

app.delete('/tasks/:id',async(req,res)=>{
    const _id = req.params.id
    try{
        const task = await Task.findByIdAndDelete(_id)
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})

app.listen(port,()=>{
    console.log('Server is up on port ' + port)
})