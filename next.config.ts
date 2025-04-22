// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
//   reactStrictMode: true,
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    esmExternals: false, // forces all to CommonJS
  },
  transpilePackages: [
    "antd",
    "@ant-design",
    "rc-util",
    "rc-pagination",
    "rc-picker",
    "rc-tree",
    "rc-table",
    "rc-select",
    "rc-cascader",
    "rc-notification",
    "rc-field-form",
    "rc-trigger",
    "rc-dialog",
    "rc-input", // 👈 ADD THIS!!
    "@babel/runtime",
  ],
};

module.exports = nextConfig;
