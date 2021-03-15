const multer = require('multer')
//Create new multer instance. 2 argument needed:
//First: configuration object.
const upload = multer({
    //Destenation folder on the root path.
    //If we doesn't want the files stored on file system, we must remove 'dest' option.
    //In the route we can acces the file object in req.file and pass it to the database (if 'dest'
    //doesn't use). Usualy we store it as binary file so we preffer to use req.file.buffer.
    dest: 'images',
    //File limits like fileSize (in bytes).
    limits: {
        fileSize: 1000000
    },
    //Function to file filter.
    fileFilter(req,file,cb) {
        //The cb function need to be called with true if the file type valid and flase if not.
        //It's also possible to call cb with error for more details. Examples:
        //cb(new Error('File must be a PDF')) - File doesn't accepted with detailed error.
        //cb(undefined,true) - File accepted.
        //cb(undefined,false) - File doesn't accepted. Best parctice is sending error istead!
        if(!file.originalname.match(/\.(doc|docx)$/)){
            return cb(new Error('Please upload a Word document'))
        }
        cb(undefined,true)
    }
})

//To upload a file we need to send it in form-data.
//upload.single() configures to multer to look for file called 'upload' in the request.
//upload.single() is a middleware function.
//In Postman we need to send a post request with form-data (inside Body) while a key is the file name
//and change the key type to file instead of text. After these step choose file from file system.
//After the route handler (route function) we can set error handler. It will catch error from the
//middleware function if thrown. If middleware function throw an error route handler won't be execute.
//Instead, error handler will be execute if provided. It's allow us to customize the error we send.
//Error handler get 4 arguments error, req, res and next by this order.
app.post('/upload',upload.single('upload') , (req,res)=>{
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error: error.message})
})