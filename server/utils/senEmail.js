const nodeMailer = require('nodemailer')

const sendEmail = async (options) => {
  console.log(process.env.EMAIL_NAME, process.env.EMAIL_PASS)
  const transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_NAME, // generated ethereal user
      pass: process.env.EMAIL_PASS, // generated ethereal password
    },
  })

  const mailOptions = {
    from: '"Hieu shop" <no-relply@hieu0shop.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html, // html body
  }

  await transporter.sendMail(mailOptions)
}

module.exports = sendEmail
