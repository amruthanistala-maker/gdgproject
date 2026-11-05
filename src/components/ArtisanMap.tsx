import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Compass,
  Navigation,
  Layers,
  Sparkles,
  ArrowRight,
  Filter,
  ShieldCheck,
  Eye,
  Info,
  Maximize2,
  Globe2,
  Map as MapIcon,
  Flag
} from 'lucide-react';
import { ARTISAN_VILLAGES } from '../data/artisanData';
import { Village } from '../types/artisan';

interface ArtisanMapProps {
  onSelectVillageFilter: (villageName: string) => void;
}

// Major National Craft Corridors connected to Hands2Haven
const NATIONAL_HUBS = [
  { name: 'National Crafts Registry (New Delhi)', coordinates: [28.6139, 77.2090] as [number, number], state: 'Delhi NCR', craft: 'National Central Artisan Archive' },
  { name: 'Jaipur Heritage Guild', coordinates: [26.9124, 75.7873] as [number, number], state: 'Rajasthan', craft: 'Natural Vegetable Block Prints & Blue Pottery' },
  { name: 'Varanasi Weaver Federation', coordinates: [25.3176, 82.9739] as [number, number], state: 'Uttar Pradesh', craft: 'Pure Handloom Zari Brocades' },
  { name: 'Kanchipuram Silk Guild', coordinates: [12.8342, 79.7036] as [number, number], state: 'Tamil Nadu', craft: 'Mulberry Silk Handweaving' },
];

