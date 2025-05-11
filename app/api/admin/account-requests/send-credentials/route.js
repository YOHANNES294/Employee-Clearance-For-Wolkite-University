// app/api/admin/send-credentials/route.js

import nodemailer from 'nodemailer';

export async function POST(req) {
    try {
        const { userId, password, email } = await req.json();

        // Nodemailer transport setup
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your Account Credentials',
            text: `Your credentials are as follows:\nUserID: ${userId}\nPassword: ${password}`,
        };

        await transporter.sendMail(mailOptions);

        return new Response(JSON.stringify({ message: 'Email sent successfully!' }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Error sending email' }), { status: 500 });
    }
}
