import nodemailer from 'nodemailer';
const userEmail = process.env.EMAIL_USER;
const password = process.env.EMAIL_PASSWORD;
var globalEmail ="";
const transporter = nodemailer.createTransport({
  service:"gmail",
  //  port: 587,
  //  secure: false, // true for 465, false(587) for other ports
  auth: {
    user:userEmail,
    pass:password,
  },
});


export const mailOptions = {  
  from:userEmail,
  to: "jobkefale@gmail.com"
};


export async function sendVerificationEmail(email, token) {
    
  const verificationUrl = `/activate/${token}`; // Nowy format URL
  await transporter.sendMail({
    from: userEmail,
    to: email,
    subject: "Verify Your Email",
    html: `Please click on the following link to verify your email: <a href="${verificationUrl}">${verificationUrl}</a>`,
  });
  
}

export async function sendPasswordResetEmail(email, token) {
   
    globalEmail =email;
   
    try {
      const testResult =await transporter.verify();
      console.log("Connected to email server",testResult);
    }catch(error){
      console.log("Error in connecting to email server");
    }
  const resetPasswordUrl = `/resetPassword/${encodeURIComponent(token)}`;
  await transporter.sendMail({
    
    from: userEmail,
    to: email,
    subject: "Password Reset Request",
    html: `We received a request to reset your password for our app. Please click on the following link to reset your password: <a href="${resetPasswordUrl}">Reset Password</a>. If you did not request a password reset, please ignore this email.`,
  });
}

export async function sendNewPasswordEmail(email, newPassword) {
  // if (!globalEmail) {
  //   console.error("Global email is not set.");
  //   // Handle the error condition appropriately
  //   return;
  // }
  // console.log("globalEmailnew",globalEmail);
  await transporter.sendMail({
    from: userEmail,
    to: email,
    subject: "Your New Password",
    html: `Your password has been reset. Here is your verification code: <strong>${newPassword}</strong>. you can generate a new password`,
  });



}