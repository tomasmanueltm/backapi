import nodemailer from 'nodemailer';

// Configuração do transporter do Nodemailer para Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: String(process.env.EMAIL_DESCRIPTION), // Seu e-mail do Gmail 
    pass: String(process.env.EMAIL_PASSWORD), // Sua senha do Gmail
  },
});

export default transporter;