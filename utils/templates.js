export const getResetPasswordTemplate=(userName, resetLink)=> {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password Reset</title>
    <style>
      body {
        font-family: 'Segoe UI', Arial, sans-serif;
        background-color: #f4f4f7;
        color: #333;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 500px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 10px;
        padding: 30px;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
      }
      h2 {
        color: #2a2a2a;
      }
      p {
        line-height: 1.6;
      }
      .btn {
        display: inline-block;
        background-color: #007bff;
        color: #ffffff !important;
        padding: 12px 20px;
        margin-top: 20px;
        border-radius: 6px;
        text-decoration: none;
        font-weight: 500;
      }
      .btn:hover {
        background-color: #0056b3;
      }
      .footer {
        text-align: center;
        margin-top: 30px;
        font-size: 12px;
        color: #777;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Password Reset Request</h2>
      <p>Hi ${userName || "there"},</p>
      <p>We received a request to reset your password. Click the button below to set a new password.</p>

      <a href="${resetLink}" class="btn">Reset Password</a>

      <p>If you didn’t request this, you can safely ignore this email.</p>
      <p>This link will expire in <strong>15 minutes</strong>.</p>

      <div class="footer">
        <p>© ${new Date().getFullYear()} UNITYM. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>`;
}

export const getWelcomeTemplate=(userName, setPasswordLink)=> {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to UNITYM</title>
    <style>
      body {
        font-family: 'Segoe UI', Arial, sans-serif;
        background-color: #f4f7fb;
        color: #333;
        margin: 0;
        padding: 0;
      }

      .container {
        max-width: 600px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 12px;
        padding: 30px 40px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      }

      h2 {
        color: #1a1a1a;
        margin-bottom: 10px;
      }

      p {
        line-height: 1.6;
        color: #555;
      }

      .btn {
        display: inline-block;
        background-color: #007bff;
        color: #ffffff !important;
        padding: 12px 22px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 500;
        margin-top: 20px;
      }

      .btn:hover {
        background-color: #0056b3;
      }

      .header {
        text-align: center;
        padding-bottom: 20px;
      }

      .header img {
        max-width: 80px;
        margin-bottom: 10px;
      }

      .footer {
        text-align: center;
        margin-top: 30px;
        font-size: 12px;
        color: #777;
      }

      .highlight {
        color: #007bff;
        font-weight: 600;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="https://yourdomain.com/assets/logo.png" alt="App Logo" />
        <h2>Welcome to <span class="highlight">UNITYM</span> 🎉</h2>
      </div>

      <p>Hi ${userName || "there"},</p>
      <p>
        We’re thrilled to have you on board! Your account has been successfully created.
        Before you start exploring, please set up your password to secure your account.
      </p>

      <a href="${setPasswordLink}" class="btn">Set Your Password</a>

      <p>
        If you didn’t create this account, please ignore this email. This link will expire in <strong>15 mins</strong>.
      </p>

      <div class="footer">
        <p>© ${new Date().getFullYear()} UNITYM. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
  `;
}
