# B2B Mushroom Supply - Deployment Guide

## 🚀 Deployment Options

### Backend Deployment

#### Option 1: Railway

1. Create account at railway.app
2. Connect your GitHub repository
3. Select the `backend` folder as root
4. Set environment variables in Railway dashboard
5. Deploy automatically on git push

#### Option 2: Render

1. Create account at render.com
2. Create new Web Service
3. Connect GitHub repo, set root directory to `backend`
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Set environment variables in Render dashboard

#### Option 3: Heroku

```bash
# Install Heroku CLI
heroku create your-app-name
cd backend
git init
git add .
git commit -m "Initial commit"
heroku git:remote -a your-app-name
git push heroku main
```

### Frontend Deployment

#### Option 1: Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in frontend directory
3. Follow prompts for deployment

#### Option 2: Netlify

1. Drag and drop `frontend` folder to netlify.com
2. Or connect GitHub repository
3. Set publish directory to `frontend`

#### Option 3: GitHub Pages

1. Push to GitHub repository
2. Enable GitHub Pages in repository settings
3. Set source to `frontend` folder

## 🔧 Environment Configuration

### Production Environment Variables

**Backend (.env):**

```env
NODE_ENV=production
PORT=5000
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-production-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@mushroomsupply.com
COMPANY_EMAIL=sales@mushroomsupply.com
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### Update Frontend API URL

Edit `frontend/js/app.js`:

```javascript
const CONFIG = {
  API_BASE_URL: 'https://your-backend.railway.app/api',
  // ... rest of config
};
```

## 📋 Pre-deployment Checklist

- [ ] Environment variables configured
- [ ] Email service tested
- [ ] API endpoints working
- [ ] Frontend connects to backend
- [ ] All dependencies installed
- [ ] Error handling tested
- [ ] Mobile responsiveness verified
- [ ] Performance optimized
- [ ] Security headers enabled
- [ ] CORS properly configured

## 🌐 Domain Setup

### Custom Domain (Optional)

1. Purchase domain from registrar
2. Update DNS settings to point to deployment
3. Configure SSL certificate
4. Update CORS settings in backend

### SSL Certificate

Most platforms (Vercel, Netlify, Railway) provide free SSL automatically.

## 📊 Monitoring Setup

### Backend Monitoring

- Error tracking: Implement Sentry or similar
- Performance monitoring: New Relic or DataDog
- Uptime monitoring: UptimeRobot or Pingdom

### Analytics

- Google Analytics for website traffic
- API usage tracking in backend logs

## 🔄 CI/CD Pipeline

### GitHub Actions (Optional)

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy Backend
        # Add deployment steps
      - name: Deploy Frontend
        # Add deployment steps
```

## 🧪 Testing in Production

### Smoke Tests

```bash
# Test API health
curl https://your-backend.railway.app/health

# Test products endpoint
curl https://your-backend.railway.app/api/products

# Test frontend loads
curl https://your-frontend.vercel.app
```

## 🎯 Performance Optimization

### Backend

- Enable gzip compression (already configured)
- Use CDN for static assets
- Implement caching strategies
- Database connection pooling (if using database)

### Frontend

- Minify CSS/JS for production
- Optimize images
- Use CDN for external libraries
- Implement service worker for caching

## 📞 Production Support

### Error Handling

- Implement proper logging
- Set up error alerting
- Create monitoring dashboards
- Document troubleshooting steps

### Backup Strategy

- Regular database backups (if applicable)
- Code repository backups
- Environment configuration backups

---

**Ready for Professional B2B Deployment! 🚀**
