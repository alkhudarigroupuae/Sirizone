/**
 * Google Analytics & Search Console Integration
 * للتتبع والتحليلات وتحسين محركات البحث
 */

declare global {
  interface Window {
    gtag: any;
    dataLayer: any;
  }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || '';

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Track custom events
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// E-commerce tracking
export const trackPurchase = (transaction: {
  transaction_id: string;
  value: number;
  currency: string;
  tax?: number;
  shipping?: number;
  items: Array<{
    item_id: string;
    item_name: string;
    price: number;
    quantity: number;
    item_category?: string;
    item_vendor?: string;
  }>;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', transaction);
  }
};

// Track product views
export const trackProductView = (product: {
  item_id: string;
  item_name: string;
  price: number;
  item_category?: string;
  item_vendor?: string;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'view_item', {
      items: [product]
    });
  }
};

// Track add to cart
export const trackAddToCart = (product: {
  item_id: string;
  item_name: string;
  price: number;
  quantity: number;
  item_vendor?: string;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'add_to_cart', {
      items: [product]
    });
  }
};

// Track vendor performance (custom event)
export const trackVendorSale = (vendorId: string, amount: number) => {
  event({
    action: 'vendor_sale',
    category: 'Vendor',
    label: vendorId,
    value: amount
  });
};

// Generate structured data for SEO
export const generateProductSchema = (product: any) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.descripTion,
    image: product.image,
    sku: product.id,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: product.vendor || 'Sirizone Marketplace'
      }
    }
  };
};

// Submit sitemap to Google Search Console (server-side)
export const submitSitemapToGSC = async () => {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    const sitemapUrl = `${siteUrl}/sitemap.xml`;
    
    // This would typically be done through Google Search Console API
    console.log('Submit this sitemap URL to Google Search Console:', sitemapUrl);
    console.log('Manual steps:');
    console.log('1. Go to https://search.google.com/search-console');
    console.log('2. Add your property:', siteUrl);
    console.log('3. Submit sitemap:', sitemapUrl);
    
    return { success: true, sitemapUrl };
  } catch (error) {
    console.error('Error submitting sitemap:', error);
    return { success: false, error };
  }
};
