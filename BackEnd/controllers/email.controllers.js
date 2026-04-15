import nodemailer from 'nodemailer';

// Function to create transporter. If SMTP credentials are not provided via
// environment variables, create an Ethereal test account for development.
async function createTransporter() {
  const host = 'smtp.gmail.com';
  const port = 465;
  const secure = true;
  const user = process.env.EMAIL_USER;
  const pass = process.env.DB_EMAILPASS;

  if (!pass) {
    // No real credentials — create Ethereal test account
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.warn('Using Ethereal test account for emails. Preview at:', nodemailer.getTestMessageUrl);
    return { transporter, isTest: true };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });

  return { transporter, isTest: false };
}

// Function to send email
export const sendEmail = async (req, res) => {
  try {
    const { to, subject, html } = req.body;

    const { transporter, isTest } = await createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Sanatorio UTN <utnsanatorio@gmail.com>',
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);

    if (isTest) {
      // For Ethereal, return the preview URL so developer can open it
      const preview = nodemailer.getTestMessageUrl(info);
      return res.json({ message: 'Email sent (Ethereal)', info, preview });
    }

    res.json({ message: 'Email sent successfully', info });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Error sending email', error: error.message });
  }
};
