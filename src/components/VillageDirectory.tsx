import React, { useState } from 'react';
import { MapPin, Users, Award, Compass, ChevronDown, ChevronUp, Sparkles, Filter, ExternalLink, X } from 'lucide-react';
import { ARTISAN_VILLAGES } from '../data/artisanData';
import { Village } from '../types/artisan';

interface VillageDirectoryProps {
  onSelectVillageFilter: (villageName: string) => void;
}

export const VillageDirectory: React.FC<VillageDirectoryProps> = ({ onSelectVillageFilter }) => {
  const [selectedVillage, setSelectedVillage] = useState<Village | null>(null);

  return (
    <div className="w-full space-y-6">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-amber-50/90 via-white to-amber-100/60 border border-amber-200/80 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xs">
        <div className="max-w-3xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <Compass className="w-3.5 h-3.5" />
            Official Heritage Clusters
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif">
            Traditional Artisan Villages & GI Guilds
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Explore the historical craft clusters of Andhra Pradesh and Telangana. Each village practices a
            centuries-old specialization protected by Geographical Indication (GI) registration.
          </p>
        </div>
      </div>

      {/* Village Grid (8 Primary Villages) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {ARTISAN_VILLAGES.map((village, idx) => (
          <div
            key={village.id}
            className="group bg-white border border-stone-200 rounded-3xl overflow-hidden hover:border-amber-400 hover:shadow-xl hover:shadow-amber-900/5 transition-all flex flex-col shadow-xs"
          >
            {/* Village Image */}
            <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
              <img
                src={village.imageUrl}
                alt={village.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />

              {/* Number and State badge */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center shadow">
                  {idx + 1}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/90 backdrop-blur-md text-stone-800 border border-stone-200 shadow-xs">
                  {village.state}
                </span>
              </div>

              <div className="absolute bottom-2.5 left-3 right-3">
                <h3 className="text-lg font-bold text-white drop-shadow-sm group-hover:text-amber-300 transition-colors">
                  {village.name}
                </h3>
                <div className="flex items-center gap-1 text-[11px] text-amber-200 font-medium">
                  <MapPin className="w-3 h-3 text-amber-300 shrink-0" />
                  <span>{village.district}</span>
                </div>
              </div>
            </div>

            {/* Content & Specialty */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-900 block mb-1">
                  Traditional Craft Specialization:
                </span>
                <p className="text-stone-700 line-clamp-3 leading-relaxed font-medium">
                  {village.specialty}
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-stone-100 text-[11px]">
                <div className="flex items-center justify-between text-stone-500">
                  <span>GI Status:</span>
                  <span className="font-semibold text-amber-900">{village.giTagNumber}</span>
                </div>
                <div className="flex items-center justify-between text-stone-500">
                  <span>Primary Cooperative:</span>
                  <span className="text-stone-800 font-medium truncate max-w-[140px]" title={village.cooperativeName}>
                    {village.hubName}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => onSelectVillageFilter(village.name)}
                  className="flex-1 py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-700 text-amber-900 hover:text-white font-bold text-xs border border-amber-300 flex items-center justify-center gap-1.5 transition-all shadow-xs"
                >
                  <Filter className="w-3.5 h-3.5" />
                  Filter Crafts
                </button>
                <button
                  onClick={() => setSelectedVillage(village)}
                  className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                  title="View complete historical dossier"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Village Details Modal */}
      {selectedVillage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-stone-200 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="relative aspect-video">
              <img
                src={selectedVillage.imageUrl}
                alt={selectedVillage.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/30 to-transparent" />
              <button
                onClick={() => setSelectedVillage(null)}
                className="absolute top-3 right-3 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-xl backdrop-blur-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-5 right-5">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-stone-950">
                  {selectedVillage.giTagNumber}
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">{selectedVillage.name}</h3>
                <p className="text-xs text-amber-200">
                  {selectedVillage.district}, {selectedVillage.state}
                </p>
              </div>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto text-xs leading-relaxed text-stone-700">
              <div>
                <h4 className="font-bold text-amber-900 uppercase tracking-wider text-[11px] mb-1">
                  Heritage & Craft Legacy
                </h4>
                <p className="text-stone-700">{selectedVillage.description}</p>
              </div>

              <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200/80 space-y-1.5">
                <div className="text-stone-600">
                  <strong className="text-stone-900">Historical Era:</strong>{' '}
                  {selectedVillage.historicalEra}
                </div>
                <div className="text-stone-600">
                  <strong className="text-stone-900">Cooperative Society:</strong>{' '}
                  {selectedVillage.cooperativeName}
                </div>
                <div className="text-stone-600">
                  <strong className="text-stone-900">Active Guild Artisans:</strong> ~
                  {selectedVillage.artisanCount} registered master craftsmen
                </div>
              </div>

              <div>
                <h4 className="font-bold text-amber-900 uppercase tracking-wider text-[11px] mb-1.5">
                  Primary Raw Materials
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedVillage.primaryMaterials.map((mat, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 border border-stone-200 text-[11px]"
                    >
                      {mat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-stone-100">
                <button
                  onClick={() => setSelectedVillage(null)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    onSelectVillageFilter(selectedVillage.name);
                    setSelectedVillage(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-bold"
                >
                  View Crafts from {selectedVillage.name}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
