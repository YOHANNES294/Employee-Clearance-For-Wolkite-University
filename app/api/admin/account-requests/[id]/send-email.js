// api/admin/account-requests/[id]/send-email.js
import nodemailer from "nodemailer";
import { connectToDB } from "../../../utils/database";
import { Request } from "../../../models/request"; // Adjust this import based on your schema

export default async function handler(req, res) {
  const { method } = req;
  const { username, password, reason } = req.body;
  const { id } = req.query; // Request ID

  if (method === "POST") {
    try {
      // Ensure you are connected to the DB
      await connectToDB();

      // Find the request by ID
      const request = await Request.findById(id);
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }

      // Create the email content
      const mailContent = `
        <h2>Your Account Request has been Approved</h2>
        <p><strong>Username:</strong> ${username}</p>
        <p><strong>Password:</strong> ${password}</p>
        <p><strong>Reason for Approval:</strong> ${reason}</p>
      `;

      // Set up nodemailer transporter
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      // Send email to the user
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: request.email,
        subject: "Your Account Approval",
        html: mailContent,
      };

      const emailResponse = await transporter.sendMail(mailOptions);

      // If email is sent successfully, update the status in the database
      if (emailResponse.accepted.length > 0) {
        await Request.findByIdAndUpdate(id, { status: "approved" });

        res.status(200).json({ message: "Email sent and request approved" });
      } else {
        throw new Error("Failed to send email");
      }
    } catch (error) {
      console.error("Error during approval:", error);
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
