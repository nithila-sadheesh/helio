# helio.

> **the ~~sky's~~ roof's the limit**

Helio is a solar panel effectiveness analyzer. Enter any home address and get a comprehensive report — from roof geometry and solar irradiance to CO₂ impact, financial ROI, and a personalized installation roadmap.

---

## What It Does

Given a street address, Helio produces a 9-step solar intelligence report:

| Step | Section | Data Source |
|------|---------|-------------|
| 1 | Property map & location | Nominatim / OpenStreetMap |
| 2 | Roof area, footprint & orientation | Overpass API (OSM building data) |
| 3 | Solar resource — annual yield, peak sun hours, shading loss | PVGIS (EU Joint Research Centre) |
| 4 | Financial analysis — electricity rate, annual spend, savings | NREL Utility Rate Database |
| 5 | Solar suitability score (1–10) | Weighted algorithm |
| 6 | Panel recommendation — count, system cost, 30% tax credit, ROI | Calculated |
| 7 | 25-year financial & environmental simulation | Interactive |
| 8 | Local installer directory | Claude AI (Anthropic) |
| 9 | Personalized action plan & roadmap | Claude AI (Anthropic) |

---

## Tech Stack

**Frontend**
- React 18 + Vite
- React-Leaflet (interactive maps)
- Recharts (solar production charts)
- Fraunces + Nunito (Google Fonts)

**Backend**
- Node.js + Express
- Anthropic Claude API (`claude-opus-4-6`) — installer lookup & action plans
- PVGIS EU JRC API — solar irradiance data
- NREL URDB API — electricity rates
- Nominatim — geocoding
- Overpass API — building footprint detection

---

## Getting Started

### Prerequisites

- Node.js 18+
- API keys for Anthropic and NREL (see below)

### 1. Clone & install

```bash
git clone <repo-url>
cd helio
npm run install:all
```

### 2. Configure environment variables

Create `server/.env`:

```env
ANTHROPIC_API_KEY=sk-ant-...
NREL_API_KEY=your_nrel_key_here   # or use DEMO_KEY (rate-limited)
PORT=3001
```

Get your keys:
- **Anthropic**: https://console.anthropic.com
- **NREL**: https://developer.nrel.gov/signup

### 3. Run

```bash
npm run dev
```

This starts both servers concurrently:
- **Frontend** → http://localhost:5173
- **Backend** → http://localhost:3001

---

## Project Structure

```
helio/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Landing.jsx          # Home page
│   │   │   ├── Report.jsx           # Report container & roadmap
│   │   │   ├── LoadingScreen.jsx
│   │   │   ├── InfoTip.jsx
│   │   │   └── steps/
│   │   │       ├── Step1Map.jsx
│   │   │       ├── Step2Roof.jsx
│   │   │       ├── Step3Solar.jsx
│   │   │       ├── Step4Financial.jsx
│   │   │       ├── Step5Score.jsx
│   │   │       ├── Step6Panels.jsx
│   │   │       ├── Step7Simulation.jsx
│   │   │       ├── Step8Installers.jsx
│   │   │       └── Step9ActionPlan.jsx
│   │   ├── styles/global.css
│   │   ├── api.js
│   │   └── App.jsx
│   ├── index.html
│   └── vite.config.js
├── server/
│   └── index.js             # Express API server
└── package.json             # Root workspace (concurrently)
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and backend in watch mode |
| `npm run install:all` | Install dependencies for root, server, and client |
| `cd client && npm run build` | Build frontend for production |
| `cd client && npm run preview` | Preview production build |

---

## Suitability Score Breakdown

The 1–10 score is weighted across five factors:

| Factor | Weight |
|--------|--------|
| Solar resource (annual yield) | 3.5 pts |
| Roof usable area | 2.0 pts |
| Shading loss | 1.5 pts |
| Electricity rate | 1.5 pts |
| Roof orientation | 1.5 pts |

---

## License

MIT
