export const DEFAULT_REDIRECT_PATH = "/";

export const DEFAULT_RESTRICTED_REDIRECT_PATH = "/login";

export const RESTRICTED_PATHS = [
    "/login",
    "/signup",
    "/reset-password",
    "/forgot-password"
];

export const API = process.env.NEXT_PUBLIC_API;
export const CLOUDFRONT_URL = process.env.NEXT_PUBLIC_CLOUDFRONT_URL;
