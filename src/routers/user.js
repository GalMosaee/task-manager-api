const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeEmail, sendCancelationEmail} = require('../emails/account')
//Router allow us to separate our express app file to several files.
//We can create a Route, add some REST functions and last in the express
//application file use them (by import the routes and use app.use(ROUTER)).
const router = new express.Router()

//While Login (either create user and login user) we send a user and token.
//It allows us to store some basic user data in the request.

router.post('/users',async(req,res)=>{
    const user = new User(req.body)
    try{
        await user.save()
        sendWelcomeEmail(user.email,user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user,token})
    }catch(e) {
        res.status(400).send(e)
    }
})

router.post('/users/login',async(req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.send({user,token})
    } catch(e){
        res.status(400).send()
    }
})

router.post('/users/logout',auth,async(req,res)=>{
    try{
        //The req.user.tokens contains all user's token. We removing the req current token.
        req.user.tokens = req.user.tokens.filter((token)=>token.token!==req.token)
        //After removing current token we save it to the database.
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

router.post('/users/logoutAll',auth,async(req,res)=>{
    try{
        //The req.user.tokens contains all user's token. We removing all of them.
        req.user.tokens = []
        //After removing all the user's tokens we save it to the database.
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

router.get('/users/me',auth,async(req,res)=>{
    res.send(req.user)
})

router.patch('/users/me',auth ,async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','email','password','age']
    const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))
    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updates!'})
    }
    try{
        //For allow mongoose to use middleware event (like save), in our example to allow
        //password hashing we cannot use findByIdAndUpdate(), we have to use save().
        const user = req.user
        updates.forEach((update)=>user[update] = req.body[update])
        await user.save()
        //const user = await User.findByIdAndUpdate(_id,req.body,{new: true,runValidators:true})
        res.send(user)
    } catch(e){
        res.status(400).send(e)
    }
})

router.delete('/users/me',auth, async(req,res)=>{
    try{
        await req.user.remove()
        sendCancelationEmail(req.user.email,req.user.name)
        res.send(req.user)
    }catch(e){
        res.status(500).send()
    }
})

const upload = multer({
    //dest: 'avatars',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            cb(new Error('Please upload an image'))
        }
        cb(undefined,true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async(req,res)=>{
    //sharp() get an argument (file buffer) and allow to execute some convertion as chain.
    //For example: resize and format change (png, jpg...). At the end of the chaining we need
    //to use some "terminal" method like toBuffer() or toFile().
    const buffer = await sharp(req.file.buffer).resize({width: 250,height: 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar', auth, async(req,res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async(req,res)=>{
    try{
        const user = await User.findById(req.params.id)
        if(!user||!user.avatar){
           throw new Error()
        }
        //Set the respond different Content-Type from application/json (the default type).
        res.set('Content-Type','image/png')
        res.send(user.avatar)
    } catch(e){
        res.status(404).send()
    }
})

module.exports = router