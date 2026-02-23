import type { DashboardFilters } from '../types/campsite';
import { ALL_REGIONS, ALL_AMENITIES } from '../data/campsites';

interface FiltersBarProps {
  filters: DashboardFilters;
  onChange: (filters: DashboardFilters) => void;
}

export function FiltersBar({ filters, onChange }: FiltersBarProps) {
  const update = (patch: Partial<DashboardFilters>) => onChange({ ...filters, ...patch });

  const toggleAmenity = (amenity: string) => {
    const next = filters.amenities.includes(amenity)
      ? filters.amenities.filter((a) => a !== amenity)
      : [...filters.amenities, amenity];
    update({ amenities: next });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 space-y-4">
      {/* Search */}
      <div className="relative">
        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">🔍</span>
        <input
          type="text"
          placeholder="Search by park name or region…"
          value={filters.search}
          onChange={(e) => update({ search: e.target.value })}
          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Type filter */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Type</label>
          <select
            value={filters.type}
            onChange={(e) => update({ type: e.target.value as DashboardFilters['type'] })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Types</option>
            <option value="bc_parks">BC Parks</option>
            <option value="private">Private</option>
          </select>
        </div>

        {/* Status filter */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Availability</label>
          <select
            value={filters.status}
            onChange={(e) => update({ status: e.target.value as DashboardFilters['status'] })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All</option>
            <option value="available">Available</option>
            <option value="limited">Limited</option>
            <option value="unavailable">Full</option>
          </select>
        </div>

        {/* Region filter */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Region</label>
          <select
            value={filters.region}
            onChange={(e) => update({ region: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">All Regions</option>
            {ALL_REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Amenities */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-2">Amenities</label>
        <div className="flex flex-wrap gap-2">
          {ALL_AMENITIES.map((amenity) => {
            const active = filters.amenities.includes(amenity);
            return (
              <button
                key={amenity}
                onClick={() => toggleAmenity(amenity)}
                className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                  active
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-green-400'
                }`}
              >
                {amenity}
              </button>
            );
          })}
        </div>
      </div>

      {/* Clear filters */}
      {(filters.search || filters.type !== 'all' || filters.status !== 'all' || filters.region || filters.amenities.length > 0) && (
        <button
          onClick={() => onChange({ search: '', type: 'all', status: 'all', region: '', amenities: [] })}
          className="text-sm text-red-500 hover:underline"
        >
          ✕ Clear all filters
        </button>
      )}
    </div>
  );
}
