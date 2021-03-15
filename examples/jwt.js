const jwt = require('jsonwebtoken')

const myFunction= async()=>{
    //sign() method using for get Json Web Token. 2 agrgument needed:
    //First: the data will be embeded in the token. It should be unique so user id is perfect.
    //Second: a secret (random series of characters). Same secret must be use for sign and verify
    //for every token and it should be generated automatically.
    //Return a token.
    //Third (Optional): another options (for examples expiration time). 
    const token = jwt.sign({_id:'12345'},'thisismynewcourse',{expiresIn:'7 days'})
    console.log(token)

    //sign() method using for verify Json Web Token. 2 agrgument needed:
    //First: the token.
    //Second: a secret (random series of characters). Same secret must be use for sign and verify
    //for every token and it should be generated automatically.
    //Return the payload of a token or throw an error.
    const data = jwt.verify(token,'thisismynewcourse')
    console.log(data)
}

myFunction()