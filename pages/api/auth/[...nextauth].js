import NextAuth from "next-auth/next";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import nodemailer from "nodemailer";

export default NextAuth({

    providers: [
        EmailProvider({
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: process.env.EMAIL_SERVER_PORT,
                secure: false,
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD
                },
                tls: {
                    rejectUnauthorized: false,
                },
            },

            from: process.env.EMAIL_FROM,
            sendVerificationRequest: async ({ identifier: email, url }) => {
                const transporter = nodemailer.createTransport({
                    host: process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com',
                    port: process.env.EMAIL_SERVER_PORT || 587,
                    secure: false,
                    auth: {
                        user: process.env.EMAIL_SERVER_USER,
                        pass: process.env.EMAIL_SERVER_PASSWORD,
                    },
                    connectionTimeout: 5000,
                    greetingTimeout: 5000,
                    tls: {
                        rejectUnauthorized: false
                    },
                    logger: true,
                    debug: true,
                });
                const mailOptions = {
                    from: process.env.EMAIL_FROM,
                    to: email,
                    subject: 'Sign in to your account',
                    text: `Sign in to your account: ${url}`,
                    html: `<p>Sign in to your account:</p><p><a href="${url}">Click here to sign in</a></p>`,
                };
                console.log("Sending email to:", email);
                console.log("Mail options:", mailOptions);
                try {
                    await transporter.sendMail(mailOptions);
                } catch (error) {
                    console.error('Error sending email:', error);
                }
            },
        }),


    ],


    adapter: MongoDBAdapter(clientPromise),
    secret: process.env.NEXTAUTH_SECRET,
})