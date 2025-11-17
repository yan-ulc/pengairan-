'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useMapEvents } from 'react-leaflet';
import type { LatLng } from 'leaflet';

// dynamic import untuk komponen utama react-leaflet
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  selectedLocation?: { lat: number; lng: number } | null;
}

function LocationMarker({
  onLocationSelect,
  selectedLocation,
}: MapPickerProps) {
  const [position, setPosition] = useState<LatLng | null>(
    selectedLocation
      ? ({ lat: selectedLocation.lat, lng: selectedLocation.lng } as LatLng)
      : null
  );

  useMapEvents({  
    click(e) {
      setPosition(e.latlng);
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  useEffect(() => {
    if (selectedLocation) {
      setPosition({
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
      } as LatLng);
    }
  }, [selectedLocation]);

  return position === null ? null : <Marker position={position} />;
}

export default function MapPicker({
  onLocationSelect,
  selectedLocation,
}: MapPickerProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    //@ts-ignore m 
    import('leaflet/dist/leaflet.css');

    import('leaflet').then((L) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });
    });
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center rounded-md">
        <p className="text-gray-600">Memuat peta...</p>
      </div>
    );
  }

  const defaultCenter: [number, number] = [-6.2088, 106.8456]; // Jakarta
  const center: [number, number] = selectedLocation
    ? [selectedLocation.lat, selectedLocation.lng]
    : defaultCenter;

  return (
    <div className="w-full h-[400px] rounded-md overflow-hidden border">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker
          onLocationSelect={onLocationSelect}
          selectedLocation={selectedLocation}
        />
      </MapContainer>
    </div>
  );
}
