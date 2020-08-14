const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser: true,
    useCreateIndex: true,
    //Set Mongoose to not use this function (it's deprecated).
    useFindAndModify: false
})