import { useState, useEffect } from 'react';
import DynamicMap from './DynamicMap';
import { LatLngExpression, LatLng } from 'leaflet';

interface LocationDisplayProps {
    // You can pass initial coordinates or fetch them from an API
    initialLocation?: LatLngExpression;
    locations?: Array<{
        position: LatLngExpression;
        name: string;
        color?: string;
    }>;
    enableClickToAdd?: boolean;
    showUserLocation?: boolean;
    enableSearch?: boolean;
    onLocationAdded?: (location: { position: LatLngExpression; name: string }) => void;
}

const LocationDisplay: React.FC<LocationDisplayProps> = ({
    initialLocation = [51.505, -0.09], // Default to London
    locations = [],
    enableClickToAdd = false,
    showUserLocation = false,
    enableSearch = true,
    onLocationAdded
}) => {
    const [center] = useState<LatLngExpression>(initialLocation);
    const [markers, setMarkers] = useState(
        locations.map(loc => ({
            position: loc.position,
            popup: loc.name,
            color: loc.color
        }))
    );

    // Example of updating locations dynamically
    useEffect(() => {
        setMarkers(
            locations.map(loc => ({
                position: loc.position,
                popup: loc.name,
                color: loc.color
            }))
        );
    }, [locations]);

    const handleMapClick = (latlng: LatLng) => {
        if (!enableClickToAdd) return;

        const newLocation = {
            position: [latlng.lat, latlng.lng] as LatLngExpression,
            name: `Location ${markers.length + 1}`,
            color: '#FF5722' // Custom color for clicked markers
        };

        setMarkers(prev => [...prev, {
            position: newLocation.position,
            popup: newLocation.name,
            color: newLocation.color
        }]);

        if (onLocationAdded) {
            onLocationAdded(newLocation);
        }
    };

    return (
        <div className="space-y-4">
            <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-lg">
                <DynamicMap
                    center={center}
                    markers={markers}
                    zoom={12}
                    className="h-full w-full"
                    onMapClick={enableClickToAdd ? handleMapClick : undefined}
                    showUserLocation={showUserLocation}
                    enableSearch={enableSearch}
                />
            </div>
            {enableClickToAdd && (
                <div className="text-sm text-gray-600">
                    Click on the map to add new locations
                </div>
            )}
        </div>
    );
};

export default LocationDisplay; 