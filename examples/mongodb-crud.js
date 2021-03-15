//This file create to set CRUD operations (Create Read Update Delete).
//More data could be found in MongoDB docs (Driver API for CRUD operation).
//The mongoClient give us the access to the database.
//ObjectID is funtion generating object IDs.
const { MongoClient, ObjectID } = require("mongodb");

//This is the mongo URL protocol.
const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";
//Generates new object ID. ID is 12-byte consist of:
//4-byte value representing the seconds since Unix epoch.
//5-byte random value.
//3-byte counter that starting with random value.
//Most of the time we should not use it and let MongoDB auto-generate it for us.
//const id = new ObjectID()
//console.log(id)

//MongoClient.connect() establish connection with the database. 3 arguments needed.
//First: URL for the database.
//Second: setting object. Set "useNewUrlParser: true" which parse the URL correctly.
//Third: callback function (with 2 arguments) that run when the connection established.
//First: error defines if there were errors.
//Second: client defines if the connection established successfuly.
MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
  if (error) {
    return console.log("Unable to connect to database!");
  }
  //client.db() retrun ref to the database.
  //There is no need to create database. When we will try to access it, it will be created.
  const db = client.db(databaseName);

  //db.collection(COLLECTION).deleteOne() delete a document in collection. 2 argument needed:
  //First: an object (specific fields in object) to delete.
  //Second: callback method run after deletion. 2 argument needed:
  //First: error defines if there was an error.
  //Second: result defines if deletion successed and includes information such as (object and id).
  //Sould choose more readable result like "user" or "task".
  //If no callback passed, this function will use promise.
  //If using deleteOne() it always delete the first occurrence.
  //For filter by ObjectID it's not enough to use _id: "OBJECTID". We need to wrapp it with
  //ObjectID method. Example: _id: new ObjectID("OBJECTID").
  //Example using promise instead of callback.
  // db.collection('users').deleteMany({age: 27}).then((result)=>{
  //     console.log(result)
  // }).catch((error)=>{
  //     console.log(error)
  // })

  // db.collection('tasks').deleteOne({description: 'Pot plants'}).then((result)=>{
  //     console.log(result.deletedCount)
  // }).catch((error)=>{
  //     console.log(error)
  // })

  //db.collection(COLLECTION).updateOne() update a document in collection. 3 argument needed:
  //First: an object (specific fields in object) to update.
  //Second: the update value. syntax: {$set:{keys:values}}.
  //More update operator than $set could be found in MongoDB docs.
  //Third: callback method run after update. 2 argument needed:
  //First: error defines if there was an error.
  //Second: result defines if update successed and includes information such as (object and id).
  //Sould choose more readable result like "user" or "task".
  //If no callback passed, this function will use promise.
  //If using updateOne() it always update the first occurrence.
  //For filter by ObjectID it's not enough to use _id: "OBJECTID". We need to wrapp it with
  //ObjectID method. Example: _id: new ObjectID("OBJECTID").
  //Example using promise instead of callback.
  // db.collection('users').updateOne({_id: new ObjectID("5f2c8f5c80cc3b480c9a1a3f")},{
  //     $set: {
  //         name: 'Mike'
  //     }
  // }).then((result)=>{
  //     console.log(result)
  // }).catch(()=>{
  //     console.log(error)
  // })
  //An example for using $inc operator instead of $set.
  // db.collection('users').updateOne({_id: new ObjectID("5f2c8f5c80cc3b480c9a1a3f")},{
  //     $inc: {
  //         age: 1
  //     }
  // }).then((result)=>{
  //     console.log(result)
  // }).catch(()=>{
  //     console.log(error)
  // })
  //An example for updateMany():
  // db.collection('tasks').updateMany({completed: false},{
  //     $set: {
  //         completed: true
  //     }
  // }).then((result)=>{
  //     console.log(result.modifiedCount)
  // }).catch(()=>{
  //     console.log(error)
  // })

  //db.collection(COLLECTION).findOne() find a document in collection. 2 argument needed:
  //First: an object (specific fields in object) to find.
  //Second: callback method run after found. 2 argument needed:
  //First: error defines if there was an error. No documents found isn't an error (result=null).
  //Second: result defines if find successed and includes information such as (object and id).
  //Sould choose more readable result like "user" or "task".
  //If using findOne() it always return the first occurrence.
  //For filter by ObjectID it's not enough to use _id: "OBJECTID". We need to wrapp it with
  //ObjectID method. Example: _id: new ObjectID("OBJECTID").
  // db.collection('users').findOne({ _id: new ObjectID("5f2d31dba4a1ad65f4f31133") },(error,user)=>{
  //     if(error){
  //         return console.log('Unable to fetch!')
  //     }
  //     console.log(user)
  // })
  //db.collection(COLLECTION).find() find documents in collection. An argument needed:
  //First: an object (specific fields in object) to find.
  //In contrast to findOne() find doesn't get cllaback function, it returns the data as cursor.
  //Most of the time we will use the toArray() on this cursor. The toArray() get callback function.
  //There are a lot of other function could be using on the cursor like count() and others.
  // db.collection('users').find({age: 27}).toArray((error,users)=>{
  //     console.log(users)
  // })
  // db.collection('users').find({age: 27}).count((error,count)=>{
  //     console.log(count)
  // })
  // db.collection('tasks').findOne({_id: new ObjectID("5f2c93c8178c512290dd8c70")},(error,task)=>{
  //     console.log(task)
  // })
  // db.collection('tasks').find({completed: false}).toArray((error,tasks)=>{
  //     console.log(tasks)
  // })
  //db.collection(COLLECTION).insertOne() Insert a document to collection. 2 argument needed:
  //First: an object to insert (in insertMany() array of objects).
  //Second: callback method run after inseration. 2 argument needed:
  //First: error defines if there was an error.
  //Second: result defines if inseration successed and includes information such as (object and id).
  // db.collection('users').insertOne({
  //     name: 'Vikram',
  //     age: 26
  // },(error,result)=>{
  //     if(error){
  //         return console.log('Unable to insert user')
  //     }
  //     console.log(result.ops)
  // })

  // db.collection('tasks').insertMany([
  //     {
  //         description: 'Clean the house',
  //         completed: true
  //     },{
  //         description: 'Renew inspection',
  //         completed: false
  //     },{
  //         description: 'Pot plants',
  //         completed: false
  //     }
  // ], (error, result) => {
  //     if (error) {
  //         return console.log('Unable to insert tasks!')
  //     }
  //     console.log(result.ops)
  // })
});
