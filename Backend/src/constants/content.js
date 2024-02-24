export default function content(otp, username) {
    return {
        subject: "Your One-Time Password (OTP)",
        body: `
        <html>
        <head>
            <style>
            /* Define your CSS styles here */
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
            }
            .message {
                padding: 20px;
                background-color: #f7f7f7;
                border-radius: 5px;
            }
            .thank-you {
                color: #333;
                font-weight: bold;
                text-align: center;
                margin-top: 20px;
            }
            </style>
        </head>
        <body>
            <div class="container">
            <div class="message">
                <p>Dear ${username},</p>
                <p>Your One-Time Password (OTP) for verification is: <strong>${otp}</strong>. Please use this OTP to complete your verification process.</p>
                <p>We are excited to welcome you to our platform and want to ensure that your experience is as smooth as possible. If you have any questions or encounter any issues, feel free to reach out to our support team.</p>
                <p>We appreciate your trust in our service and thank you for choosing our website!</p>
            </div>
            <div class="thank-you">Thank you!</div>
            </div>
        </body>
        </html>
        `,
    };
}
