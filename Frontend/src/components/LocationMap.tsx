import { MapContainer, TileLayer, Marker, Popup, Polygon, Polyline, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Fix for default marker icon missing in Leaflet + bundlers
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

interface LocationMapProps {
    currentPosition: { lat: number; lng: number } | null;
    boundary?: Array<{ lat: number; lng: number }>;
    isRecording?: boolean;
    onMapClick?: (lat: number, lng: number) => void;
}

// Component to handle map clicks
const MapClickHandler = ({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) => {
    useMapEvents({
        click: (e) => {
            if (onMapClick) {
                onMapClick(e.latlng.lat, e.latlng.lng);
            }
        },
    });
    return null;
};

// Component to fit map to boundary bounds
const FitBoundary = ({ boundary }: { boundary: Array<{ lat: number; lng: number }> }) => {
    const map = useMap();
    useEffect(() => {
        if (boundary.length >= 3) {
            const bounds = L.latLngBounds(boundary.map(p => [p.lat, p.lng]));
            map.fitBounds(bounds, { padding: [20, 20] });
        }
    }, [boundary, map]);
    return null;
};

// Component to recenter map when position changes
const RecenterMap = ({ position }: { position: { lat: number; lng: number } | null }) => {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.setView([position.lat, position.lng], map.getZoom());
        }
    }, [position, map]);
    return null;
};

export const LocationMap = ({ currentPosition, boundary = [], isRecording, onMapClick }: LocationMapProps) => {
    const center = currentPosition || (boundary.length > 0 ? boundary[boundary.length - 1] : { lat: 19.0760, lng: 72.8777 }); // Default to Mumbai or last point

    const polygonPositions = boundary.map(p => [p.lat, p.lng] as [number, number]);

    return (
        <div className="h-[300px] w-full rounded-lg overflow-hidden border border-white/[0.08] shadow-lg relative z-0">
            <MapContainer
                center={[center.lat, center.lng]}
                zoom={18}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Handle clicks for manual mapping */}
                <MapClickHandler onMapClick={onMapClick} />

                {/* Helper to keep map centered on user while recording */}
                {isRecording && <RecenterMap position={currentPosition} />}

                {/* Helper to fit bounds to boundary when not recording */}
                {!isRecording && boundary.length >= 3 && <FitBoundary boundary={boundary} />}

                {/* Current Position Marker */}
                {currentPosition && (
                    <Marker position={[currentPosition.lat, currentPosition.lng]}>
                        <Popup>You are here</Popup>
                    </Marker>
                )}

                {/* Draw markers for each point in the boundary to help with manual mapping */}
                {onMapClick && boundary.map((p, idx) => (
                    <Marker 
                        key={`boundary-marker-${idx}`} 
                        position={[p.lat, p.lng]}
                    />
                ))}

                {/* The Boundary Polygon */}
                {boundary.length > 1 && (
                    <Polygon
                        positions={polygonPositions}
                        pathOptions={{ 
                            color: isRecording ? '#f59e0b' : '#10b981', 
                            fillColor: isRecording ? 'transparent' : '#10b981', 
                            fillOpacity: 0.2,
                            weight: 3
                        }}
                    />
                )}

                {/* Draw lines as they walk if polygon isn't clear enough */}
                {boundary.length > 1 && isRecording && (
                    <Polyline positions={polygonPositions} pathOptions={{ color: 'orange', dashArray: '5, 5' }} />
                )}

            </MapContainer>
        </div>
    );
};
