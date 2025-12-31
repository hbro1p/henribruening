import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import polyline from '@mapbox/polyline';
import { supabase } from '@/integrations/supabase/client';

interface RouteMapProps {
  polylineData?: string;
  className?: string;
}

const RouteMap: React.FC<RouteMapProps> = ({ polylineData, className = '' }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Mapbox token from edge function
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        if (error) throw error;
        if (data?.token) {
          setMapboxToken(data.token);
        } else {
          throw new Error('No token received');
        }
      } catch (err) {
        console.error('Failed to fetch Mapbox token:', err);
        setError('Map nicht verfügbar');
      } finally {
        setLoading(false);
      }
    };
    fetchToken();
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || !polylineData) return;

    // Decode polyline to coordinates
    let coordinates: [number, number][];
    try {
      coordinates = polyline.decode(polylineData).map(([lat, lng]) => [lng, lat] as [number, number]);
    } catch (err) {
      console.error('Failed to decode polyline:', err);
      setError('Route konnte nicht geladen werden');
      return;
    }

    if (coordinates.length === 0) return;

    mapboxgl.accessToken = mapboxToken;

    // Calculate bounds
    const bounds = coordinates.reduce(
      (acc, coord) => ({
        minLng: Math.min(acc.minLng, coord[0]),
        maxLng: Math.max(acc.maxLng, coord[0]),
        minLat: Math.min(acc.minLat, coord[1]),
        maxLat: Math.max(acc.maxLat, coord[1]),
      }),
      { minLng: Infinity, maxLng: -Infinity, minLat: Infinity, maxLat: -Infinity }
    );

    const center: [number, number] = [
      (bounds.minLng + bounds.maxLng) / 2,
      (bounds.minLat + bounds.maxLat) / 2,
    ];

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center,
      zoom: 13,
    });

    map.current.on('load', () => {
      if (!map.current) return;

      // Add the route line
      map.current.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates,
          },
        },
      });

      // Glow effect
      map.current.addLayer({
        id: 'route-glow',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#FC4C02',
          'line-width': 8,
          'line-opacity': 0.3,
          'line-blur': 3,
        },
      });

      // Main line
      map.current.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#FC4C02',
          'line-width': 4,
          'line-opacity': 1,
        },
      });

      // Start marker
      new mapboxgl.Marker({ color: '#22c55e' })
        .setLngLat(coordinates[0])
        .addTo(map.current);

      // End marker
      new mapboxgl.Marker({ color: '#ef4444' })
        .setLngLat(coordinates[coordinates.length - 1])
        .addTo(map.current);

      // Fit to route bounds
      map.current.fitBounds(
        [
          [bounds.minLng, bounds.minLat],
          [bounds.maxLng, bounds.maxLat],
        ],
        { padding: 40, maxZoom: 15 }
      );
    });

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, polylineData]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center bg-orange-100 rounded-xl ${className}`}>
        <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !polylineData) {
    return (
      <div className={`flex items-center justify-center bg-orange-100 rounded-xl ${className}`}>
        <p className="text-orange-600 font-pixel text-sm">{error || 'Keine Route verfügbar'}</p>
      </div>
    );
  }

  return (
    <div className={`relative rounded-xl overflow-hidden ${className}`}>
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default RouteMap;
