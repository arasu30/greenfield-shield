<<<<<<< HEAD
import { MapContainer, TileLayer, Marker, Popup, Polygon, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';
=======
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import L from 'leaflet';
>>>>>>> 3a03a8bd81c806e4f287fe703a336e46abc71e5a

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
<<<<<<< HEAD
    currentPosition: { lat: number; lng: number } | null;
    boundary?: Array<{ lat: number; lng: number }>;
    isRecording?: boolean;
}

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

export const LocationMap = ({ currentPosition, boundary = [], isRecording }: LocationMapProps) => {
    const center = currentPosition || (boundary.length > 0 ? boundary[0] : { lat: 51.505, lng: -0.09 }); // Default or first point

    const polygonPositions = boundary.map(p => [p.lat, p.lng] as [number, number]);

    return (
        <div className="h-[300px] w-full rounded-lg overflow-hidden border border-cyan-500/30 shadow-lg relative z-0">
            <MapContainer
                center={[center.lat, center.lng]}
                zoom={18}
=======
    lat: number;
    lng: number;
}

export const LocationMap = ({ lat, lng }: LocationMapProps) => {
    return (
        <div className="h-[200px] w-full rounded-lg overflow-hidden border border-cyan-500/30 shadow-lg relative z-0">
            <MapContainer
                center={[lat, lng]}
                zoom={13}
>>>>>>> 3a03a8bd81c806e4f287fe703a336e46abc71e5a
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
<<<<<<< HEAD

                {/* Helper to keep map centered on user while recording */}
                {isRecording && <RecenterMap position={currentPosition} />}

                {/* Current Position Marker */}
                {currentPosition && (
                    <Marker position={[currentPosition.lat, currentPosition.lng]}>
                        <Popup>You are here</Popup>
                    </Marker>
                )}

                {/* The Boundary Polygon (fill when finished, line when recording might be better but polygon works) */}
                {boundary.length > 1 && (
                    <Polygon
                        positions={polygonPositions}
                        pathOptions={{ color: isRecording ? 'orange' : 'cyan', fillColor: isRecording ? 'transparent' : 'cyan', fillOpacity: 0.2 }}
                    />
                )}

                {/* Draw lines as they walk if polygon isn't clear enough */}
                {boundary.length > 1 && isRecording && (
                    <Polyline positions={polygonPositions} pathOptions={{ color: 'orange', dashArray: '5, 5' }} />
                )}

=======
                <Marker position={[lat, lng]}>
                    <Popup>
                        Your detected location.
                    </Popup>
                </Marker>
>>>>>>> 3a03a8bd81c806e4f287fe703a336e46abc71e5a
            </MapContainer>
        </div>
    );
};
