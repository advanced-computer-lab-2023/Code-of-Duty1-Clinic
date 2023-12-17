import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const EMAIL = process.env.EMAIL_USER;
const PASSWORD = process.env.EMAIL_PASSWORD;

const sendEmail = async (to: string, subject: string, text: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: EMAIL,
      pass: PASSWORD
    }
  });

  const mailOptions = {
    from: EMAIL,
    to,
    subject,
    text
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (e) { 
    console.log(e);
  };
  
};

const sendResetPasswordEmail = async (to: string, otp: string) => {
  const subject = 'Reset password';
  const resetPasswordUrl = `/reset-password`;
  const text = `Dear user, To reset your password, click on this link: ${resetPasswordUrl} and enter this OTP: ${otp}.
  If you did not request any password resets, then ignore this email.`;

  await sendEmail(to, subject, text);
};

export { sendEmail, sendResetPasswordEmail };
