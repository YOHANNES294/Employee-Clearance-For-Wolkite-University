import nodemailer from "nodemailer";

const createTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

export const sendAccountEmail = async (to, userId, password) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"WKU Clearance System" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your WKU Account Credentials",
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
    console.error("Failed to send account email:", error);
    throw error;
  }
};

export const sendDecisionEmail = async (to, firstname, decision, reason) => {
  const transporter = createTransporter();
  const subject = `Your account request was ${decision}`;
  const html = `
    <h3>Hello ${firstname},</h3>
    <p>Your account request has been <strong>${decision}</strong>.</p>
    ${reason ? `<p>Reason: ${reason}</p>` : ""}
  `;

  try {
    await transporter.verify();
    await transporter.sendMail({
      from: `"WKU Clearance System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Failed to send decision email:", error);
    throw error;
  }
};

export const sendRawDecisionEmail = async (to, fullname, status, message) => {
  const transporter = createTransporter();
  const subject = `Account Request ${status}`;
  const html = `
    <h3>Hello ${fullname},</h3>
    <p>${message}</p>
  `;

  try {
    await transporter.verify();
    await transporter.sendMail({
      from: `"WKU Clearance System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Failed to send raw decision email:", error);
    throw error;
  }
};
