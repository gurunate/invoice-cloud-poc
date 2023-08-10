/** @type {import('next').NextConfig} */

const { INVOICE_CLOUD_CUSTOMER_PORTAL_URL, INVOICE_CLOUD_API_KEY } =
    process.env;

const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    publicRuntimeConfig: {
        INVOICE_CLOUD_CUSTOMER_PORTAL_URL,
        INVOICE_CLOUD_API_KEY
    }
};

module.exports = nextConfig;
