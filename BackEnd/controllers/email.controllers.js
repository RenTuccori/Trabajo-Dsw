import nodemailer from 'nodemailer';
const dbEmailPass = process.env.DB_EMAILPASS;
// Nodemailer transport configuration
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Change this for your mail service (e.g., Gmail, SendGrid, etc.)
  port: 465, // Change according to your service (e.g., 587 for TLS, 465 for SSL)
  secure: true, // true for port 465, false for other ports
  auth: {
    user: 'utnsanatorio@gmail.com', // Your email
    pass: dbEmailPass, // Your password
  },
});

// Function to send email
export const sendEmail = async (req, res) => {
  try {
    const { to, subject, html } = req.body;

    const mailOptions = {
      from: 'Sanatorio UTN', // The sender email address
      to: to, // Destination email
      subject: subject, // Email subject
      html: html, // Email body
    };

    // Send the email
    let info = await transporter.sendMail(mailOptions);

    res.json({ message: 'Email sent successfully', info });
  } catch (error) {
    res.status(500).json({ message: 'Error sending email', error: error.message });
  }
};
