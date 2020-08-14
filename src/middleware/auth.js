const jwt = require('jsonwebtoken')
const User = require('../models/user')

//Middleware function: it will execute before every route. As mentioned before, every middleware
//function must call next() to finish its execution. This middleware function must be postionning
//before other app.use() functions. Example app.use(()=>{STATEMENTS})
//If we want to assign it to specific routes we need to add the middleware function to the route
//just before the route function (move the route function to the third argument).
//We can run more than one middleware function in a route. Put them in the order the suppose to run
//and after them the route function.
//Another option to event middleware function that could run before or after an event such as
//save or remove. Examples exist in model files.
//If the middleware function doesn't use next it will never execute the route function.
//In the client side, to send token with a request we need to set header to the request:
//Key = Authorization   Value = Bearer <THE_TOKEN>
const auth = async (req,res,next)=>{
    try{
        //Extract the token the user provided (and cut the 'Bearer ' from header value).
        const token = req.header('Authorization').replace('Bearer ','')
        //Validate that token.
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        //Find the associated user.
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})
        //If there is no user with this token return error.
        if(!user){
            throw new Error()
        }
        //Add to the req the user data and token.
        req.token = token
        req.user = user
        //End the middleware function and continue to the route function.
        next()
    } catch(e){
        res.status(401).send({error: 'Please authenticate.'})
    }
}

module.exports = auth