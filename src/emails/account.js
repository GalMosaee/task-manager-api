const sgMail = require('@sendgrid/mail')
//Set an API key generated to our free account just created in SendGrid.
//The API store on the dev.env file.
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

//An sender should be associated in the SendGrid account to allows us send messages.
//The sgMail.send() need to be compatible with this associated sender.
const senderEmail = 'Galmosaee@gmail.com'

//Send an email. sgMail.send() needs a option object:
//to - email address sending to.
//from - email address sending from. Must be equal to the sender configured.
//subject - the email subject.
//text - the email content.
//html - to send a HTML format (allow sending images and other staff).
//sgMail() is async function, in other words it return a promise. We can catch and use await
//if we want. For our purpose we preffer not to wait for it's finish.
const sendWelcomeEmail = (email,name)=>{
    sgMail.send({
        to: email,
        from: senderEmail,
        subject: 'Thanks for joining in!',
        //`` allow us to concatinate strings in another format.
        text: `Welcome to the app, ${name}. Let me know how you get along with app.`
    })
}

const sendCancelationEmail = (email,name)=>{
    sgMail.send({
        to: email,
        from: senderEmail,
        subject: 'Sorry to see you go!',
        //`` allow us to concatinate strings in another format.
        text: `Goodbye, ${name}. I hope to see you back sometime soon.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}