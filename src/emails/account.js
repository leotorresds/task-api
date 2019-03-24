const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);


const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'leonardot.trab@gmail.com',
        subject: 'Welcome to the app!',
        text: `Welcome to the app ${name}.`
    })
};

const sendDeleteEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'leonardot.trab@gmail.com',
        subject: 'Sorry :(!',
        text: `Good bye ${name}.`
    })
};

module.exports = { sendWelcomeEmail, sendDeleteEmail };