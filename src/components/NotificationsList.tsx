import type { NotificationPreference } from '../types/campsite';

interface NotificationsListProps {
  notifications: NotificationPreference[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function NotificationsList({ notifications, onToggle, onDelete }: NotificationsListProps) {
  if (notifications.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="text-5xl mb-4">🔔</div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Alerts Set Up</h3>
        <p className="text-gray-500 text-sm">
          Go to the Dashboard tab and click <strong>"🔔 Notify"</strong> on any campsite to get
          notified when sites become available.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`bg-white rounded-2xl shadow-sm border p-4 flex items-start gap-4 transition-opacity ${
            n.active ? 'border-gray-200' : 'border-gray-100 opacity-60'
          }`}
        >
          <div className="text-2xl mt-0.5">{n.active ? '🔔' : '🔕'}</div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate">{n.campsiteName}</p>
            <p className="text-sm text-gray-600">{n.email}</p>
            <p className="text-sm text-gray-500">
              {n.checkInDate} → {n.checkOutDate} · min. {n.minAvailableSites} site
              {n.minAvailableSites > 1 ? 's' : ''}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Created {n.createdAt.toLocaleDateString()}
            </p>
          </div>
          <div className="flex flex-col gap-2 items-end shrink-0">
            <button
              onClick={() => onToggle(n.id)}
              className={`text-xs px-3 py-1 rounded-full border font-medium transition-colors ${
                n.active
                  ? 'border-green-400 text-green-700 hover:bg-green-50'
                  : 'border-gray-300 text-gray-500 hover:bg-gray-50'
              }`}
            >
              {n.active ? 'Active' : 'Paused'}
            </button>
            <button
              onClick={() => onDelete(n.id)}
              className="text-xs text-red-400 hover:text-red-600 hover:underline"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
