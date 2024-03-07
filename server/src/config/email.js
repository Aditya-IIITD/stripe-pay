import nodemailer from "nodemailer";
export function randomPassword() {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*_+|;:?";
  const passwordLength = 15;

  let password = "";
  for (let i = 0; i < passwordLength; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
}

export async function SendEmail(email, password) {
  try {
    // nodemailer transporter (for the credentials and authorization)
    // using Brevo for SMTP (visit its documentation for more details)
    let transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      // service: "Gmail",
      port: 587,
      // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER, // Your Brevo email
        pass: process.env.EMAIL_PASS, // Your Brevo password
      },
    });

    // HTML and CSS content for the email
    const emailContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #ffffff;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
      }
      .logo {
        width: 100px;
      }
      .content {
        text-align: center;
        padding: 20px 0;
      }
      .thank-you {
        font-size: 24px;
        font-weight: bold;
        color: #3498db;
      }
      .message {
        font-size: 16px;
        color: #333;
      }
      .button {
        display: inline-block;
        background-color: #3498db;
        color: #fff;
        padding: 10px 20px;
        text-decoration: none;
        border-radius: 5px;
        margin-top: 20px;
      }
      .button:hover {
        background-color: #2780b9;
      }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
         
        </div>
        <div class="content">
          <p class="thank-you">Thank you for choosing Sellerkin!</p>
          <p class="message">
            We appreciate your trust in our Etsy analysis tool. We're excited to have you on board.
            <br>
            <br>
            Your Login Credentials:
            <br>
            Your Email(Username): <b>${email}</b>
            Your Password(Token): <b>${password}</b>
          </p>
          <a class="button" href="https://sellerkin.com/">Click Here To Login To Your Premium Account</a>
        </div>
      </div>
    </body>
    </html>
    `;

    // sending email and providing data (what to send, whom to send, etc)
    let info = await transporter.sendMail({
      from: "janager8860000281@gmail.com", // Sender address
      to: email, // Recipient's email
      subject: "Password For Your Transaction", // Subject line
      text: emailContent, // Plain text body
    });

    // saving the user in firestore(by firebase) database after the mail is sent to the user
    // make sure to modify below block as per requirements

    // ...

    console.log("email sent");
  } catch (error) {
    console.error("Error creating user:", error.message);
  }
}
