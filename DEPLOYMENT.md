# Sirizone Marketplace - Deployment Guide

## Prerequisites

1. **cPanel Server Access** with your eCommerce API (Boom Commerce/WooCommerce)
2. **Node.js 18+** installed on your server
3. **Domain name** configured and pointing to your server

## Step 1: Configure API Connection

### For WooCommerce/Boom Commerce:

1. Log in to your WordPress admin panel
2. Go to **WooCommerce → Settings → Advanced → REST API**
3. Click **Add Key** to create new API credentials
4. Set permissions to **Read/Write**
5. Copy the **Consumer Key** and **Consumer Secret**

### Update Environment Variables:

Edit `.env.production` file:

```bash
NEXT_PUBLIC_API_URL=https://yourdomain.com/wp-json/wc/v3
NEXT_PUBLIC_WC_CONSUMER_KEY=ck_xxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_WC_CONSUMER_SECRET=cs_xxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## Step 2: Test API Connection Locally

```bash
# Install dependencies
npm install

# Test with production environment
npm run build
npm start
```

Visit http://localhost:3000 and verify products load from your server.

## Step 3: Build for Production

```bash
# Create optimized production build
npm run build

# This creates a .next folder with your production-ready files
```

## Step 4: Deploy to cPanel

### Option A: Using Node.js App in cPanel

1. Log in to cPanel
2. Go to **Software → Setup Node.js App**
3. Click **Create Application**
4. Configure:
   - **Node.js version**: 18.0 or higher
   - **Application mode**: Production
   - **Application root**: /home/username/sirizone-marketplace
   - **Application URL**: yourdomain.com
   - **Application startup file**: server.js

5. Click **Create**

6. Upload your files via FTP or File Manager to the application root

7. In the Node.js App interface, click **Run NPM Install**

8. Add environment variables in the interface

9. Click **Restart** to start your app

### Option B: Using Static Export (Recommended for cPanel)

If your cPanel doesn't support Node.js apps well, use static export:

1. Update `next.config.ts`:
```typescript
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

2. Build static version:
```bash
npm run build
```

3. Upload the `out` folder contents to your `public_html` directory via FTP

4. Configure `.htaccess` for clean URLs:
```apache
RewriteEngine On
RewriteBase /
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L]
```

## Step 5: Configure Domain & SSL

1. In cPanel, go to **Security → SSL/TLS Status**
2. Install SSL certificate for your domain (free Let's Encrypt)
3. Force HTTPS redirect in `.htaccess`:
```apache
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

## Step 6: Test Production Site

Visit your domain and verify:
- ✅ Site loads correctly
- ✅ Products display from your server API
- ✅ Images load properly
- ✅ Search works
- ✅ Cart functionality works
- ✅ SSL certificate is active (https://)

## API Endpoints Reference

Your WooCommerce API should provide these endpoints:

- **Products**: `/wp-json/wc/v3/products`
- **Categories**: `/wp-json/wc/v3/products/categories`
- **Orders**: `/wp-json/wc/v3/orders`
- **Customers**: `/wp-json/wc/v3/customers`

Test API endpoint:
```bash
curl -u consumer_key:consumer_secret https://yourdomain.com/wp-json/wc/v3/products
```

## Troubleshooting

### Products not loading?
1. Check API credentials in `.env.production`
2. Verify WooCommerce REST API is enabled
3. Check CORS settings on your WordPress site
4. Review browser console for errors

### Images not displaying?
1. Update image paths to use absolute URLs
2. Check `next.config.ts` image configuration
3. Verify image URLs from API are accessible

### 404 Errors?
1. Configure `.htaccess` rewrite rules
2. Check Next.js routing configuration
3. Verify base path in `next.config.ts`

## Performance Optimization

1. **Enable caching** in cPanel
2. **Use CDN** for static assets
3. **Optimize images** before upload
4. **Enable Gzip compression** in cPanel
5. **Configure Redis** if available for API caching

## Security Checklist

- ✅ SSL certificate installed
- ✅ API keys stored in environment variables (not in code)
- ✅ CORS properly configured
- ✅ Rate limiting enabled on API
- ✅ Input validation on all forms
- ✅ Security headers configured

## Need Help?

Check the API integration at: `src/lib/api.ts`

For WooCommerce API documentation: https://woocommerce.github.io/woocommerce-rest-api-docs/
