import type { Campsite } from '../types/campsite';

interface CampsiteCardProps {
  campsite: Campsite;
  onSetupNotification: (campsite: Campsite) => void;
}

const STATUS_BADGE: Record<string, { label: string; classes: string }> = {
  available: { label: 'Available', classes: 'bg-green-100 text-green-800' },
  limited: { label: 'Limited', classes: 'bg-yellow-100 text-yellow-800' },
  unavailable: { label: 'Full', classes: 'bg-red-100 text-red-800' },
};

const TYPE_BADGE: Record<string, { label: string; classes: string }> = {
  bc_parks: { label: 'BC Parks', classes: 'bg-blue-100 text-blue-800' },
  private: { label: 'Private', classes: 'bg-purple-100 text-purple-800' },
};

export function CampsiteCard({ campsite, onSetupNotification }: CampsiteCardProps) {
  const statusBadge = STATUS_BADGE[campsite.status];
  const typeBadge = TYPE_BADGE[campsite.type];
  const occupancyPct = Math.round(
    ((campsite.totalSites - campsite.availableSites) / campsite.totalSites) * 100
  );

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
      <div className="relative h-44">
        <img
          src={campsite.imageUrl}
          alt={campsite.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&q=80';
          }}
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${typeBadge.classes}`}>
            {typeBadge.label}
          </span>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusBadge.classes}`}>
            {statusBadge.label}
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">{campsite.name}</h3>
        <p className="text-sm text-gray-500 mb-3">
          📍 {campsite.region}
        </p>

        {/* Occupancy bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>{campsite.availableSites} of {campsite.totalSites} sites available</span>
            <span>{occupancyPct}% full</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                campsite.status === 'available'
                  ? 'bg-green-500'
                  : campsite.status === 'limited'
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${occupancyPct}%` }}
            />
          </div>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1 mb-3">
          {campsite.amenities.slice(0, 4).map((a) => (
            <span key={a} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
              {a}
            </span>
          ))}
          {campsite.amenities.length > 4 && (
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
              +{campsite.amenities.length - 4} more
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <span className="text-xl font-bold text-gray-900">${campsite.pricePerNight}</span>
            <span className="text-sm text-gray-500"> / night</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onSetupNotification(campsite)}
              className="text-sm px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              title="Set up availability notification"
            >
              🔔 Notify
            </button>
            <a
              href={campsite.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-colors ${
                campsite.status !== 'unavailable'
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none'
              }`}
            >
              {campsite.status !== 'unavailable' ? 'Book' : 'Full'}
            </a>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-2">
          Updated {campsite.lastChecked.toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}
