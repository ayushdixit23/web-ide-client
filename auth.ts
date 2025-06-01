import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { sendMail } from "./lib/send-mail";

// Initialize MongoDB client
const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db();

// Configure authentication
const auth = betterAuth({
    database: mongodbAdapter(db),

    user: {
        additionalFields: {
            username: {
                type: "string",
                required: true,
                unique: true,
                minLength: 3,
                maxLength: 32,
            },
        },
    },

    emailVerification: {
        enabled: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url }: { user: any; url: string }) => {
            const verificationLink = `${url}&callbackURL=/email-verification`;
            await sendMail({
                sendTo: user.email,
                subject: "Email Verification Required",
                text: `Hello,\n\nPlease verify your email by clicking the link below:\n\n${verificationLink}\n\nIf you did not request this, please ignore this email.\n\nThank you.`,
            });
        },
    },

    secret: process.env.BETTER_AUTH_SECRET as string,

    emailAndPassword: {
        enabled: true,
        disableSignUp: false,
        requireEmailVerification: true,
        minPasswordLength: 8,
        maxPasswordLength: 128,
        autoSignIn: true,
        sendResetPassword: async ({ user, url }) => {
            await sendMail({
                sendTo: user.email,
                subject: "Password Reset Request",
                text: `Hello,\n\nWe received a request to reset your password. You can do so by clicking the link below:\n\n${url}\n\nIf you did not request this, please disregard this email.\n\nRegards.`,
            });
        },
    },

    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
            mapProfileToUser: (profile) => ({
                username: profile.login,
            }),
        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            mapProfileToUser: (profile) => ({
                username: `${profile.given_name.toLowerCase()}${profile.family_name.toLowerCase()}${Math.floor(100 + Math.random() * 900)}`,
            }),
        },
    },

    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60, // 5 minutes
        },
    },
});

export type User = typeof auth.$Infer.Session.user;
export default auth;
