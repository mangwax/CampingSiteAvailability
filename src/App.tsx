import { useState, useMemo } from 'react';
import { CAMPSITES } from './data/campsites';
import type { Campsite, DashboardFilters, NotificationPreference } from './types/campsite';
import { CampsiteCard } from './components/CampsiteCard';
import { FiltersBar } from './components/FiltersBar';
import { NotificationModal } from './components/NotificationModal';
import { NotificationsList } from './components/NotificationsList';
import { StatsBar } from './components/StatsBar';

const DEFAULT_FILTERS: DashboardFilters = {
  search: '',
  type: 'all',
  status: 'all',
  region: '',
  amenities: [],
};

type Tab = 'dashboard' | 'notifications';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [filters, setFilters] = useState<DashboardFilters>(DEFAULT_FILTERS);
  const [selectedCampsite, setSelectedCampsite] = useState<Campsite | null>(null);
  const [notifications, setNotifications] = useState<NotificationPreference[]>([]);

  const filtered = useMemo(() => {
    return CAMPSITES.filter((c) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!c.name.toLowerCase().includes(q) && !c.region.toLowerCase().includes(q)) return false;
      }
      if (filters.type !== 'all' && c.type !== filters.type) return false;
      if (filters.status !== 'all' && c.status !== filters.status) return false;
      if (filters.region && c.region !== filters.region) return false;
      if (filters.amenities.length > 0) {
        if (!filters.amenities.every((a) => c.amenities.includes(a))) return false;
      }
      return true;
    });
  }, [filters]);

  const handleSaveNotification = (pref: NotificationPreference) => {
    setNotifications((prev) => [pref, ...prev]);
  };

  const handleToggleNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, active: !n.active } : n))
    );
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-green-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏕️</span>
            <div>
              <h1 className="text-xl font-bold leading-tight">BC Campsite Availability</h1>
              <p className="text-green-200 text-xs">BC Parks &amp; Private Sites</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-white text-green-700'
                  : 'text-green-100 hover:bg-green-600'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                activeTab === 'notifications'
                  ? 'bg-white text-green-700'
                  : 'text-green-100 hover:bg-green-600'
              }`}
            >
              🔔 Alerts
              {notifications.filter((n) => n.active).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {notifications.filter((n) => n.active).length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'dashboard' ? (
          <>
            <StatsBar campsites={CAMPSITES} />
            <FiltersBar filters={filters} onChange={setFilters} />

            <div className="mt-5 flex items-center justify-between mb-3">
              <h2 className="text-gray-700 font-semibold">
                {filtered.length === CAMPSITES.length
                  ? `All ${filtered.length} campsites`
                  : `${filtered.length} of ${CAMPSITES.length} campsites`}
              </h2>
              <p className="text-xs text-gray-400">Auto-refreshes every 15 minutes</p>
            </div>

            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center mt-4">
                <div className="text-4xl mb-4">🔍</div>
                <p className="text-gray-600 font-medium">No campsites match your filters.</p>
                <button
                  onClick={() => setFilters(DEFAULT_FILTERS)}
                  className="mt-3 text-sm text-green-600 hover:underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filtered.map((c) => (
                  <CampsiteCard
                    key={c.id}
                    campsite={c}
                    onSetupNotification={setSelectedCampsite}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="mb-5">
              <h2 className="text-xl font-bold text-gray-900">Availability Alerts</h2>
              <p className="text-gray-500 text-sm mt-1">
                Get notified by email when your chosen campsites have openings for your dates.
              </p>
            </div>
            <NotificationsList
              notifications={notifications}
              onToggle={handleToggleNotification}
              onDelete={handleDeleteNotification}
            />
          </>
        )}
      </main>

      <NotificationModal
        campsite={selectedCampsite}
        onClose={() => setSelectedCampsite(null)}
        onSave={(pref) => {
          handleSaveNotification(pref);
        }}
      />
    </div>
  );
}

export default App;
