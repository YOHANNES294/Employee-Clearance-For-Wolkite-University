// pages/api/admin/send-credentials.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        // Handle your email sending logic here
        try {
            const { userId, password, email } = req.body;
            // Email sending logic using nodemailer
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            const mailOptions = {
                from: 'wkucms@gmail.com',
                to: email,
                subject: 'Your Account Credentials',
                text: `UserID: ${userId}\nPassword: ${password}`,
            };

            await transporter.sendMail(mailOptions);
            res.status(200).json({ message: 'Email sent successfully!' });
        } catch (error) {
            res.status(500).json({ error: 'Error sending email' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
