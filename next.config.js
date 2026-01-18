/** @type {import('next').NextConfig} */
const nextConfig = {
  // Отключаем проверку TypeScript errors при сборке
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;