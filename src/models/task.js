const mongoose = require('mongoose')

const taskSechma = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        //Set this type to Mongoose ObjectId.
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        //A reference to another model.
        ref: 'User'
    }
},{
    timestamps: true
})

const Task = mongoose.model('Task',taskSechma)

module.exports = Task