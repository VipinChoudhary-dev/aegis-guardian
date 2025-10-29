'use client';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(
  () => import('@/components/MapComponent'),
  { ssr: false }
);

export default function MapPage() {
  return (
    <div className="h-screen w-full">
      <MapComponent />
    </div>
  );
}