export const ArtisanMap: React.FC<ArtisanMapProps> = ({ onSelectVillageFilter }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  const [selectedVillage, setSelectedVillage] = useState<Village>(ARTISAN_VILLAGES[0]);
  const [mapMode, setMapMode] = useState<'osm' | 'terrain'>('osm');
  const [viewScope, setViewScope] = useState<'india' | 'ap_telangana'>('india');
  const [activeTabMode, setActiveTabMode] = useState<'gis' | 'vector'>('gis');

  // Initialize Leaflet India Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Centered around the heart of India
    const initialCenter = viewScope === 'india' ? [21.5, 80.5] : [16.8, 80.6];
    const initialZoom = viewScope === 'india' ? 5 : 7.5;

    const map = L.map(mapContainerRef.current, {
      center: initialCenter as [number, number],
      zoom: initialZoom,
      minZoom: 4,
      maxZoom: 14,
      scrollWheelZoom: true,
    });

    mapInstanceRef.current = map;

    // Cartographic Voyager / OpenStreetMap base layer
    const tileLayerUrl =
      mapMode === 'osm'
        ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    L.tileLayer(tileLayerUrl, {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 18,
    }).addTo(map);

    markersRef.current = {};

    // 1. Add markers for all Artisan Villages
    ARTISAN_VILLAGES.forEach((village, idx) => {
      const customIcon = L.divIcon({
        className: 'custom-artisan-pin',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer; transform: translate(-50%, -100%);">
            <div style="
              background: ${idx < 8 ? '#b45309' : '#047857'};
              color: #ffffff;
              padding: 3px 8px;
              border-radius: 8px;
              font-size: 11px;
              font-weight: 700;
              white-space: nowrap;
              border: 1.5px solid #fef3c7;
              box-shadow: 0 4px 12px rgba(0,0,0,0.25);
              letter-spacing: 0.3px;
              display: flex;
              align-items: center;
              gap: 4px;
            ">
              <span>${village.name}</span>
            </div>
            <div style="
              width: 14px;
              height: 14px;
              background: ${idx < 8 ? '#d97706' : '#10b981'};
              border: 2px solid #ffffff;
              border-radius: 50%;
              margin-top: -3px;
              box-shadow: 0 0 10px ${idx < 8 ? '#d97706' : '#10b981'};
            "></div>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      const marker = L.marker(village.coordinates, { icon: customIcon }).addTo(map);
      markersRef.current[village.id] = marker;

      marker.on('click', () => {
        setSelectedVillage(village);
        map.flyTo(village.coordinates, 9, { duration: 1.2 });
      });
    });

    // 2. Add National Craft Corridors markers
    NATIONAL_HUBS.forEach((hub) => {
      const hubIcon = L.divIcon({
        className: 'custom-hub-pin',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%); opacity: 0.9;">
            <div style="
              background: #475569;
              color: #f8fafc;
              padding: 2px 6px;
              border-radius: 6px;
              font-size: 9px;
              font-weight: 600;
              white-space: nowrap;
              border: 1px solid #94a3b8;
            ">
              <span>${hub.name.split(' ')[0]}</span>
            </div>
            <div style="
              width: 8px;
              height: 8px;
              background: #64748b;
              border: 1.5px solid #ffffff;
              border-radius: 50%;
              margin-top: -2px;
            "></div>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      L.marker(hub.coordinates, { icon: hubIcon })
        .addTo(map)
        .bindPopup(`<strong>${hub.name}</strong><br/><span style="font-size:11px;">${hub.craft}</span>`);
    });

    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapMode, viewScope]);

  // Scope switcher
  const handleScopeChange = (scope: 'india' | 'ap_telangana') => {
    setViewScope(scope);
    if (!mapInstanceRef.current) return;
    if (scope === 'india') {
      mapInstanceRef.current.flyTo([21.5, 80.5], 5, { duration: 1.4 });
    } else {
      mapInstanceRef.current.flyTo([16.8, 80.6], 7.5, { duration: 1.4 });
    }
  };

  const handleSelectVillage = (village: Village) => {
    setSelectedVillage(village);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(village.coordinates, 9, { duration: 1.2 });
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-50/90 via-white to-amber-100/60 border border-amber-200/80 rounded-3xl p-6 sm:p-7 relative overflow-hidden shadow-xs">
        <div className="max-w-3xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <Globe2 className="w-3.5 h-3.5" />
            Official India Geographical Indications (GI) Cartography
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif">
            India Artisan Villages & Heritage Craft Map
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Explore traditional craft origins across the Indian subcontinent. Pinpointing accredited
            handicraft cooperatives across Andhra Pradesh & Telangana—including Etikoppaka, Kondapalli,
            Srikalahasti, and Nimmalakunta—linked with national artisan corridors.
          </p>
        </div>

        {/* View switcher buttons */}
        <div className="relative z-10 flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-amber-200/60">
          <button
            onClick={() => handleScopeChange('india')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewScope === 'india'
                ? 'bg-amber-700 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:text-stone-900 border border-stone-200'
            }`}
          >
            <Flag className="w-3.5 h-3.5" />
            All-India Map View
          </button>

          <button
            onClick={() => handleScopeChange('ap_telangana')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewScope === 'ap_telangana'
                ? 'bg-amber-700 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:text-stone-900 border border-stone-200'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-amber-700" />
            AP & Telangana Clusters (8 Villages)
          </button>

          <div className="ml-auto flex items-center gap-1 bg-white p-1 rounded-xl border border-stone-200 text-xs shadow-2xs">
            <button
              onClick={() => setActiveTabMode('gis')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                activeTabMode === 'gis' ? 'bg-amber-700 text-white font-bold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Interactive GIS Map
            </button>
            <button
              onClick={() => setActiveTabMode('vector')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                activeTabMode === 'vector' ? 'bg-amber-700 text-white font-bold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Illustrated India Map
            </button>
          </div>
        </div>
      </div>

      {/* Main Map + Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Map Container */}
        <div className="lg:col-span-8 flex flex-col space-y-3">
          {activeTabMode === 'gis' ? (
            /* Real Leaflet Map of India */
            <div className="relative w-full h-[540px] rounded-3xl overflow-hidden border border-stone-200 shadow-md bg-stone-100">
              <div ref={mapContainerRef} className="w-full h-full z-10" />

              {/* Top Controls */}
              <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                <button
                  onClick={() => setMapMode(mapMode === 'osm' ? 'terrain' : 'osm')}
                  className="px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md text-stone-800 hover:text-stone-950 border border-stone-200 text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all"
                >
                  <Layers className="w-3.5 h-3.5 text-amber-700" />
                  {mapMode === 'osm' ? 'Voyager' : 'OSM Tiles'}
                </button>
                <button
                  onClick={() => handleScopeChange(viewScope)}
                  className="p-2 rounded-xl bg-white/95 backdrop-blur-md text-stone-800 hover:text-stone-950 border border-stone-200 shadow-md transition-all"
                  title="Reset to center"
                >
                  <Navigation className="w-4 h-4 text-amber-700" />
                </button>
              </div>

              {/* Bottom Legend */}
              <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none">
                <div className="inline-flex flex-wrap items-center gap-3 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-stone-200 text-[11px] text-stone-700 pointer-events-auto shadow-md">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-600 shadow-xs shadow-amber-600" />
                    <span>8 Primary GI Villages</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shadow-xs shadow-emerald-600" />
                    <span>Tribal & Border Clusters</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-500" />
                    <span>National Partner Corridors</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Illustrated India Vector Map Overview */
            <div className="relative w-full h-[540px] rounded-3xl overflow-hidden border border-stone-200 shadow-md bg-gradient-to-br from-amber-50/60 via-white to-stone-50 p-6 flex flex-col items-center justify-center">
              <div className="text-center max-w-md mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  Subcontinent Craft Cartography
                </span>
                <h3 className="text-lg font-bold text-stone-900 mt-1 font-serif">
                  Indian Geographical Indications (GI) Landscape
                </h3>
              </div>

              {/* Stylized SVG Map of India with glowing craft nodes */}
              <div className="relative w-full max-w-md aspect-[4/5] flex items-center justify-center">
                <svg
                  viewBox="0 0 400 480"
                  className="w-full h-full drop-shadow-[0_4px_15px_rgba(180,83,9,0.1)]"
                >
                  {/* Stylized India Subcontinent Outline */}
                  <path
                    d="M 180,40 C 190,45 200,60 205,75 C 215,70 230,85 240,95 C 255,95 280,105 300,120 C 330,135 360,150 370,170 C 380,190 350,210 320,205 C 300,210 270,200 250,215 C 235,230 240,260 250,280 C 265,300 275,320 260,345 C 245,370 220,400 200,445 C 195,455 190,455 185,445 C 160,395 130,345 130,310 C 130,280 115,265 100,250 C 70,240 60,220 50,195 C 45,170 70,165 90,165 C 110,165 120,145 135,130 C 150,115 160,85 170,60 Z"
                    fill="#fef3c7"
                    stroke="#b45309"
                    strokeWidth="2.5"
                    strokeDasharray="4 2"
                    className="opacity-90"
                  />

                  {/* Deccan Plateau & Andhra-Telangana highlighted region */}
                  <path
                    d="M 170,240 C 210,230 240,250 255,290 C 260,320 240,360 215,385 C 180,360 160,320 155,270 Z"
                    fill="rgba(217, 119, 6, 0.2)"
                    stroke="#d97706"
                    strokeWidth="1.5"
                  />

                  {/* Village Pulse Nodes */}
                  {[
                    { name: 'Etikoppaka', x: 235, y: 275, col: '#b45309', id: 'etikoppaka' },
                    { name: 'Kondapalli', x: 215, y: 295, col: '#b45309', id: 'kondapalli' },
                    { name: 'Srikalahasti', x: 210, y: 350, col: '#b45309', id: 'srikalahasti' },
                    { name: 'Nimmalakunta', x: 190, y: 340, col: '#b45309', id: 'nimmalakunta' },
                    { name: 'Budithi', x: 250, y: 260, col: '#b45309', id: 'budithi' },
                    { name: 'Machilipatnam', x: 225, y: 305, col: '#b45309', id: 'machilipatnam' },
                    { name: 'Nirmal', x: 195, y: 245, col: '#b45309', id: 'nirmal' },
                    { name: 'Cheriyal', x: 205, y: 265, col: '#b45309', id: 'cheriyal' },
                    { name: 'Adilabad', x: 195, y: 230, col: '#059669', id: 'adilabad' },
                    { name: 'Araku Valley', x: 240, y: 260, col: '#059669', id: 'araku-valley' },
                  ].map((node) => (
                    <g
                      key={node.name}
                      className="cursor-pointer group"
                      onClick={() => {
                        const target = ARTISAN_VILLAGES.find((v) => v.id === node.id);
                        if (target) setSelectedVillage(target);
                      }}
                    >
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="8"
                        fill={node.col}
                        opacity="0.2"
                        className="animate-ping"
                      />
                      <circle cx={node.x} cy={node.y} r="4" fill={node.col} stroke="#ffffff" strokeWidth="1.5" />
                      <text
                        x={node.x + 7}
                        y={node.y + 3}
                        fontSize="8"
                        fill="#78350f"
                        fontWeight="bold"
                        className="pointer-events-none"
                      >
                        {node.name}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>

              <div className="text-[11px] text-stone-500 mt-2 text-center">
                Click any node on the India craft territory to view village dossier.
              </div>
            </div>
          )}

          {/* Quick Village Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {ARTISAN_VILLAGES.map((v) => (
              <button
                key={v.id}
                onClick={() => handleSelectVillage(v)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-semibold transition-all ${
                  selectedVillage.id === v.id
                    ? 'bg-amber-700 text-white font-bold shadow-xs'
                    : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
                }`}
              >
                {v.name}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Selected Village Dossier & Actions */}
        <div className="lg:col-span-4 bg-white border border-stone-200 rounded-3xl p-5 space-y-4 shadow-sm">
          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
            <img
              src={selectedVillage.imageUrl}
              alt={selectedVillage.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/30 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-stone-950">
                  {selectedVillage.giTagNumber}
                </span>
                <span className="text-[11px] text-amber-200">{selectedVillage.state}</span>
              </div>
              <h3 className="text-xl font-bold text-white mt-0.5">{selectedVillage.name}</h3>
              <p className="text-xs text-stone-200">{selectedVillage.district}</p>
            </div>
          </div>

          {/* Specialization breakdown */}
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-900 block mb-1">
                Traditional Craft Specialization:
              </span>
              <p className="text-stone-700 leading-relaxed font-medium bg-amber-50/60 p-3 rounded-2xl border border-amber-200/70">
                {selectedVillage.specialty}
              </p>
            </div>

            <div className="space-y-2 bg-stone-50 p-3 rounded-2xl border border-stone-200 text-[11px]">
              <div className="flex justify-between text-stone-500">
                <span>Historical Era:</span>
                <span className="font-semibold text-stone-800 text-right max-w-[170px] truncate">
                  {selectedVillage.historicalEra}
                </span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Cooperative Society:</span>
                <span
                  className="font-semibold text-amber-800 text-right max-w-[170px] truncate"
                  title={selectedVillage.cooperativeName}
                >
                  {selectedVillage.cooperativeName}
                </span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Registered Guild Artisans:</span>
                <span className="font-semibold text-emerald-700">
                  ~{selectedVillage.artisanCount} Master Craftsmen
                </span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Coordinates:</span>
                <span className="font-mono text-[10px] text-stone-600">
                  {selectedVillage.coordinates[0].toFixed(4)}° N, {selectedVillage.coordinates[1].toFixed(4)}° E
                </span>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-900 block mb-1.5">
                Authentic Raw Materials:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedVillage.primaryMaterials.map((mat, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 border border-stone-200 text-[10px]"
                  >
                    {mat}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action to Filter Products from this Village */}
          <div className="pt-2 border-t border-stone-100">
            <button
              onClick={() => onSelectVillageFilter(selectedVillage.name)}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
            >
              <Filter className="w-4 h-4" />
              Filter & Book Crafts from {selectedVillage.name}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
