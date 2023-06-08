import nodemailer from 'nodemailer';

// Configuração do transporter do Nodemailer para Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: process.env.EMAIL_DESCRIPTION, // Seu e-mail do Gmail 
    pass: process.env.EMAIL_PASSWORD, // Sua senha do Gmail
  },
});

export default transporter;