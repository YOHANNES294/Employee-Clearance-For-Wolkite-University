// app/api/admin/account-requests/[id]/send-email/route.js
import nodemailer from 'nodemailer';
import User from '@/models/user';
import { connectToDB } from '@/utils/database'; // Keep your existing DB util

export const POST = async (req, { params }) => {
  const { username, password, reason } = await req.json();

  // Validation
  if (!username || !password || !reason) {
    return new Response(
      JSON.stringify({ message: 'Username, password, and reason are required!' }),
      { status: 400 }
    );
  }

  try {
    await connectToDB();
    const user = await User.findById(params.id); // More efficient than findOne

    if (!user) {
      return new Response(
        JSON.stringify({ message: 'User not found!' }),
        { status: 404 }
      );
    }

    // Email logic (directly in the route)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Admin" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Account Approved',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <p>Dear ${user.firstname},</p>
          <p>Your account has been <strong>approved</strong>.</p>
          <p><b>Username:</b> ${username}</p>
          <p><b>Password:</b> ${password}</p>
          ${reason && `
            <p><b>Admin's Note:</b></p>
            <div style="background: #f5f5f5; padding: 10px; border-radius: 5px;">
              ${reason.replace(/\n/g, '<br>')}
            </div>
          `}
        </div>
      `,
    });

    return new Response(
      JSON.stringify({ message: 'Approval email sent!' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to send email. Try again later.' }),
      { status: 500 }
    );
  }
};