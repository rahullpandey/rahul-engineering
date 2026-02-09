const description =
  "Trusted manpower partner for premium hospitality. We support 5-star hotels with trained teams, project coverage, and on-time staffing.";

export default function Head() {
  return (
    <>
      <meta property="og:title" content="Rahul Engineering" />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://www.rahulengineerings.com" />
      <meta property="og:site_name" content="Rahul Engineering" />
      <meta
        property="og:image"
        content="https://www.rahulengineerings.com/og.jpg?v=3"
      />
      <meta
        property="og:image:secure_url"
        content="https://www.rahulengineerings.com/og.jpg?v=3"
      />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Rahul Engineering" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Rahul Engineering" />
      <meta name="twitter:description" content={description} />
      <meta
        name="twitter:image"
        content="https://www.rahulengineerings.com/og.jpg?v=3"
      />
      <link rel="canonical" href="https://www.rahulengineerings.com" />
    </>
  );
}
