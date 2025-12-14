const nodemailer = require("nodemailer");
const config = require("../configs");

const sendMail = async (name, to) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "gmail", // or "mail.yourdomain.com"
            auth: {
                user: config.EMAIL_ADDRESS, // full email
                pass: config.EMAIL_PASSWORD
            }
        });

        const info = await transporter.sendMail({
            from: '"ChatApp Version 3.00"ghsgobindo@gmail.com"',
            to: to,
            subject: "Testing Nodemailer on Hostinger",
            text: "Email sent successfully!",
            html: "<b>Email sent successfully! Welcome </b>" + name
        });
        console.log(info);
        return true;
    } catch (err) {
        console.error("Email Error:", err);
        return false;
    }
};

module.exports = sendMail;
