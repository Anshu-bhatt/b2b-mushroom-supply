# B2B Mushroom Supply Company Website

A professional full-stack B2B mushroom supply website built with Node.js/Express backend and vanilla JavaScript frontend. Designed for industrial, wholesale, nutraceutical, pharmaceutical, and export clients.

## 🏗️ Project Structure

```
/
├── backend/                 # Node.js + Express API
│   ├── server.js           # Main server file
│   ├── routes/             # API routes
│   ├── models/             # Data models
│   ├── controllers/        # Route controllers
│   ├── config/             # Configuration files
│   ├── package.json        # Dependencies
│   └── .env               # Environment variables
└── frontend/               # Static frontend
    ├── index.html         # Main HTML page
    ├── css/               # Stylesheets
    ├── js/                # JavaScript files
    └── assets/            # Images and static assets
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Email account for notifications (Gmail recommended)

### Backend Setup

1. **Navigate to backend directory:**

   ```bash
   cd backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**

   ```bash
   # Copy .env template and configure
   cp .env .env.local
   # Edit .env with your settings
   ```

4. **Start the server:**

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

### Frontend Setup

1. **Navigate to frontend directory:**

   ```bash
   cd frontend
   ```

2. **Serve static files (development):**

   ```bash
   # Using Python
   python -m http.server 3000

   # Using Node.js http-server
   npx http-server -p 3000

   # Using Live Server (VS Code extension)
   # Right-click on index.html → "Open with Live Server"
   ```

3. **Update API endpoint (if needed):**
   Edit `js/app.js` and update `CONFIG.API_BASE_URL` if your backend runs on a different port.

## 🔧 Configuration

### Backend Environment Variables (.env)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Email Configuration (required for inquiry notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
COMPANY_EMAIL=admin@mushroomsupply.com

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

### Email Setup (Gmail)

1. **Enable 2-factor authentication** on your Gmail account
2. **Generate an app password:**
   - Go to Google Account settings
   - Security → 2-Step Verification
   - App passwords → Generate password
   - Use the generated password in `EMAIL_PASS`

## 📡 API Endpoints

### Products

- `GET /api/products` - Get all products
- `GET /api/products?category=fresh` - Filter by category
- `GET /api/products/categories` - Get product categories
- `GET /api/products/search?q=mushroom` - Search products
- `GET /api/products/:id` - Get product by ID

### Inquiries

- `POST /api/inquiry` - Submit bulk inquiry
- `GET /api/inquiry` - Get all inquiries (admin)
- `GET /api/inquiry/:id` - Get specific inquiry
- `PUT /api/inquiry/:id` - Update inquiry status

### System

- `GET /health` - Health check
- `GET /api/status` - API status

## 🛠️ Development

### Running in Development Mode

1. **Backend (with auto-reload):**

   ```bash
   cd backend
   npm run dev
   ```

2. **Frontend (with live reload):**
   ```bash
   cd frontend
   # Use Live Server extension in VS Code
   # Or any static file server
   ```

### Project Features

- ✅ Professional B2B design
- ✅ Responsive mobile layout
- ✅ Product catalog with categories
- ✅ Bulk inquiry form system
- ✅ Email notifications
- ✅ REST API architecture
- ✅ Error handling and validation
- ✅ Corporate green color theme
- ✅ Professional typography
- ✅ Accessibility features

## 🌐 Deployment

### Backend Deployment (Render/Railway/Heroku)

1. **Prepare for deployment:**

   ```bash
   # Ensure package.json has correct start script
   "scripts": {
     "start": "node server.js"
   }
   ```

2. **Set environment variables** in your hosting platform dashboard

3. **Deploy** using Git or platform-specific CLI

### Frontend Deployment (Vercel/Netlify)

1. **Build static files** (if using build process)
2. **Deploy** the `frontend` folder
3. **Update API endpoint** in `js/app.js` to point to your deployed backend

### Environment-specific Configuration

```javascript
// frontend/js/app.js
const CONFIG = {
  API_BASE_URL:
    process.env.NODE_ENV === 'production'
      ? 'https://your-backend.onrender.com/api'
      : 'http://localhost:5000/api',
};
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] Backend API endpoints respond correctly
- [ ] Product categories load and display
- [ ] Product filtering works
- [ ] Inquiry form submits successfully
- [ ] Email notifications are sent
- [ ] Mobile responsive design works
- [ ] Navigation and scrolling smooth
- [ ] Error handling displays user-friendly messages

### API Testing

```bash
# Test products endpoint
curl http://localhost:5000/api/products

# Test health endpoint
curl http://localhost:5000/health

# Test inquiry submission
curl -X POST http://localhost:5000/api/inquiry \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","companyName":"Test Co","email":"test@example.com","phone":"1234567890","productRequired":"Fresh Mushrooms","quantity":"100kg"}'
```

## 📝 Product Categories

1. **Fresh Mushrooms**
   - Fresh Oyster Mushrooms
   - Button Mushrooms
   - Gucchi (Morel) Mushrooms

2. **Dry Mushrooms**
   - Dry Oyster Mushrooms
   - Dry Button Mushrooms

3. **Medicinal Mushrooms**
   - Cordyceps

4. **Food & Pharma Ingredients**
   - Food Additives
   - Pharmaceutical Intermediates & APIs

## 🎨 Design Specifications

- **Color Scheme:** Professional green and earthy tones
- **Typography:** Inter (body), Playfair Display (headings)
- **Layout:** Responsive grid system
- **Target Audience:** B2B clients, pharmaceutical companies, wholesalers
- **Brand Positioning:** Premium, professional, trustworthy

## 🔒 Security Features

- Input validation and sanitization
- CORS protection
- Helmet.js security headers
- Rate limiting (can be added)
- Environment variable protection
- SQL injection prevention (data structure based)

## 📞 Support

For technical support or business inquiries:

- Email: sales@mushroomsupply.com
- Phone: +1 (555) 123-4567

## 📄 License

Copyright © 2024 B2B Mushroom Supply Company. All rights reserved.

---

**Built with ❤️ for professional mushroom supply industry**
