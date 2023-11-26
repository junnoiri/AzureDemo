const nodemailer = require("nodemailer");
require("dotenv").config();

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.grant_email,
        pass: process.env.grant_pass,
    },
});

var mailOptions = {
    from: process.env.grant_email,
    to: process.env.grant_email,
    text: "Test email",
};

transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log("Email sent: " + info.response);
    }
});
