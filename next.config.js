/** @type {import('next').NextConfig} */
const nextConfig = {
  // Отключаем превращение ESLint warnings в ошибки при сборке
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Отключаем проверку TypeScript errors при сборке
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;