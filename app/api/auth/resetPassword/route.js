// app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectToDB } from "@/utils/database";
import User from "@/models/user";
import { mailOptions, sendNewPasswordEmail, sendPasswordResetEmail } from '@/utils/mail';
import { v4 as uuidv4 } from 'uuid'


// app\(front)\reset-password\[token]\route.ts
import bcrypt from 'bcryptjs';


import { randomBytes } from 'crypto';



export const POST = async (request) => {
  await connectToDB();

  const { email,userId } = await request.json();

  const user = await User.findOne({ userId });
  const userEmail = user.email;
  if (user && userEmail === email) {
    // Generate a unique token for password reset
    const passwordResetToken = uuidv4();
    
    // Set the token to emailResetPassword field in the user document
    user.emailResetPassword = passwordResetToken;
    // user.email = email;
    user.passwordResetTokenExpires = new Date(Date.now() + 3600000); // 1 hour from now


    const newPassword = generateSecurePassword();
  
    // Hash the new password before saving it to the database
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update the user's password and clear the reset token and its expiry
    user.verificationCode = hashedPassword;
    // user.emailResetPassword = null;
    // user.passwordResetTokenExpires = undefined;
    
    await user.save();

    // Send the password reset email with the token
    //  await sendPasswordResetEmail(email, passwordResetToken);
     await sendNewPasswordEmail(userEmail, newPassword);
    
    return new Response(JSON.stringify({ message: 'A password reset link has been sent to your email.' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }else if(user && userEmail !== email){
    return new Response("you should enter the correct email", { status: 404 });
  }
  
  else {
    // Respond with a generic message whether or not the email was found
    // This is a security measure to prevent email enumeration
    
    return new Response("you should enter the correct email", { status: 404 });
  }
};



 // Helper function to generate a secure password
 function generateSecurePassword() {
  return randomBytes(2).toString('hex'); // Generates a random hex string of length 24
}

