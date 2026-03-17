/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/github", destination: "https://github.com/amitojsingh366/", permanent: true },
      { source: "/linkedin", destination: "https://www.linkedin.com/in/amitojsingh366/", permanent: true },
      { source: "/twitter", destination: "https://twitter.com/amitojsingh366/", permanent: true },
      { source: "/discord", destination: "https://discord.com/users/473965680857972757", permanent: true },
      { source: "/mail", destination: "mailto:amitoj@amitoj.net", permanent: true },
      { source: "/kofi", destination: "https://ko-fi.com/amitoj", permanent: true },
      { source: "/paypal", destination: "https://paypal.me/amitoj366", permanent: true },
    ];
  },
};

export default nextConfig;
