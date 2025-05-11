/*import nodemailer from "nodemailer";

export const sendCredentialsEmail = async (email, username, userpassword) => {
  try {
    // Debug environment variables
    console.log("USER_EMAIL:", process.env.USER_EMAIL ? "Set" : "Not set");
    console.log("EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD ? "Set" : "Not set");

    // Validate environment variables
    if (!process.env.USER_EMAIL || !process.env.EMAIL_PASSWORD) {
      throw new Error("Missing email configuration (USER_EMAIL or EMAIL_PASSWORD)");
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false, // <- ADD THIS
      },
    });

    // Verify transporter
    await transporter.verify();
    console.log("Nodemailer transporter verified");

    // Mail options
    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: email,
      subject: "Your New Credentials",
      text: `Hello, here are your credentials:\nUsername: ${username}\nPassword: ${userpassword}\nNote: Your password is securely stored in our database.`,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to:", email);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};*/
import nodemailer from "nodemailer";

export const sendCredentialsEmail = async (email, username, userpassword) => {
  try {
    console.log("USER_EMAIL:", process.env.USER_EMAIL ? "Set" : "Not set");
    console.log("EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD ? "Set" : "Not set");

    if (!process.env.USER_EMAIL || !process.env.EMAIL_PASSWORD) {
      throw new Error("Missing email configuration (USER_EMAIL or EMAIL_PASSWORD)");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    await transporter.verify();
    console.log("Nodemailer transporter verified");

    const mailOptions = {
      from: `"WKU-ECMS" <${process.env.USER_EMAIL}>`,
      to: email,
      subject: "🎉 Your WKU-ECMS Account Credentials 🎉",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #4CAF50;">Welcome to WKU-ECMS!</h2>
          <p>Dear User,</p>
          <p>We're excited to have you onboard. Below are your login credentials:</p>
          <div style="background-color: #f9f9f9; padding: 15px; border: 1px solid #ddd; border-radius: 8px;">
            <p><strong>Username:</strong> ${username}</p>
            <p><strong>Password:</strong> ${userpassword}</p>
          </div>
          <p style="margin-top: 20px;">
            Please keep this information safe. You can now log in to your account and explore the system.
          </p>
          <p>Need help? Feel free to contact our support team at any time.</p>
          <p style="margin-top: 30px;">Best regards,<br/><strong>WKUCMS Team</strong></p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to: ${email}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};
