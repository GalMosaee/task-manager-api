const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
//Router allow us to separate our express app file to several files.
//We can create a Route, add some REST functions and last in the express
//application file use them (by import the routes and use app.use(ROUTER)).
const router = new express.Router()

router.post('/tasks', auth, async(req,res)=>{
    //'...' operator uses to copy all req.body properties to an object.
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch(e){
        res.status(400).send(e)
    }
})

//Get /tasks?limit=10&skip=0 (Pagination support option)
//Get /tasks?completed=true
//Get /tasks?sortBy=FIELD:ORDER (while ORDER could be asc or desc)
router.get('/tasks', auth, async(req,res)=>{
    const match = {}
    const sort = {}
    //This if condition and statement set the filter like that.
    //If there is no query key completed, don't filter.
    //If there is, set match.completed as true only if its value is true. Otherwise set false.
    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }
    //This if condition and statement set the sortBy like that.
    //If there is no query key sortBy, don't sort.
    //If there is, set sort.[FIELD] as -1 only if its value is 'desc'. Otherwise set 1.
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = (parts[1] === 'desc') ? -1: 1
    }
    try{
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch(e){
        res.status(500).send()
    }
})

router.get('/tasks/:id', auth, async(req,res)=>{
    const _id = req.params.id
    try{
        const task = await Task.findOne({ _id , owner: req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/tasks/:id', auth, async(req,res)=>{
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description','completed']
    const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))
    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updates!'})
    }
    try {
        //For allow mongoose to use middleware event (like save), in our example to allow
        //password hashing we cannot use findByIdAndUpdate(), we have to use save().
        const task = await Task.findOne({_id,owner: req.user._id})
        if(!task){
            return res.status(404).send()
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch(e){
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', auth, async(req,res)=>{
    const _id = req.params.id
    try{
        const task = await Task.findOneAndDelete({_id, owner: req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})

module.exports = router