require('../src/db/mongoose')
const Task = require('../src/models/task')
const { deleteOne } = require('../src/models/task')

// Task.findByIdAndDelete('5f2d91d6588f5a7350778138').then((task)=>{
//     console.log(task)
//     return Task.countDocuments({completed: false})
// }).then((result)=>{
//     console.log(result)
// }).catch((e)=>{
//     console.log(e)
// })

const deleteTaskAndCount = async(id)=>{
    await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({completed:false})
    return count
}

deleteTaskAndCount('5f2d86d0a6dbcf87ec5ea7a5').then((count)=>{
    console.log(count)
}).catch((e)=>{
    console.log(e)
})