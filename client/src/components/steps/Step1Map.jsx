import { useState } from 'react'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet'

const SATELLITE_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
const STREET_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

function createIcon() {
  return L.divIcon({
    className: '',
    html: `<div style="width:20px;height:20px;border-radius:50%;background:radial-gradient(circle,#FCD34D,#F59E0B);border:3px solid white;box-shadow:0 0 0 3px rgba(245,158,11,0.35),0 4px 10px rgba(0,0,0,0.4)"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  })
}

export default function Step1Map({ location }) {
  const [satellite, setSatellite] = useState(true)
  const pos = [location.lat, location.lon]

  return (
    <div className="step-section" style={{ animationDelay: '0ms' }}>
      <div className="step-header">
        <div className="step-title">Property Location</div>
      </div>
      <div className="card" style={{ padding: '14px' }}>
        <div style={{ fontSize: '0.82rem', color: 'var(--text2)', marginBottom: 10, padding: '0 2px' }}>
          {location.display}
        </div>
        <div className="map-toggle">
          <button className={satellite ? 'active' : ''} onClick={() => setSatellite(true)}>Satellite</button>
          <button className={!satellite ? 'active' : ''} onClick={() => setSatellite(false)}>Street Map</button>
        </div>
        <div className="map-container">
          <MapContainer center={pos} zoom={18} style={{ width: '100%', height: '100%' }} scrollWheelZoom={false}>
            {satellite
              ? <TileLayer url={SATELLITE_URL} attribution="Tiles &copy; Esri" />
              : <TileLayer url={STREET_URL} attribution='&copy; OpenStreetMap contributors' />
            }
            <Marker position={pos} icon={createIcon()} />
          </MapContainer>
        </div>
      </div>
    </div>
  )
}
