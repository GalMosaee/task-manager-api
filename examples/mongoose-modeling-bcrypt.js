const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

//By default mongoose use default schema when modeling object.
//By define the schema and use the schema in the mongoose.model() we allowed to
//change some schema default behaviors (like hashing the password). It called Middleware.
const userSchema = new mongoose.Schema({
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
    }
)

//userSchema could use 2 middleware function, pre() and post() for set some changes on
//the object before or after it saved. 2 arguments needed:
//First: event name.
//Second: a function to execute. Because we need the this keyword it is important to use
//standard function instead of arrow function "()=>". It should be also async to allow us
//using async function and await keyword. next() is a callback using to finish the function.
//If next() will not be used the function run forever.
//Important issue: we set a function only for save event! we must be sure all our creating and
//updating method using save and no other mongoose method like findByIdAndUpdate!
userSchema.pre('save',async function(next){
    const user = this
    //user.isModified() get field name to check if changed. It's relevant for creation
    //and updates.
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

const User = mongoose.model('User',userSchema)

module.exports = User