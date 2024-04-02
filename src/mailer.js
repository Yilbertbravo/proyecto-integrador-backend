const path = require("path");
const nodemailer = require("nodemailer");

require("dotenv").config({ path: path.join(__dirname, "../.env") });

// Configuración de SMTP: https://app.brevo.com/ + Google
const getSMTP = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, // Determina si se usa SSL/TLS
        auth: {
            type: "login",
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },

    });
};

const setOptions = (to, subject, content) => {
    return {
        from: process.env.SMTP_EMAIL,
        to,
        subject,
        text: content };
};

const sendMail = async (to, subject, content) => {
    try {
        const transport = getSMTP();
        console.log(transport);

        const options = setOptions(to, subject, content);
        console.log(options);
        await transport.sendMail(options);

        return "Envío Correcto";
    } catch (error) {
        console.error(error);
        return "Envío Fallido";
    }
};

module.exports = sendMail;