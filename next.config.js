/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'books.google.com',
      'covers.openlibrary.org',
      'images-na.ssl-images-amazon.com',
      'lh3.googleusercontent.com'
    ],
  },
  // PWA configuration will be added with next-pwa
}

module.exports = nextConfig
