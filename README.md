# 🎥 Socio Video Downloader

A modern, full-stack web application for downloading videos from popular social media platforms including Instagram, TikTok, YouTube, Twitter, and Facebook. Built with cutting-edge technologies and designed for scalability.

## ✨ Features

### Core Functionality
- 🎯 **Universal Video Detection** - Automatically detects platform from URL
- ⚡ **Fast Downloads** - Powered by yt-dlp for reliable video extraction
- 🎨 **Multiple Quality Options** - HD, SD, and various format support
- 🚫 **No Registration Required** - Anonymous usage for privacy

### Smart Limitations & UX
- 📊 **Rate Limiting** - 5 downloads per day for free users
- ⏱️ **Usage Tracking** - Real-time display of remaining downloads
- 🔄 **Daily Reset** - Automatic limit refresh every 24 hours
- 💡 **Upgrade Prompts** - Smooth transition path to paid plans

### Technical Features  
- 🛡️ **Security First** - IP-based rate limiting with hashed identifiers
- ☁️ **Cloud Storage** - Temporary file hosting via Cloudinary
- 📈 **Analytics Ready** - Download history and usage metrics
- 🔗 **Temporary Links** - 24-hour expiring download URLs
- 🚀 **Performance Optimized** - Redis caching and async processing

---

## 🏗️ Architecture Overview
![Architecture Diagram](/frontend/public/architecture-diagram.png)

### **Data Flow**
1. **User Input** → URL submitted via modern React interface
2. **Platform Detection** → Automatic identification of video source
3. **Rate Limiting** → Redis-based daily usage validation  
4. **Video Processing** → yt-dlp extracts and downloads content
5. **Cloud Storage** → Temporary upload to Cloudinary CDN
6. **Database Logging** → Usage tracking and analytics storage
7. **Download Delivery** → Secure, expiring download link to user


