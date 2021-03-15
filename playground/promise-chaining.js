require('../src/db/mongoose')
const User = require('../src/models/user')
const { count } = require('../src/models/user')

//Two ways for the same function:
//One way by promises.
// User.findByIdAndUpdate("5f2ea51ee0ec4885a8a172f5",{age:1}).then((user)=>{
//     console.log(user)
//     return User.countDocuments({age:1})
// }).then((result)=>{
//     console.log(result)
// }).catch((e)=>{
//     console.log(e)
// })


//Another way by async and await.
const updateAgeAndCount = async(id,age)=>{
    const user = await User.findByIdAndUpdate(id,{age})
    const count = await User.countDocuments({age})
    return count
}
updateAgeAndCount("5f2ea51ee0ec4885a8a172f5",2).then((count)=>{
    console.log(count)
}).catch((e)=>{
    console.log(e)
})