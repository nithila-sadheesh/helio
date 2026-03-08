# ☀️ Helio - Solar Intelligence for Your Home

<div align="center">

![Helio Logo](https://img.shields.io/badge/Helio-Solar%20Intelligence-orange?style=for-the-badge&logo=sun&logoColor=yellow)

**the ~~sky's~~ roof's the limit** - Your comprehensive solar panel analysis platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)](https://nodejs.org/)

</div>

> 🌿 **Built for a sustainable future** - Helio transforms any home address into a detailed solar panel effectiveness report, breaking down barriers to residential solar adoption.

---

## ✨ Key Features

### 🎯 **Comprehensive Analysis**
- **Property Location**: Satellite imagery and interactive mapping
- **Roof Analysis**: Building footprint detection, orientation, shading analysis  
- **Solar Resource**: PVGIS data for precise irradiance calculations
- **Financial Modeling**: NREL utility rates, system costs, tax credits, 25-year ROI
- **Suitability Score**: Data-driven 1-10 scale with factor breakdowns
- **Panel Recommendations**: AI-powered technology selection and sizing
- **Interactive Simulation**: Real-time cost and environmental impact adjustments
- **Local Installers**: Web-searched vendor recommendations with ratings
- **Action Plan**: 6-week personalized implementation roadmap

### 🎨 **Beautiful UI/UX**
- **Scroll Animations**: Benchling-inspired slide-in, fade-in, and rise effects
- **Interactive Roadmap**: Curved timeline with animated orange neon tracing
- **Responsive Design**: Optimized for all screen sizes with full-width layouts
- **Modern Typography**: Georgia serif fonts for a premium, nature-inspired feel
- **Aesthetic Backgrounds**: Enhanced illuminated sunrise effects on landing
- **Hover Effects**: Pop-out animations with drop shadows on metrics
- **Spring Physics**: Natural bounce effects on titles and cards

### 📊 **Data Sources**
| Step | Section | Data Source |
|------|---------|-------------|
| 1 | Property map & location | Nominatim / OpenStreetMap |
| 2 | Roof area, footprint & orientation | Overpass API (OSM building data) |
| 3 | Solar resource — annual yield, peak sun hours, shading loss | PVGIS (EU Joint Research Centre) |
| 4 | Financial analysis — electricity rate, annual spend, savings | NREL Utility Rate Database |
| 5 | Solar suitability score (1–10) | Weighted algorithm |
| 6 | Panel recommendation — count, system cost, 30% tax credit, ROI | Calculated |
| 7 | 25-year financial & environmental simulation | Interactive |
| 8 | Local installer directory | Web search simulation |
| 9 | Personalized action plan & roadmap | Claude AI (Anthropic) |

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

## 🏗️ Architecture

### Frontend (React + Vite)
```
client/
├── src/
│   ├── components/
│   │   ├── Landing.jsx          # Landing page with enhanced hero section
│   │   ├── Report.jsx           # Main report container
│   │   ├── CurvedRoadmap.jsx   # Animated timeline component
│   │   ├── LoadingScreen.jsx   # Beautiful loading animation
│   │   └── steps/               # Individual analysis steps
│   ├── styles/
│   │   └── global.css          # Global styles and animations
│   └── api.js                  # API client functions
```

### Backend (Express + Node.js)
```
server/
├── index.js                    # Main server file
├── .env                        # Environment variables
└── api/                        # API route handlers
```

---

## 🎯 How It Works

1. **Address Input**: User enters any home address
2. **Geocoding**: Convert address to coordinates using Nominatim
3. **Roof Analysis**: Fetch building footprint and calculate usable area
4. **Solar Data**: Get irradiance data from PVGIS for the exact location
5. **Financial Analysis**: Lookup local utility rates and calculate ROI
6. **Scoring**: Calculate 1-10 suitability score based on weighted factors
7. **Recommendations**: AI-powered panel and installer suggestions
8. **Action Plan**: Generate personalized 6-week implementation roadmap

---

## 🌍 Environmental Impact

Helio emphasizes sustainability throughout:
- **CO2 Reduction**: Quantified in tons per year with 25-year projections
- **Tree Equivalents**: Environmental impact in relatable terms
- **Carbon Offset**: Annual electricity savings calculations
- **Long-term Benefits**: 25-year environmental and financial projections

---

## 📱 Features in Detail

### 🎨 **Animations & Interactions**
- **Scroll-triggered animations**: Elements slide, fade, and rise as you scroll
- **Interactive metrics**: Hover effects with pop-out animations and drop shadows
- **Neon roadmap tracing**: Orange highlight animates along the curved timeline
- **Spring physics**: Natural bounce effects on titles and cards
- **Staggered animations**: Sequential appearance of content elements

### 📊 **Data Visualization**
- **Interactive maps**: Satellite and street view toggles with markers
- **Gauge charts**: Visual suitability score representation with animations
- **Progress bars**: Factor breakdowns and comparisons
- **Simulation sliders**: Real-time cost and impact adjustments
- **Spaced metrics**: Full-width layout with equal prominence

### 📋 **Action Plan**
- **Curved Timeline**: Visual roadmap with weekly milestones
- **Task Checklists**: Detailed action items for each phase
- **Progress Tracking**: Click to mark tasks complete
- **PDF Export**: Comprehensive report download with all details

---

## 🔧 Configuration

### Environment Variables
```env
# server/.env
ANTHROPIC_API_KEY=your_anthropic_api_key
PORT=3001
NODE_ENV=development
```

### Suitability Score Breakdown
The 1–10 score is weighted across five factors:

| Factor | Weight | Description |
|--------|--------|-------------|
| Solar resource (annual yield) | 3.5 pts | PVGIS irradiance data |
| Roof usable area | 2.0 pts | Building footprint analysis |
| Shading loss | 1.5 pts | Horizon profile scanning |
| Electricity rate | 1.5 pts | NREL utility database |
| Roof orientation | 1.5 pts | Optimal sun exposure |

---

## 📦 Build & Deploy

### Production Build
```bash
# Build frontend
cd client && npm run build

# Start production server
cd server && npm start
```

### Deployment Options
- **Vercel**: Frontend deployment with serverless functions
- **Heroku**: Full-stack deployment
- **AWS**: Container deployment
- **Netlify**: Static frontend with serverless functions

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **OpenStreetMap**: Geocoding and mapping data
- **EU Joint Research Centre**: PVGIS solar data
- **NREL**: Utility rate database
- **Anthropic**: AI-powered insights and recommendations
- **React & Vite**: Modern frontend framework
- **Express**: Robust backend framework

---

## 📞 Support

For questions, suggestions, or issues:
- Create an [Issue](https://github.com/your-repo/helio/issues)
- Check the [Project Wiki](https://github.com/your-repo/helio/wiki)
- Review the [Documentation](https://github.com/your-repo/helio/docs)

---

<div align="center">

**Built with ❤️ for a sustainable future**

*"the roof's the limit"*

</div>
