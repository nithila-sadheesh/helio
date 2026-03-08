# ☀️ Helio - Solar Intelligence Platform

<div align="center">

![Helio Logo](https://img.shields.io/badge/Helio-Solar%20Intelligence-orange?style=for-the-badge&logo=sun&logoColor=yellow)

**the ~~sky's~~ roof's the limit** - Comprehensive solar panel analysis platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18.2-green?logo=express)](https://expressjs.com/)

</div>

Helio is a data-driven solar analysis platform that transforms residential addresses into comprehensive solar feasibility reports using real-time geospatial and environmental APIs.

---

## 🏗️ Architecture & Features

### 📊 **Data Analysis Pipeline**
- **Geocoding**: Address-to-coordinate conversion via Nominatim API
- **Building Detection**: Real-time roof area calculation using Overpass API
- **Solar Irradiance**: PVGIS integration for precise yield calculations
- **Financial Modeling**: NREL utility rate database integration
- **Scoring Algorithm**: Weighted 1-10 suitability scoring system
- **AI Recommendations**: Claude API integration for installer evaluation

### 🔧 **Technical Implementation**
- **Microservices Architecture**: Separate frontend/backend with API proxy
- **Real-time Data Processing**: Multiple API integrations with error handling
- **Interactive Simulations**: Dynamic cost/benefit analysis with React state management
- **Geospatial Visualization**: Leaflet integration with satellite/street view layers
- **PDF Generation**: Print-optimized CSS for comprehensive report exports

### 📊 **Data Sources**
| API | Purpose | Integration |
|-----|---------|------------|
| **Nominatim** | Geocoding & coordinates | REST API |
| **Overpass API** | Building footprint detection | OQL queries |
| **PVGIS (JRC)** | Solar irradiance data | HTTP API |
| **NREL URDB** | Utility rate database | REST API |
| **Anthropic Claude** | AI-powered recommendations | SDK integration |

---

## ⚙️ Tech Stack

### Frontend
- **React 18.2** - Component-based UI framework
- **Vite 5.0** - Fast development server and build tool
- **React-Leaflet** - Interactive mapping with OpenStreetMap tiles
- **Recharts** - Data visualization charts
- **CSS3 Animations** - Scroll-triggered effects and transitions

### Backend
- **Node.js 18+** - JavaScript runtime
- **Express 4.18** - REST API server
- **Anthropic SDK** - AI integration for recommendations
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Infrastructure
- **API Proxy** - Frontend-to-backend communication
- **Concurrent Development** - Hot reload for both services
- **Print Optimization** - CSS media queries for PDF generation
- **Error Handling** - Graceful API failure management

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Anthropic API key (for AI-powered features)

### Installation

1. **Clone the repository**
```bash
git clone <repo-url>
cd helio
```

2. **Install dependencies**
```bash
npm run install:all
```

3. **Environment Setup**
```bash
# Create server environment file
cp server/.env.example server/.env
# Add your Anthropic API key to server/.env
ANTHROPIC_API_KEY=your_api_key_here
PORT=3001
```

4. **Start Development Servers**
```bash
# Start both client and server concurrently
npm run dev
```

Or run them separately:
```bash
# Terminal 1: Backend server (port 3001)
cd server && npm run dev

# Terminal 2: Frontend (port 5173)
cd client && npm run dev
```

5. **Open your browser**
Navigate to **http://localhost:5173**

---

## 🏗️ Project Structure

```
helio/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Landing.jsx          # Entry point component
│   │   │   ├── Report.jsx           # Main report container
│   │   │   ├── CurvedRoadmap.jsx   # Timeline visualization
│   │   │   └── steps/               # Analysis step components
│   │   ├── styles/global.css       # Global styles & animations
│   │   └── api.js                  # API client functions
│   ├── vite.config.js             # Vite configuration
│   └── package.json
├── server/
│   ├── index.js                   # Express API server
│   └── .env                       # Environment variables
└── package.json                   # Root workspace scripts
```

## 📊 Algorithm Details

### Suitability Score Calculation
The 1-10 score uses weighted factors:

| Factor | Weight | Data Source | Calculation |
|--------|--------|-------------|-------------|
| Solar Resource | 3.5 pts | PVGIS irradiance | kWh/m²/year normalized |
| Roof Area | 2.0 pts | Overpass API | m² of usable roof space |
| Shading Loss | 1.5 pts | PVGIS horizon | % shading impact |
| Electricity Rate | 1.5 pts | NREL URDB | $/kWh local rate |
| Roof Orientation | 1.5 pts | Building analysis | Optimal angle deviation |

### Financial Model
- **System Cost**: Calculated per-watt with regional adjustments
- **Federal Tax Credit**: 30% ITC application
- **ROI Calculation**: 25-year cash flow analysis
- **Environmental Impact**: CO2 reduction based on local grid mix

## � Build & Deployment

### Production Build
```bash
# Build frontend for production
cd client && npm run build

# Start production server
cd server && npm start
```

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analyze?address=<addr>` | Complete solar analysis |
| POST | `/api/installers` | Local installer recommendations |
| POST | `/api/actionplan` | Generate implementation roadmap |

### Deployment Options
- **Vercel**: Frontend with serverless functions
- **Heroku**: Full-stack Node.js deployment  
- **AWS EC2**: Container-based deployment
- **DigitalOcean**: Droplet with PM2 process management

### Environment Configuration
```env
ANTHROPIC_API_KEY=sk-ant-xxx
NODE_ENV=production
PORT=3001
```

## 🧪 Development

### Scripts
| Command | Description |
|---------|-------------|
| `npm run dev` | Concurrent development servers |
| `npm run install:all` | Install all dependencies |
| `cd client && npm run build` | Production build |
| `cd client && npm run preview` | Preview production build |

### API Integration Notes
- **Rate Limiting**: Built-in retry logic for external APIs
- **Error Handling**: Graceful degradation when services unavailable
- **Caching**: Response caching for repeated queries
- **Validation**: Input sanitization and coordinate validation
