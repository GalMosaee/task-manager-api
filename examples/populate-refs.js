const Task = require('./models/task')
const User = require('./models/user')

//To use populate and create these relationships we must add the models refs to each other.
//The refs may be standard field or virtual fields.
const main = async()=>{
    // //populte() allows us fetch the relationships into modeling object.
    // //The relationships set by refs between models. populate() needs an argument:
    // //The ref to populate.
    // //populate used to set the fetching and execPopulate() used to commit the fetching.
    const task = await Task.findById('5f33d374cdaa1d8a7c6b66b0')
    await task.populate('owner').execPopulate()
    console.log(task.owner)
    const user = await User.findById('5f33d2138eb0347974eccbae')
    await user.populate('tasks').execPopulate()
    console.log(user.tasks)
}

main()

//populate() could get another syntax arguments:
//First: an object contains:
    //path: 'REF_PATH' - for example tasks wich is virtaul ref under user.
    //match: {} - an filter object.
    //options: {} - options object. Known option is limit skip and sort.
        //limit will be ignored if parseInt failed or equal to 0.
        //If number is negative it will handled as limit=1.
        //skip must be non-negative number. Otherwise request will be failed.
        //sort is an object with the fields we want to sort by.
            //Format: sort: {FIELD: ORDER} 1 for ASC and -1 for DESC.
 