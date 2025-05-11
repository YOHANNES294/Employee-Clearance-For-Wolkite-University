// app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectToDB } from "@/utils/database";
import User from "@/models/user";
import { sendPasswordResetEmail } from '@/utils/mail';
import { v4 as uuidv4 } from 'uuid'
import crypto from 'crypto';

// app\(front)\reset-password\[token]\route.ts
import bcrypt from 'bcryptjs';


import { randomBytes } from 'crypto';




export const POST = async (request) => {
  await connectToDB();

  const { email,userId } = await request.json();

  const user = await User.findOne({ userId });
  if (user) {
    const resetToken = crypto.randomBytes(20).toString('hex');
    const passwordResetToken =crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

      const passwordResetExpires = Date.now() + 10 * 60 * 1000;
      
      user.resetToken = passwordResetToken;
      user.passwordResetExpires = passwordResetExpires;
      const resultUrl = `/reset-password/${resetToken}`;
     
      await user.save();
    // Generate a unique token for password reset
    // const passwordResetToken = uuidv4();
    //  console.log("passwordResetToken",passwordResetToken);
    //  console.log("email",email);
    // Set the token to emailResetPassword field in the user document
    // user.emailResetPassword = passwordResetToken;
    // await user.save();

    // Send the password reset email with the token
    // await sendPasswordResetEmail(email, passwordResetToken);

    return new Response(JSON.stringify({ message: 'A password reset link has been sent to your email.' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } else {
    // Respond with a generic message whether or not the email was found
    // This is a security measure to prevent email enumeration
    return new Response(JSON.stringify({ message: 'If the email is associated with an account, a password reset link will be sent.' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};



