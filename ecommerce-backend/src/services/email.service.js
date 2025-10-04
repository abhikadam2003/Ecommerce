const {createTransport} = require('../config/email');

const transporter = createTransport();

async function sendEmail({to,subject,html}){
    if(!transporter) return false;
    const from = process.env.EMAIL_USER;
    await transporter.sendMail({from,to,subject,html});
    return true;
}

async function sendWelcomeEmail(to, name){
    return sendEmail({
        to,
        subject: "Welcome to our store 🎉",
        html:`<p> Hi, ${name} , </p> <p> Welcome to our store happy shopping ✨🎁</p>`,
    });
}

async function sendOrderEmail(to, orderId, total){
    return sendEmail({
        to,
        subject: "Order Confirmed",
        html:`<p> Your order ${orderId} has been recieved. Total: ${total}</p>`,
    });
}

module.exports = {sendEmail, sendWelcomeEmail, sendOrderEmail};