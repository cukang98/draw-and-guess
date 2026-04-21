export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: 'https://draw-and-guess.com/sitemap.xml', // Replace with your domain
  };
}
