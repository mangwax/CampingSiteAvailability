import type { Campsite } from '../types/campsite';

interface StatsBarProps {
  campsites: Campsite[];
}

export function StatsBar({ campsites }: StatsBarProps) {
  const totalSites = campsites.reduce((s, c) => s + c.totalSites, 0);
  const availableSites = campsites.reduce((s, c) => s + c.availableSites, 0);
  const availableParks = campsites.filter((c) => c.status === 'available').length;
  const limitedParks = campsites.filter((c) => c.status === 'limited').length;

  const stats = [
    { label: 'Parks Listed', value: campsites.length, icon: '🏕️', color: 'text-blue-700' },
    { label: 'Available Sites', value: availableSites.toLocaleString(), icon: '✅', color: 'text-green-700' },
    { label: 'Total Sites', value: totalSites.toLocaleString(), icon: '📊', color: 'text-gray-700' },
    { label: 'Open Parks', value: availableParks, icon: '🟢', color: 'text-green-700' },
    { label: 'Limited Parks', value: limitedParks, icon: '🟡', color: 'text-yellow-700' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
      {stats.map((s) => (
        <div key={s.label} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl mb-1">{s.icon}</div>
          <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
          <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
