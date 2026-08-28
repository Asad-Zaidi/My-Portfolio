const nodemailer = require("nodemailer");

let transporter;

function getTransporter() {
    if (transporter) return transporter;

    const host = process.env.EMAIL_HOST || process.env.SMTP_HOST;
    const port = process.env.EMAIL_PORT || process.env.SMTP_PORT;
    const secure = process.env.EMAIL_SECURE || process.env.SMTP_SECURE;
    const user = process.env.EMAIL_USER || process.env.SMTP_USER;
    const password = process.env.EMAIL_PASSWORD || process.env.SMTP_PASS;

    if (!host || !port || !user || !password) {
        throw new Error("SMTP configuration is incomplete.");
    }

    transporter = nodemailer.createTransport({
        host,
        port: Number(port),
        secure: secure === "true" || Number(port) === 465,
        auth: {
            user,
            pass: password,
        },
    });

    return transporter;
}

function cleanHeader(value) {
    return String(value || "").replace(/[\r\n]/g, " ").trim();
}

async function sendContactNotification({ name, email, subject, message }) {
    const recipient = process.env.CONTACT_EMAIL_TO || process.env.EMAIL_USER || process.env.SMTP_USER;
    const sender = process.env.CONTACT_EMAIL_FROM || process.env.EMAIL_USER || process.env.SMTP_USER;

    if (!recipient || !sender) {
        throw new Error("Contact email recipient or sender is not configured.");
    }

    const mailSubject = `Portfolio - ${cleanHeader(subject)}`;
    const info = await getTransporter().sendMail({
        from: sender,
        to: recipient,
        replyTo: cleanHeader(email),
        subject: mailSubject,
        text: [
            `Name: ${name}`,
            `Email: ${email}`,
            `Subject: ${subject}`,
            "",
            message,
        ].join("\n"),
    });

    console.log(`Contact email sent to ${recipient} — ${mailSubject} (${info.messageId})`);
    return info;
}

async function verifyEmailConnection() {
    await getTransporter().verify();
}

module.exports = { sendContactNotification, verifyEmailConnection };
