# API Integration Checklist

## Before Publishing

### 1. Get API Credentials from cPanel

Log in to your cPanel and find your Boom Commerce/WooCommerce installation:

- [ ] WordPress Admin URL: `https://yourdomain.com/wp-admin`
- [ ] Go to: WooCommerce → Settings → Advanced → REST API
- [ ] Create API Key with Read/Write permissions
- [ ] Copy Consumer Key: `ck_xxxxxxxxxxxxx`
- [ ] Copy Consumer Secret: `cs_xxxxxxxxxxxxx`

### 2. Update Environment Variables

Edit `.env.production` with your actual values:

```bash
NEXT_PUBLIC_API_URL=https://yourdomain.com/wp-json/wc/v3
NEXT_PUBLIC_WC_CONSUMER_KEY=ck_your_actual_key_here
NEXT_PUBLIC_WC_CONSUMER_SECRET=cs_your_actual_secret_here
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### 3. Test API Connection

Run this command to test your API:

```bash
# Windows PowerShell
$auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("ck_xxxxx:cs_xxxxx"))
Invoke-RestMethod -Uri "https://yourdomain.com/wp-json/wc/v3/products" -Headers @{Authorization="Basic $auth"}
```

Expected response: JSON array of products

### 4. Enable CORS on WordPress

Add to your WordPress `wp-config.php` or use a plugin:

```php
header("Access-Control-Allow-Origin: https://yourdomain.com");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
```

Or install: **WP CORS** plugin from WordPress.org

### 5. Update API Integration

The API helper is ready at `src/lib/api.ts`. Use it in components:

```typescript
import { getProducts, getProduct } from '@/lib/api';

// Fetch all products
const products = await getProducts({ per_page: 20, featured: true });

// Fetch single product
const product = await getProduct('product-slug');
```

### 6. Security Considerations

- [ ] Never commit `.env.production` to git
- [ ] Use HTTPS only (SSL certificate)
- [ ] Enable rate limiting on API
- [ ] Validate all user inputs
- [ ] Use strong API keys

### 7. Deployment Methods

Choose one:

**Method A: Static Export** (Easiest for cPanel)
- Works on any cPanel hosting
- No Node.js required
- Fast and secure
- See DEPLOYMENT.md for steps

**Method B: Node.js App** (More features)
- Requires cPanel with Node.js support
- Server-side rendering
- Better SEO
- See DEPLOYMENT.md for steps

### 8. Next Steps

1. **Test locally** with production API
2. **Build** for production
3. **Upload** to cPanel
4. **Configure** domain and SSL
5. **Test** on live domain

## Quick Commands

```bash
# Install dependencies
npm install

# Test with production env
npm run build && npm start

# Build for deployment
npm run build

# For static export (add to next.config.ts first)
npm run build
# Then upload 'out' folder to public_html
```

## Support

Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment guide.
