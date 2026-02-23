export type CampsiteType = 'bc_parks' | 'private';

export type AvailabilityStatus = 'available' | 'limited' | 'unavailable';

export interface Campsite {
  id: string;
  name: string;
  park: string;
  region: string;
  type: CampsiteType;
  totalSites: number;
  availableSites: number;
  status: AvailabilityStatus;
  amenities: string[];
  pricePerNight: number;
  imageUrl: string;
  bookingUrl: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  lastChecked: Date;
}

export interface NotificationPreference {
  id: string;
  campsiteId: string;
  campsiteName: string;
  email: string;
  checkInDate: string;
  checkOutDate: string;
  minAvailableSites: number;
  active: boolean;
  createdAt: Date;
}

export interface DashboardFilters {
  search: string;
  type: CampsiteType | 'all';
  status: AvailabilityStatus | 'all';
  region: string;
  amenities: string[];
}
