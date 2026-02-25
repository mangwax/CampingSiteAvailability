import { useState, useEffect } from 'react';
import type { Campsite } from '../types/campsite';
import { CAMPSITES } from '../data/campsites';

// The API_URL can be pointed at a real availability endpoint.
// When not set, the app falls back to the bundled static data.
const API_URL = import.meta.env.VITE_CAMPSITES_API_URL as string | undefined;

interface UseCampsitesResult {
  campsites: Campsite[];
  loading: boolean;
  error: string | null;
}

export function useCampsites(): UseCampsitesResult {
  const [campsites, setCampsites] = useState<Campsite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        if (API_URL) {
          const res = await fetch(API_URL);
          if (!res.ok) throw new Error(`Failed to fetch availability data (${res.status})`);
          const data: Campsite[] = await res.json();
          if (!cancelled) setCampsites(data);
        } else {
          // No external API configured — use bundled data.
          if (!cancelled) setCampsites(CAMPSITES);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unknown error');
          // Fall back to static data so the UI is still usable.
          setCampsites(CAMPSITES);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();

    // Auto-refresh every 15 minutes
    const interval = setInterval(fetchData, 15 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return { campsites, loading, error };
}
