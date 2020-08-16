//This file created for allow us separate the tests file and remove the dependencies between task
//tests and user tests. This file will configure all the data for all the test users and test tasks,
//and all before and after function that will be used every test.
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

//Test users we will be use in tests (with valid token).
const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Omer',
    email: 'omer@example.com',
    password: 'Red12345!',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}
 
const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'Guy',
    email: 'guy@example.com',
    password: 'Red12345!',
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }]
}

//Test tasks we will be use in tests.
const taskOne = { 
    _id: new mongoose.Types.ObjectId(),
    description: 'First Task',
    completed: false,
    owner: userOneId
}

const taskTwo = { 
    _id: new mongoose.Types.ObjectId(),
    description: 'Second Task',
    completed: true,
    owner: userOneId
}

const taskThree = { 
    _id: new mongoose.Types.ObjectId(),
    description: 'Third Task',
    completed: true,
    owner: userTwoId
}

const setupDatabase = async ()=>{
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase
}