import { Helmet } from 'react-helmet-async';

export const SEO = ({ title, description, image, schema }) => {
  const siteTitle = 'Brewline Cafe | Premium Artisan Coffee';
  const fullTitle = title ? `${title} - Brewline Cafe` : siteTitle;
  const defaultDesc = 'Order ahead and skip the line. Enjoy premium artisan coffee and fresh pastries crafted with love — your way, every time.';
  const finalDesc = description || defaultDesc;
  const siteUrl = window.location.origin;
  const defaultImage = `${siteUrl}/images/hero-bg.png`;
  const finalImage = image || defaultImage;

  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={finalDesc} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={finalDesc} />
      <meta property="og:image" content={finalImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={siteUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={finalDesc} />
      <meta property="twitter:image" content={finalImage} />

      {/* Structured Data */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};
