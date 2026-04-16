/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  // Cambia basePath si despliegas en subdirectorio de GitHub Pages:
  // basePath: "/ladrones",
};

module.exports = nextConfig;
