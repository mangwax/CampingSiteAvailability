import { useState } from 'react';
import type { Campsite, NotificationPreference } from '../types/campsite';

interface NotificationModalProps {
  campsite: Campsite | null;
  onClose: () => void;
  onSave: (pref: NotificationPreference) => void;
}

export function NotificationModal({ campsite, onClose, onSave }: NotificationModalProps) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [minSites, setMinSites] = useState(1);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!campsite) return null;

  const today = new Date().toISOString().split('T')[0];

  const validate = () => {
    const e: Record<string, string> = {};
    if (!checkIn) e.checkIn = 'Please select a check-in date.';
    if (!checkOut) e.checkOut = 'Please select a check-out date.';
    if (checkIn && checkOut && checkOut <= checkIn) {
      e.checkOut = 'Check-out must be after check-in.';
    }
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    const pref: NotificationPreference = {
      id: `notif-${Date.now()}`,
      campsiteId: campsite.id,
      campsiteName: campsite.name,
      bookingUrl: campsite.bookingUrl,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      minAvailableSites: minSites,
      active: true,
      createdAt: new Date(),
    };
    onSave(pref);
    setSaved(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">🔔 Setup Availability Alert</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {saved ? (
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Alert Created!</h3>
            <p className="text-green-700 font-medium mb-1">{campsite.name}</p>
            <p className="text-sm text-gray-500 mb-4">
              {checkIn} → {checkOut} · min. {minSites} site{minSites > 1 ? 's' : ''}
            </p>
            <p className="text-sm text-gray-600 mb-6">
              You'll be prompted for your email when availability changes. Check the Alerts tab to manage this alert.
            </p>
            <a
              href={campsite.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-2 mb-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-center"
            >
              🔗 View Campsite
            </a>
            <button
              onClick={onClose}
              className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4" noValidate>
            <div className="bg-green-50 rounded-lg p-3 text-sm text-green-800 flex items-center justify-between">
              <div>
                <strong>{campsite.name}</strong>
                <span className="text-green-600 ml-2">({campsite.region})</span>
              </div>
              <a
                href={campsite.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-700 hover:underline text-xs ml-3 shrink-0"
              >
                🔗 View site
              </a>
            </div>

            {campsite.status === 'unavailable' && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
                This campsite is currently full. Set an alert and you'll be notified when dates open up.
              </div>
            )}

            <p className="text-xs text-gray-500">
              Your email will be requested when we notify you — it is never stored by this site.
            </p>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                <input
                  type="date"
                  value={checkIn}
                  min={today}
                  onChange={(e) => { setCheckIn(e.target.value); setErrors((p) => ({ ...p, checkIn: '' })); }}
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.checkIn ? 'border-red-400' : 'border-gray-300'}`}
                />
                {errors.checkIn && <p className="text-xs text-red-500 mt-1">{errors.checkIn}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                <input
                  type="date"
                  value={checkOut}
                  min={checkIn || today}
                  onChange={(e) => { setCheckOut(e.target.value); setErrors((p) => ({ ...p, checkOut: '' })); }}
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.checkOut ? 'border-red-400' : 'border-gray-300'}`}
                />
                {errors.checkOut && <p className="text-xs text-red-500 mt-1">{errors.checkOut}</p>}
              </div>
            </div>

            {/* Min sites */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alert when at least{' '}
                <strong className="text-green-700">{minSites} site{minSites > 1 ? 's' : ''}</strong>{' '}
                become available
              </label>
              <input
                type="range"
                min={1}
                max={10}
                value={minSites}
                onChange={(e) => setMinSites(Number(e.target.value))}
                className="w-full accent-green-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                <span>1</span>
                <span>5</span>
                <span>10</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              🔔 Create Alert
            </button>
            <p className="text-xs text-center text-gray-400">
              You can manage your alerts in the Alerts tab.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
