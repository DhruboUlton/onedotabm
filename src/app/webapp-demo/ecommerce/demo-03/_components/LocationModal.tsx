'use client';

import React, { useState } from 'react';
import { useStore } from '../_context/StoreContext';
import { MapPin, X, Navigation, Check } from 'lucide-react';

export function LocationModal() {
  const { isLocationModalOpen, closeLocationModal, locationFilter, setLocationFilter, showToast } = useStore();
  const [selectedCity, setSelectedCity] = useState(locationFilter.city || 'All Locations');
  const [radius, setRadius] = useState<number>(locationFilter.radiusMiles || 0);

  if (!isLocationModalOpen) return null;

  const popularCities = ['All Locations', 'San Francisco, CA', 'Austin, TX', 'Seattle, WA', 'Brooklyn, NY', 'Boston, MA'];

  const handleSave = () => {
    setLocationFilter({
      city: selectedCity,
      radiusMiles: radius,
    });
    showToast('Delivery Location Set', `Browsing products within ${radius === 0 ? 'any distance' : `${radius} miles`} of ${selectedCity}`, 'success');
    closeLocationModal();
  };

  const handleUseCurrentLocation = () => {
    setSelectedCity('San Francisco, CA');
    setRadius(25);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-900 dark:text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">Choose Your Delivery Location</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Filter local inventory and delivery speeds</p>
            </div>
          </div>
          <button
            onClick={closeLocationModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="py-4 space-y-4">
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-medium text-xs hover:bg-blue-100/60 dark:hover:bg-blue-900/40 transition-colors"
          >
            <Navigation className="w-4 h-4" />
            <span>Use Current Location (Auto-detect)</span>
          </button>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Select Metro Hub / City
            </label>
            <div className="grid grid-cols-2 gap-2">
              {popularCities.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => setSelectedCity(city)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium border text-left transition-all ${
                    selectedCity === city
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="truncate">{city}</span>
                  {selectedCity === city && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              <span>Delivery Radius</span>
              <span className="text-blue-600 dark:text-blue-400 font-bold">
                {radius === 0 ? 'Everywhere (Nationwide)' : `${radius} Miles`}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>Any</span>
              <span>25 mi</span>
              <span>50 mi</span>
              <span>100 mi</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2.5">
          <button
            type="button"
            onClick={closeLocationModal}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all active:scale-[0.98]"
          >
            Apply Location
          </button>
        </div>
      </div>
    </div>
  );
}
