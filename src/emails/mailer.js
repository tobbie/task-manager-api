const postmark = require('postmark');

const serverToken = process.env.POSTMARK_TOKEN
const postmarkClient = new postmark.ServerClient(serverToken);

const sendWelcomeEmail = (email, name) =>{
    try {
        postmarkClient.sendEmail({
            From: "oluwatobi.akinseye@andela.com",
            To: email,
            Subject: "Thanks for joining in!",
            TextBody: `Welcome to the app ,${name}. Let me know how you get along with the app`
    });
    } catch (error) {
        console.log(error);
    }    
}

const sendCancellationEmail = (email, name) =>{
    try {
        postmarkClient.sendEmail({
            From: "oluwatobi.akinseye@andela.com",
            To: email,
            Subject: "Sorry to see you go :( !",
            TextBody: `Goodbye ${name}, We're sorry to see you go. Hope you come back soon`
    });
    } catch (error) {
        console.log(error);
    }    
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}
