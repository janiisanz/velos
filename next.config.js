/** @type {import('next').NextConfig} */
const nextConfig = {
  // Se desactiva la optimización para simplificar dominios de imágenes dinámicos de WooCommerce.
  images: {
    unoptimized: true
  }
};

module.exports = nextConfig;
