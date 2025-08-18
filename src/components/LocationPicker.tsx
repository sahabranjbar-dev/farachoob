"use client";

import { Marker, useMapEvents } from "react-leaflet";
import { useState, useEffect } from "react";

interface Props {
  onChange: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
}

export default function LocationPicker({
  onChange,
  initialLat,
  initialLng,
}: Props) {
  const [position, setPosition] = useState<[number, number]>([
    initialLat || 35.6892,
    initialLng || 51.389,
  ]);

  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });

  useEffect(() => {
    onChange(position[0], position[1]);
  }, [position, onChange]);

  return (
    <Marker
      draggable
      position={position}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const latLng = marker.getLatLng();
          setPosition([latLng.lat, latLng.lng]);
          onChange(latLng.lat, latLng.lng);
        },
      }}
    />
  );
}
