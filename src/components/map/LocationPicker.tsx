import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { LatLng } from 'leaflet';
import { Box, Typography } from '@mui/material';

interface LocationPickerProps {
  value?: string;
  onChange: (location: string) => void;
}

// Component to handle map clicks
const MapClickHandler = ({ onLocationSelect }: { onLocationSelect: (latlng: LatLng) => void }) => {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng);
    },
  });
  return null;
};

const LocationPicker = ({ value, onChange }: LocationPickerProps) => {
  // Default center (Rwanda's center coordinates)
  const defaultCenter: [number, number] = [-1.9403, 29.8739]; // Center of Rwanda

  // Parse initial position from value if available
  const [position, setPosition] = useState<[number, number]>(() => {
    if (value) {
      const [lat, lng] = value.split(',').map(Number);
      return isNaN(lat) || isNaN(lng) ? defaultCenter : [lat, lng];
    }
    return defaultCenter;
  });

  // Try to get user's location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          // Only use user's location if it's within Rwanda's bounds
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          if (lat >= -2.8406 && lat <= -1.0474 && lng >= 28.8563 && lng <= 30.8989) {
            const newPos: [number, number] = [lat, lng];
            setPosition(newPos);
            onChange(`${newPos[0]},${newPos[1]}`);
          }
        },
        (error) => {
          console.log('Error getting location:', error);
        }
      );
    }
  }, []);

  const handleLocationSelect = (latlng: LatLng) => {
    const newPos: [number, number] = [latlng.lat, latlng.lng];
    setPosition(newPos);
    onChange(`${newPos[0]},${newPos[1]}`);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
        Click on the map to select a location in Rwanda
      </Typography>
      <Box sx={{ 
        width: '100%', 
        aspectRatio: '16/9',
        border: '1px solid rgba(0, 0, 0, 0.23)', 
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        <MapContainer
          center={position}
          zoom={8}
          style={{ width: '100%', height: '100%' }}
          maxBounds={[
            [-2.8406, 28.8563], // Southwest coordinates of Rwanda
            [-1.0474, 30.8989]  // Northeast coordinates of Rwanda
          ]}
          minZoom={7}
          maxZoom={18}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position} />
          <MapClickHandler onLocationSelect={handleLocationSelect} />
        </MapContainer>
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
        Selected: {position[0].toFixed(6)}, {position[1].toFixed(6)}
      </Typography>
    </Box>
  );
};

export default LocationPicker; 