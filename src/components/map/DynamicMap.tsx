import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMapEvents, useMap } from 'react-leaflet';
import { LatLngExpression, LatLng, Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import { Box, Paper, TextInput, Button, ActionIcon, Group, Text, Tooltip } from '@mantine/core';
import { IconSearch, IconCurrentLocation, IconMapPin } from '@tabler/icons-react';

// Fix for default marker icons in react-leaflet
import L from 'leaflet';
//import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Create different colored markers
const createColoredIcon = (color: string) => new Icon({
    iconUrl: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="${encodeURIComponent(color)}" d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"/></svg>`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: iconShadow,
    shadowSize: [41, 41]
});

let DefaultIcon = createColoredIcon('#2196f3');
L.Marker.prototype.options.icon = DefaultIcon;

interface MarkerData {
    position: LatLngExpression;
    popup?: string;
    color?: string;
}

interface DynamicMapProps {
    center: LatLngExpression;
    zoom?: number;
    markers?: MarkerData[];
    className?: string;
    onMapClick?: (latlng: LatLng) => void;
    showUserLocation?: boolean;
    enableSearch?: boolean;
}

// Location finder component
const LocationFinder = () => {
    const map = useMap();
    
    const handleLocate = () => {
        map.locate({ setView: true, maxZoom: 16 });
        
        map.on('locationfound', (e: L.LocationEvent) => {
            const radius = e.accuracy;
            L.marker(e.latlng, {
                icon: createColoredIcon('#4CAF50')
            }).addTo(map)
                .bindPopup("You are within " + radius + " meters from this point");
            
            L.circle(e.latlng, radius).addTo(map);
        });
        
        map.on('locationerror', (e) => {
            console.error('Error finding location:', e.message);
        });
    };
    
    return (
        <Box className="leaflet-top leaflet-right" style={{ marginTop: '10px', marginRight: '10px' }}>
            <Tooltip label="Find my location">
                <ActionIcon
                    variant="filled"
                    color="blue"
                    size="lg"
                    onClick={handleLocate}
                    className="leaflet-control"
                    style={{ backgroundColor: 'white', color: '#666' }}
                >
                    <IconCurrentLocation size={20} />
                </ActionIcon>
            </Tooltip>
        </Box>
    );
};

// Click handler component
const MapClickHandler = ({ onMapClick }: { onMapClick?: (latlng: LatLng) => void }) => {
    useMapEvents({
        click(e) {
            if (onMapClick) {
                onMapClick(e.latlng);
            }
        },
    });
    return null;
};

// Search control
const SearchControl = () => {
    const map = useMap();
    const [searchValue, setSearchValue] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async () => {
        if (!searchValue.trim()) return;
        
        setIsSearching(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchValue)}`
            );
            const data = await response.json();
            if (data && data[0]) {
                map.setView([data[0].lat, data[0].lon], 13);
            }
        } catch (error) {
            console.error('Error searching location:', error);
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <Box className="leaflet-top leaflet-left" style={{ margin: '10px' }}>
            <Paper shadow="sm" p="xs" className="leaflet-control" style={{ minWidth: '300px' }}>
                <Group>
                    <TextInput
                        placeholder="Search location..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.currentTarget.value)}
                        style={{ flex: 1 }}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        leftSection={<IconSearch size={16} />}
                        size="sm"
                    />
                    <Button 
                        variant="light"
                        size="sm"
                        onClick={handleSearch}
                        loading={isSearching}
                    >
                        Search
                    </Button>
                </Group>
            </Paper>
        </Box>
    );
};

const DynamicMap: React.FC<DynamicMapProps> = ({
    center = [-1.9403, 29.8739], // Center of Rwanda
    zoom = 8,
    markers = [],
    className = 'h-[400px] w-full',
    onMapClick,
    showUserLocation = false,
    enableSearch = false,
}) => {
    return (
        <Box className={className} style={{ position: 'relative' }}>
            <MapContainer
                center={center}
                zoom={zoom}
                style={{ height: '100%', width: '100%' }}
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
                <ZoomControl position="bottomright" />
                
                {markers.map((marker, index) => (
                    <Marker 
                        key={index} 
                        position={marker.position}
                        icon={marker.color ? createColoredIcon(marker.color) : DefaultIcon}
                    >
                        {marker.popup && (
                            <Popup>
                                <Box p="xs">
                                    <Text size="sm">{marker.popup}</Text>
                                </Box>
                            </Popup>
                        )}
                    </Marker>
                ))}
                
                {showUserLocation && <LocationFinder />}
                {onMapClick && <MapClickHandler onMapClick={onMapClick} />}
                {enableSearch && <SearchControl />}
            </MapContainer>

            {/* Map overlay for instructions or additional info */}
            {onMapClick && (
                <Box
                    style={{
                        position: 'absolute',
                        bottom: '20px',
                        left: '20px',
                        zIndex: 1000,
                    }}
                >
                    <Paper shadow="sm" p="xs" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                        <Group gap="xs">
                            <IconMapPin size={16} />
                            <Text size="sm">Click on the map to select a location</Text>
                        </Group>
                    </Paper>
                </Box>
            )}
        </Box>
    );
};

export default DynamicMap; 