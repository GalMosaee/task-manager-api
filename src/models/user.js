const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Task = require('./task')
const { deleteOne } = require('./task')

//By default mongoose use default schema when modeling object.
//By define the schema and use the schema in the mongoose.model() we allowed to
//change some schema default behaviors (like hashing the password). It called Middleware.
//We can also add options to the schema like timestamp that set createdAt and updatedAt
//timestamps to any object.
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid!')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contains "password"!')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        //Custom validator:
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number!')
            }
        }
    },
    avatar: {
        type: Buffer
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
}
)

//Create virtual fields (depends on relationships and refs).
//It is calls virtual atribute because it's not stored in the collection such as standard fields.
//userSchema.virtual() needs 2 arguments:
//First: the name of the new virtual fields.
//Second: the object that configure the virtual field. In this object we will use 3 fields:
//First: the ref model.
//Second: the localField.
//Third: the foreignField.
//For example, create the relation between localField '_id' of the userScehma and
//foreignField 'owner' of the ref model 'Task'.
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

//This method created for customize the user data we send back.
//When using res.send() express run JSON.stringify() on the object we passed.
//And JSON.strigify() check if there are toJSON on that object to allow object customizations.
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}

//userSchema.methods add method to the user instances. In contrast to statics that
//create for the userSchema for the "Class" (it's not exactly a class). Usually of the time
//We won't use arrow function in this type of methods because we need 'this' keyword
//for a specific instance.
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
    //Add the token just created to the user's tokens.
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

//Our user defined function for check credentials for login.
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Unable to login')
    }
    return user
}

//userSchema could use 2 event middleware function, pre() and post() for set some changes on
//the object before or after it saved. 2 arguments needed:
//First: event name.
//Second: a function to execute. Because we need the 'this' keyword it is important to use
//standard function instead of arrow function "()=>". It should be also async to allow us
//using async function and await keyword. next() is a callback using to finish the function.
//If next() will not be used the function run forever.
//Important issue: we set a function only for specific event! we must be sure all our related
//method using the specific event (save or remove) and no other mongoose method like findByIdAndUpdate!
userSchema.pre('save', async function (next) {
    const user = this
    //user.isModified() get field name to check if changed. It's relevant for creation
    //and updates.
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

//Delete user's tasks when user is removed.
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User