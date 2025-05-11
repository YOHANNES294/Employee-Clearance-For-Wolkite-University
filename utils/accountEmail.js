import nodemailer from "nodemailer";

export const sendAccountEmail = async (to, userId, password) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"WKU Clearance System" <${process.env.EMAIL_USER}>`,
    to,
    subject: " Your WKU Account Credentials",
    html: `
      <h3>Your Account Has Been Created</h3>
      <p><strong>User ID:</strong> ${userId}</p>
      <p><strong>Password:</strong> ${password}</p>
      <p>You can now log in to the clearance system.</p>
    `,
  };

  try {
    await transporter.verify();
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
};