## 🛠️ Tech Stack
### **Infrastructure & Services**
| Service | Tier | Purpose |
|---------|------|---------|
| [Neon](https://neon.tech/) | Free | Serverless PostgreSQL database |
| [Upstash Redis](https://upstash.com/) | Free | Serverless Redis for rate limiting |
| [Cloudinary](https://cloudinary.com/) | Free | Media storage and CDN delivery |
| [Vercel](https://vercel.com/) | Free | Frontend hosting and deployment |
| [Railway](https://railway.app/) | Free | Backend hosting and deployment |

---

## 📊 System Architecture

### **Microservices Design**
```

📦 socio-video-downloader/
├── 🌐 frontend/              \# Next.js 15 + TypeScript
│   ├── 📱 src/components/    \# Reusable UI components
│   ├── 🎨 src/styles/        \# Tailwind CSS configuration
│   ├── 🔧 src/hooks/         \# Custom React hooks
│   ├── 📡 src/lib/           \# API client and utilities
│   └── 🏷️ src/types/         \# TypeScript definitions
│
├── 🚀 backend/               \# FastAPI + Python
│   ├── 📋 app/models.py      \# SQLModel database schemas
│   ├── 🛠️ app/services/      \# Business logic layer
│   │   ├── platform_detector.py    \# URL pattern matching
│   │   ├── video_info_extractor.py \# yt-dlp integration
│   │   ├── rate_limiter.py         \# Redis-based limiting
│   │   └── download_service.py     \# Video processing
│   ├── 🔌 app/utils/         \# Helper functions
│   └── 🌐 main.py           \# FastAPI application entry
│
└── 🐳 docker-compose.yml    \# Container orchestration

```

### **Database Schema**
```

📊 downloads
├── id (UUID)              \# Primary key
├── client_id (String)     \# Hashed IP + User-Agent
├── url (Text)             \# Original video URL
├── platform (String)     \# Detected platform (youtube, instagram, etc.)
├── title (Text)           \# Video title from metadata
├── file_size (BigInt)     \# Downloaded file size in bytes
├── format (String)        \# Requested quality/format
├── status (Enum)          \# pending, processing, completed, failed
├── download_url (Text)    \# Cloudinary temporary URL
├── expires_at (DateTime)  \# 24-hour expiration timestamp
└── created_at (DateTime)  \# Download initiation time

```

### **API Endpoints**
```

🌐 REST API Routes

GET  /                     \# API status and version info
POST /api/video-info       \# Extract video metadata (no download)
GET  /api/usage           \# Current user's daily usage stats
POST /api/download        \# Process video download with rate limiting
GET  /api/history         \# User's recent download history (20 items)
GET  /docs               \# Interactive API documentation (Swagger UI)

```

---

## 🔒 Security & Rate Limiting

### **Anonymous User Tracking**
- **Privacy-First**: No personal data collection or user accounts
- **Client Identification**: SHA-256 hash of IP address + User-Agent string
- **Session Management**: Browser localStorage for download history
- **Data Retention**: Download records expire after 30 days

### **Rate Limiting Strategy**
```bash
# Daily Limits (per client identifier)
FREE_TIER = {
  "downloads_per_day": 5,
  "max_file_size": "500MB",
  "quality_limit": "720p",
  "formats": ["MP4", "MP3"]
}

# Reset mechanism: UTC midnight daily
# Storage: Redis with TTL expiration
# Fallback: Allow requests if Redis unavailable
```

### **Content Security**
- **CORS Protection**: Configured origins for production
- **Input Validation**: Pydantic schemas for all API inputs
- **URL Sanitization**: Malicious link detection and filtering
- **Copyright Compliance**: Terms of service and usage guidelines
- **Temporary Storage**: 24-hour file expiration for legal compliance


## ⚡ Performance & Scalability

### **Optimization Strategies**
- **Async Processing**: FastAPI async endpoints for concurrent handling
- **Redis Caching**: Rate limit counters and metadata caching  
- **CDN Delivery**: Cloudinary global edge network
- **Database Indexing**: Optimized queries on client_id and timestamps
- **Frontend Caching**: Next.js automatic static optimization

### **Monitoring & Analytics**
- **Usage Metrics**: Daily download counts and platform popularity
- **Performance Tracking**: API response times and error rates
- **Capacity Planning**: Redis memory usage and database growth
- **Error Logging**: Structured logging for debugging and maintenance

### **Scalability Considerations**
- **Horizontal Scaling**: Stateless API design for load balancing
- **Database Sharding**: Client-based partitioning for growth
- **Queue System**: Background job processing for heavy downloads
- **CDN Scaling**: Cloudinary auto-scales for global delivery



## 🚀 Deployment Architecture

### **Production Environment**
```
🌍 Production Stack

📱 Frontend (Vercel)
├── Global CDN distribution
├── Automatic HTTPS/SSL
├── Environment variable management
└── Preview deployments for PRs

🔗 API Gateway (Railway/Render)
├── Auto-scaling based on traffic
├── Health checks and monitoring
├── Environment isolation
└── Continuous deployment from Git

💾 Data Layer
├── 🐘 Neon PostgreSQL (Primary database)
├── 🔴 Upstash Redis (Rate limiting cache)
└── ☁️ Cloudinary (Media storage & CDN)

```

### **Development Workflow**
1. **Local Development**: Docker Compose for full stack
2. **Testing**: Automated API tests with pytest
3. **Staging**: Branch-based preview deployments
4. **Production**: Main branch auto-deployment
5. **Monitoring**: Health checks and error tracking

---

## 📈 Business Model & Monetization

### **Freemium SaaS Strategy**
```
💰 Revenue Tiers

🆓 FREE TIER
├── 5 downloads/day
├── 720p max quality
├── Standard formats
└── 24h download expiry

💎 PRO TIER ($9.99/month)
├── Unlimited downloads
├── 4K quality support
├── All formats \& codecs
├── 7-day download retention
├── No advertisements
├── Download history sync
└── Priority processing

🏢 BUSINESS TIER ($19.99/month)
├── Everything in Pro
├── API access (1000 calls/month)
├── White-label solutions
├── Analytics dashboard
├── Team management
├── Custom branding
└── Dedicated support

```

### **Growth Strategy**
- **Viral Coefficient**: Easy sharing of downloaded content
- **SEO Optimization**: Platform-specific landing pages
- **Social Proof**: Download counters and user testimonials
- **Conversion Funnels**: Limit-reached upgrade prompts
- **Retention Hooks**: Download history and favorites

---

## 🌟 Future Roadmap

### **Phase 1: Core Features** ✅
- [x] Multi-platform video detection
- [x] Basic download functionality  
- [x] Rate limiting and usage tracking
- [x] Responsive web interface

### **Phase 2: Enhanced UX** 🚧
- [ ] User authentication system
- [ ] Download queue management
- [ ] Batch/playlist downloads
- [ ] Mobile app (React Native)

### **Phase 3: Premium Features** 📋
- [ ] 4K quality support
- [ ] Advanced format options
- [ ] Cloud storage integration
- [ ] API for developers

### **Phase 4: Enterprise** 🎯  
- [ ] White-label solutions
- [ ] Team collaboration tools
- [ ] Advanced analytics
- [ ] Custom integrations

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+ and npm
- Python 3.11+ and pip
- Git

### **Development Setup**

#### **1. Clone Repository**
```bash
git clone https://github.com/muslimalfatih/socio-video-downloader.git
cd socio-video-downloader
```

#### **2. Backend Setup**
```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  \# On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env

# Edit .env with your database and API credentials
# Start the backend server

uvicorn main:app --reload
```
The backend will be available at: http://localhost:8000

#### **3. Frontend Setup**
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.local.example .env.local

# Edit .env.local with your API URL

# Start the development server
npm run dev

```
The frontend will be available at: http://localhost:3000

#### **4. Docker Setup (Alternative)**
```bash

# Start both frontend and backend with Docker
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
```

## **Environment Configuration**

#### **Backend Environment Variables (.env)**

```bash
# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxx_token_here

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# App Config
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
MAX_DOWNLOADS_PER_DAY=5

```
#### **Frontend Environment Variables (.env.local)**
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

---

<div align="center">

**Built with ❤️ by [Muslim Al Fatih](https://github.com/muslimalfatih)**

[⭐ Star this repo](https://github.com/muslimalfatih/socio-video-downloader) • [🐛 Report Bug](https://github.com/muslimalfatih/socio-video-downloader/issues) • [💡 Request Feature](https://github.com/muslimalfatih/socio-video-downloader/issues)

</div>
