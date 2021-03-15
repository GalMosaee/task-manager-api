//Mongoose configuration for application.
const mongoose = require('mongoose')
const validator = require('validator')

//Work almost simillar to mongodb.connect(). The only different is that in the connect path we also
//use the database name (in mongodb.connect() we open client after the conncection successed).
mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api',{
    useNewUrlParser: true,
    useCreateIndex: true
})

//Modelling user data. Use capital letter for data model. mongoose.model() need 2 arguments:
//First: model name.
//Second: model fields and types, validators (predefined or custom) and more.
//We can use new User({}) as constructor to create an User object.
//Mongoose allow us to use validators when setting a model. The validator validate some
//more things than field's type. To use custom validator, we need to add to an field "validate"
//function that throw error if the value is invalid.
//Mongoose allow us sanitization to manipulate fields (for example lowercase strings or default values).
const User = mongoose.model('User',{
    name: {
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid!')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password cannot contains "password"!')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        //Custom validator:
        validate(value) {
            if(value<0){
                throw new Error('Age must be a positive number!')
            }
        }
    }
})

const Task = mongoose.model('Task',{
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
})

const task = new Task({
    description: 'Learn the Mongoose Library',
    //completed: false
})

task.save().then((task)=>{
    console.log(task)
}).catch((error)=>{
    console.log(error)
})

// const me = new User({
//     name: "   Gal   ",
//     email: 'Galm@gmail.com   ',
//     password: 'phone098!'
// })

// //save() store the data in this model on the database.
// me.save().then((me)=>{
//     console.log(me)
// }).catch((error)=>{
//     console.log('Error!', error)
// })