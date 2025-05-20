import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { Box } from '@mui/material';

interface StaticMapProps {
  location: string;
}

const StaticMap = ({ location }: StaticMapProps) => {
  // Parse location string to [lat, lng]
  const [lat, lng] = location.split(',').map(Number);
  const position: [number, number] = [
    isNaN(lat) ? -1.9403 : lat, // Default to Rwanda's center
    isNaN(lng) ? 29.8739 : lng
  ];

  return (
    <Box sx={{ 
      width: '100%',
      '& .leaflet-container': {
        border: '1px solid rgba(0, 0, 0, 0.23)',
        borderRadius: '4px'
      }
    }}>
      <Box sx={{ 
        width: '100%',
        aspectRatio: '16/9',
        overflow: 'hidden'
      }}>
        <MapContainer
          center={position}
          zoom={8}
          style={{ width: '100%', height: '100%' }}
          dragging={false}
          scrollWheelZoom={false}
          zoomControl={false}
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
        </MapContainer>
      </Box>
    </Box>
  );
};

export default StaticMap; 