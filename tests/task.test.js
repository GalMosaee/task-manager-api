const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const {userOne,userOneId,userTwo,userTwoId,taskOne,taskTwo,taskThree,setupDatabase} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create task for user',async()=>{
    const response = await request(app)
        .post('/tasks')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'From my test'
        }).expect(201)
    //Check if the task just created stored correct in DB
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

test('Should fetch user tasks',async()=>{
    const response = await request(app)
        .get('/tasks')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    //Check that the user fetch exactly 2 tasks.
    expect(response.body.length).toEqual(2)
})

test('Should not delete other users tasks',async()=>{
    const response = await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization',`Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)
    //Check that the task still in DB.
    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})