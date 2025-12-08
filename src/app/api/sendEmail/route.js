"use server";

import nodemailer from "nodemailer";

export async function POST(req) {
  const { email, subject, message } = await req.json();

  // Buat akun dummy ethereal
  let testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const info = await transporter.sendMail({
    from: '"Test App" <test@example.com>',
    to: email,
    subject,
    html: message,
  });

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
