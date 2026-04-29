'use client';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { Navbar } from './Navbar';
import { MapPin, AlertTriangle, Navigation, X, Phone, Hospital, Cloud, Route } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { touristSpots } from '@/data/touristSpots';
import { dangerZones } from '@/data/dangerZones';
import { SoundManager } from '@/utils/sounds';

const UserIcon = L.divIcon({
  className: 'custom-user-marker',
  html: `<div style="background: linear-gradient(135deg, #ff0040 0%, #ffff00 100%); width: 40px; height: 40px; border-radius: 50%; border: 4px solid white; box-shadow: 0 0 20px rgba(255, 0, 64, 0.8); display: flex; align-items: center; justify-center;">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const DraggableIcon = L.divIcon({
  className: 'custom-draggable-marker',
  html: `<div style="background: linear-gradient(135deg, #00ff41 0%, #00d9ff 100%); width: 36px; height: 36px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 20px rgba(0, 255, 65, 0.8); display: flex; align-items: center; justify-center; cursor: move;">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  </div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

// Create emoji markers for tourist spots
const createEmojiIcon = (emoji: string) => L.divIcon({
  className: 'custom-emoji-marker',
  html: `<div style="font-size: 32px; text-shadow: 0 0 10px rgba(0, 255, 65, 0.8), 0 0 20px rgba(0, 255, 65, 0.6); filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));">${emoji}</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const emojiMap: { [key: string]: string } = {
  'bannerghatta': '🐯',
  'lalbagh': '🌳',
  'vidhana-soudha': '🏛️',
  'iskcon': '🛕',
  'cubbon-park': '🌲',
  'bangalore-palace': '🏰',
  'tipu-palace': '🕌',
  'ulsoor-lake': '🌊',
  'nandi-hills': '⛰️',
  'wonderla': '🎢'
};

function DraggableMarker({ onPositionChange, onDangerAlert }: { onPositionChange: (pos: [number, number]) => void; onDangerAlert: (zone: any) => void }) {
  const [position, setPosition] = useState<[number, number]>([12.9716, 77.5946]);
  const markerRef = useRef<any>(null);

  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;
      if (marker != null) {
        const newPos: [number, number] = [marker.getLatLng().lat, marker.getLatLng().lng];
        setPosition(newPos);
        onPositionChange(newPos);
        
        dangerZones.forEach(zone => {
          const distance = marker.getLatLng().distanceTo(L.latLng(zone.position[0], zone.position[1]));
          if (distance <= zone.radius) {
            onDangerAlert(zone);
          }
        });
      }
    },
  };

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
      icon={DraggableIcon}
    >
      <Popup>
        <div className="text-center">
          <MapPin className="h-5 w-5 mx-auto mb-2 text-green-600" />
          <strong>Drag me!</strong>
          <br />
          <span className="text-xs text-gray-600">Move to test zones</span>
        </div>
      </Popup>
    </Marker>
  );
}

function LocationMarker() {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const map = useMap();

  useEffect(() => {
    map.locate().on('locationfound', function (e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      map.flyTo(e.latlng, 13);
    });
  }, [map]);

  return position === null ? null : (
    <Marker position={position} icon={UserIcon}>
      <Popup>
        <div className="text-center p-2">
          <div className="w-8 h-8 mx-auto mb-2 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full flex items-center justify-center">
            <Navigation className="h-4 w-4 text-white" />
          </div>
          <strong className="text-sm">Your Location</strong>
          <br />
          <span className="text-xs text-gray-600">
            {position[0].toFixed(4)}, {position[1].toFixed(4)}
          </span>
        </div>
      </Popup>
    </Marker>
  );
}

function TouristSpotMarkers({ onVisit, onNavigate }: { onVisit: (spot: any) => void; onNavigate: (spot: any) => void }) {
  return (
    <>
      {touristSpots.map((spot) => (
        <div key={spot.id}>
          {/* Green safe zone circle */}
          <Circle
            center={spot.position}
            radius={400}
            pathOptions={{
              color: '#00ff41',
              fillColor: '#00ff41',
              fillOpacity: 0.15,
              weight: 2,
              opacity: 0.6,
            }}
          />
          {/* Emoji marker */}
          <Marker
            position={spot.position}
            icon={createEmojiIcon(emojiMap[spot.id] || '📍')}
          >
            <Popup>
              <div className="text-center p-3 min-w-[250px]">
                <div className="text-4xl mb-3">{emojiMap[spot.id] || '📍'}</div>
                <img src={spot.image} alt={spot.name} className="w-full h-32 object-cover rounded-lg mb-3" />
                <strong className="text-sm block mb-2">{spot.name}</strong>
                <p className="text-xs text-gray-600 mb-3">{spot.description}</p>
                <span className={`text-xs font-bold px-2 py-1 rounded ${
                  spot.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-700' :
                  spot.rarity === 'rare' ? 'bg-purple-100 text-purple-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {spot.rarity.toUpperCase()}
                </span>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => onNavigate(spot)}
                    className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs rounded-lg hover:from-blue-600 hover:to-purple-600 flex items-center justify-center gap-1"
                  >
                    <Route className="h-3 w-3" />
                    Navigate
                  </button>
                  <button
                    onClick={() => onVisit(spot)}
                    className="flex-1 px-3 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white text-xs rounded-lg hover:from-green-600 hover:to-blue-600"
                  >
                    Check In
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        </div>
      ))}
    </>
  );
}

