const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {userOne,userOneId,setupDatabase} = require('./fixtures/db')

//beforeEach() and afterEach() get a function as argument and run it before or after each test.
//beforeAll() and afterAll() get a function as argument and run it once before or after all tests.
//Before runing the tests we want to clear the database (users creation will be failed if same user
//already exists).
beforeEach(setupDatabase)

//First, we must create a test just like we create using Jest. It should test app requests so it's
//also should be async function to allow us using await. Inside the test function we use request
//function that imported from supertest and wrap with await cause it's async function.
//The request function need express app as argument (the app could be down). The request chaining
//syntax working this way:
//First: request type with the route path.
//[Optional]: set() to set request params (like authorization).
//[Optional]: attach() to attach file to request.
//Second: send() allow us to add object represent the request body.
//Third: expect method for check the http request code.
test('Should signup a new user', async () => {
    const response = await request(app)
        .post('/users')
        .send({
            name: 'Gal',
            email: 'gal@example.com',
            password: 'Red12345!'
        }).expect(201)
    // Assert that database was changed correctly:
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assertions about the response:
    expect(response.body).toMatchObject({
        user: {
            name: 'Gal',
            email: 'gal@example.com',
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('Red12345!')
})

test('Should login existing user', async () => {
    const response = await request(app)
        .post('/users/login')
        .send({
            email: userOne.email,
            password: userOne.password
        }).expect(200)
    //Check if the user login and the token saved on DB.
    const user = await User.findById(userOneId)
    expect(user.tokens[1].token).toBe(response.body.token)
})

test('Should not login nonexistent user', async () => {
    await request(app)
        .post('/users/login')
        .send({
            email: userOne.email,
            password: 'BadPassword1!'
        }).expect(400)
})

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async()=>{
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete account for user',async()=>{
    await request(app)
        .delete('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    //Check that the user is no longer  exists in DB.
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should not delete account for unauthenticated user', async()=>{
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image', async()=>{
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        //Attach a file as form-data witch the first argument is the key and the second is the path.
        .attach('avatar','tests/fixtures/profile-pic.jpg')
        .expect(200)
    //Check if the user.avatar stored in the DB is a Buffer type. 
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields',async()=>{
    await request(app)
        .patch('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Or'
        }).expect(200)
    //Check that the updated commited to DB.
    const user = await User.findById(userOneId)
    expect(user.name).toEqual('Or')
})

test('Should not update invalid user fields',async()=>{
    await request(app)
        .patch('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Tel Aviv'
        }).expect(400)
})