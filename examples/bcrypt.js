const bcrypt = require('bcryptjs')

const myFunction = async()=>{
    const password = 'Red12345!'
    //bcrypt.hash() encrypt a string by bcrypt algorithm. 2 arguments needed:
    //First: the string to encrypt.
    //Second: how many times to encrypt it (8 is best practice).
    //Important deffernce between standard encryption algorithm to hashing encryption algorithm
    //is that using hash there is no way to decrypt it.
    const hashedPassword = await bcrypt.hash(password, 8)
    console.log(password)
    console.log(hashedPassword)
    //bcrypt.compare() check if string after encryption equal to hashed string. 2 argument needed:
    //First: the original string.
    //Second: an hashed string to comparison.
    const isMatch = await bcrypt.compare('Red12345!',hashedPassword)
    console.log(isMatch)
}

myFunction()