export default function MapComponent() {
  const [dangerAlert, setDangerAlert] = useState<any>(null);
  const [showEmergency, setShowEmergency] = useState(false);
  const [nftNotification, setNftNotification] = useState<any>(null);
  const [currentPosition, setCurrentPosition] = useState<[number, number]>([12.9716, 77.5946]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [weather, setWeather] = useState({ temp: 28, condition: 'Partly Cloudy' });
  const [routingControl, setRoutingControl] = useState<any>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    // @ts-ignore
    L.Marker.prototype.options.icon = UserIcon;
    
    // Simulate weather
    const temps = [26, 27, 28, 29, 30];
    const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Clear'];
    setWeather({
      temp: temps[Math.floor(Math.random() * temps.length)],
      condition: conditions[Math.floor(Math.random() * conditions.length)]
    });

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.log('Location access denied, using default location');
          setUserLocation([12.9716, 77.5946]);
        }
      );
    }
  }, []);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return '#ff0040';
      case 'medium': return '#ffff00';
      case 'low': return '#00ff41';
      default: return '#6b7280';
    }
  };

  const handleDangerAlert = (zone: any) => {
    setDangerAlert(zone);
    setTimeout(() => setDangerAlert(null), 5000);
  };

  const handleNavigate = (spot: any) => {
    if (!userLocation) {
      alert('Getting your location... Please try again in a moment.');
      return;
    }

    // Remove existing route if any
    if (routingControl && mapRef.current) {
      mapRef.current.removeControl(routingControl);
    }

    // Create new route
    if (mapRef.current) {
      const control = (L as any).Routing.control({
        waypoints: [
          L.latLng(userLocation[0], userLocation[1]),
          L.latLng(spot.position[0], spot.position[1])
        ],
        routeWhileDragging: false,
        lineOptions: {
          styles: [{ color: '#3b82f6', weight: 4, opacity: 0.8 }]
        },
        show: true,
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
        showAlternatives: false,
        createMarker: () => null  // Don't create default markers
      }).addTo(mapRef.current);

      setRoutingControl(control);
      SoundManager.playClick();

      // Show route info
      control.on('routesfound', (e: any) => {
        const routes = e.routes;
        const summary = routes[0].summary;
        const distance = (summary.totalDistance / 1000).toFixed(1);
        const time = Math.round(summary.totalTime / 60);
        
        alert(`🗺️ Route to ${spot.name}\n\n📍 Distance: ${distance} km\n⏱️ Time: ${time} minutes\n\nBlue line shows the fastest route!`);
      });
    }
  };

  const handleTouristVisit = (spot: any) => {
    // Get emoji icon based on category
    const getIcon = (category: string) => {
      const icons: { [key: string]: string } = {
        'Wildlife': '🐅',
        'Nature': '🌳',
        'Heritage': '🏛️',
        'Spiritual': '🛕',
        'Adventure': '⛰️',
        'Entertainment': '🎢'
      };
      return icons[category] || '📍';
    };

    const nft = {
      id: `nft-${Date.now()}`,
      name: spot.name,
      icon: getIcon(spot.category),
      image: spot.image, // Save actual image URL
      location: `${spot.position[0].toFixed(4)}, ${spot.position[1].toFixed(4)}`,
      date: new Date().toLocaleDateString(),
      rarity: spot.rarity,
      description: spot.description
    };
    
    const existingNFTs = JSON.parse(localStorage.getItem('aegis-nfts') || '[]');
    localStorage.setItem('aegis-nfts', JSON.stringify([...existingNFTs, nft]));
    
    setNftNotification(spot);
    setTimeout(() => setNftNotification(null), 5000);
  };

  const handleEmergencyCall = (type: 'police' | 'hospital') => {
    const number = type === 'police' ? '100' : '108';
    alert(`Calling ${type === 'police' ? 'Police' : 'Ambulance'} at ${number}\n\nLocation: ${currentPosition[0].toFixed(4)}, ${currentPosition[1].toFixed(4)}\n\nIn production, this would initiate a real call.`);
  };

  return (
    <>
      <div className="relative h-screen w-full bg-black">
        <MapContainer 
          center={[12.9716, 77.5946]} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
          zoomControl={false}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {dangerZones.map((zone, index) => (
            <Circle
              key={index}
              center={zone.position}
              radius={zone.radius}
              pathOptions={{
                color: getRiskColor(zone.risk),
                fillColor: getRiskColor(zone.risk),
                fillOpacity: 0.2,
                weight: 3,
                opacity: 0.8,
              }}
            >
              <Popup>
                <div className="text-center p-2 min-w-[200px]">
                  <AlertTriangle 
                    className="h-6 w-6 mx-auto mb-2" 
                    style={{ color: getRiskColor(zone.risk) }} 
                  />
                  <strong className="text-sm">{zone.name}</strong>
                  <br />
                  <span className={`text-xs font-semibold px-2 py-1 rounded mt-1 inline-block ${
                    zone.risk === 'high' ? 'bg-red-100 text-red-700' :
                    zone.risk === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {zone.risk.toUpperCase()} RISK
                  </span>
                  <p className="text-xs text-gray-600 mt-2">{zone.description}</p>
                </div>
              </Popup>
            </Circle>
          ))}
          
          <LocationMarker />
          <DraggableMarker 
            onPositionChange={setCurrentPosition}
            onDangerAlert={handleDangerAlert}
          />
          <TouristSpotMarkers onVisit={handleTouristVisit} onNavigate={handleNavigate} />
        </MapContainer>

        {/* Weather Widget */}
        <div className="absolute top-4 left-4 bg-black/90 border-2 border-yellow-500 backdrop-blur-lg rounded-xl shadow-2xl p-4 z-[1000]">
          <div className="flex items-center gap-3">
            <Cloud className="h-8 w-8 text-yellow-400" />
            <div>
              <div className="text-2xl font-bold neon-text-yellow">{weather.temp}°C</div>
              <div className="text-xs text-gray-400">{weather.condition}</div>
            </div>
          </div>
        </div>

        {/* Danger Alert */}
        <AnimatePresence>
          {dangerAlert && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] max-w-md w-full mx-4"
            >
              <div className={`rounded-xl p-4 shadow-2xl border-2 ${
                dangerAlert.risk === 'high' ? 'bg-red-900/95 border-red-500' :
                dangerAlert.risk === 'medium' ? 'bg-yellow-900/95 border-yellow-500' :
                'bg-green-900/95 border-green-500'
              } backdrop-blur-lg`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-6 w-6 flex-shrink-0 mt-0.5" style={{ color: getRiskColor(dangerAlert.risk) }} />
                    <div>
                      <h3 className="font-bold text-white mb-1">⚠️ Entering {dangerAlert.risk.toUpperCase()} Risk Zone</h3>
                      <p className="text-sm text-white/90 mb-2">{dangerAlert.name}</p>
                      <p className="text-xs text-white/75">{dangerAlert.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setDangerAlert(null)}
                    className="text-white/75 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* NFT Notification */}
        <AnimatePresence>
          {nftNotification && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[1000]"
            >
              <div className="bg-black border-4 border-yellow-500 rounded-2xl p-8 shadow-2xl text-center max-w-sm">
                <div className="text-6xl mb-4">{emojiMap[nftNotification.id] || '📍'}</div>
                <img src={nftNotification.image} alt={nftNotification.name} className="w-32 h-32 mx-auto rounded-xl mb-4 object-cover border-2 border-green-500" />
                <h3 className="text-2xl font-bold neon-text-yellow mb-2">🎉 NFT Unlocked!</h3>
                <p className="text-gray-300 mb-4">You've visited {nftNotification.name}</p>
                <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm mb-4">
                  <p className="text-sm text-white">{nftNotification.description}</p>
                </div>
                <button
                  onClick={() => setNftNotification(null)}
                  className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-green-500 text-black rounded-lg font-semibold hover:from-yellow-600 hover:to-green-600"
                >
                  Awesome!
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Legend */}
        <div className="absolute top-4 right-4 bg-black/90 border-2 border-green-500 backdrop-blur-lg rounded-xl shadow-2xl p-4 z-[1000]">
          <h3 className="font-bold text-sm mb-3 neon-text-green flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Map Legend
          </h3>
          <div className="space-y-2">
            <div className="flex items-center text-xs">
              <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: '#ff0040', boxShadow: '0 0 10px #ff0040' }}></div>
              <span className="text-white font-medium">High Risk</span>
            </div>
            <div className="flex items-center text-xs">
              <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: '#ffff00', boxShadow: '0 0 10px #ffff00' }}></div>
              <span className="text-white font-medium">Medium Risk</span>
            </div>
            <div className="flex items-center text-xs">
              <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: '#00ff41', boxShadow: '0 0 10px #00ff41' }}></div>
              <span className="text-white font-medium">Safe Zone (NFT)</span>
            </div>
          </div>
        </div>

        {/* Emergency Button */}
        <button
          onClick={() => setShowEmergency(!showEmergency)}
          className="absolute bottom-24 right-4 w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 rounded-full shadow-2xl z-[1000] flex items-center justify-center text-white font-bold text-2xl border-4 border-white"
          style={{ animation: 'pulse 2s infinite' }}
        >
          🚨
        </button>

        {/* Emergency Panel */}
        <AnimatePresence>
          {showEmergency && (
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="absolute bottom-24 right-24 bg-black/95 border-2 border-red-500 backdrop-blur-lg rounded-xl shadow-2xl p-6 z-[1000]"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold neon-text-red">Emergency</h3>
                <button onClick={() => setShowEmergency(false)} className="text-gray-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => handleEmergencyCall('police')}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all border-2 border-blue-400"
                >
                  <Phone className="h-5 w-5" />
                  Police (100)
                </button>
                <button
                  onClick={() => handleEmergencyCall('hospital')}
                  className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all border-2 border-red-400"
                >
                  <Hospital className="h-5 w-5" />
                  Ambulance (108)
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Navbar />
    </>
  );
}
