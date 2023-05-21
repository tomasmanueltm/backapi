import nodemailer from 'nodemailer';

// Configuração do transporter do Nodemailer para Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tomasmanueltm.developer@gmail.com', // Seu e-mail do Gmail
    pass: 'Tm?220844', // Sua senha do Gmail
  },
});

export default transporter;