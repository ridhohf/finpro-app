const OPENCAGE_API_KEY = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;
const OPENCAGE_BASE_URL = "https://api.opencagedata.com/geocode/v1/json";

export interface GeocodingResult {
  formatted: string;
  lat: number;
  lng: number;
  components: {
    road?: string;
    suburb?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
}

class GeocodingService {
  // Forward Geocoding - Address to Coordinates
  async searchAddress(query: string, countryCode = "id"): Promise<GeocodingResult[]> {
    try {
      const params = new URLSearchParams({
        q: query,
        key: OPENCAGE_API_KEY!,
        countrycode: countryCode,
        limit: "5",
        no_annotations: "1",
      });

      const response = await fetch(`${OPENCAGE_BASE_URL}?${params.toString()}`);
      const data = await response.json();

      if (data.status.code !== 200) {
        throw new Error(data.status.message);
      }

      return data.results.map((result: any) => ({
        formatted: result.formatted,
        lat: result.geometry.lat,
        lng: result.geometry.lng,
        components: result.components,
      }));
    } catch (error) {
      console.error("Geocoding error:", error);
      return [];
    }
  }

  // Reverse Geocoding - Coordinates to Address
  async reverseGeocode(lat: number, lng: number): Promise<GeocodingResult | null> {
    try {
      const params = new URLSearchParams({
        q: `${lat},${lng}`,
        key: OPENCAGE_API_KEY!,
        no_annotations: "1",
      });

      const response = await fetch(`${OPENCAGE_BASE_URL}?${params.toString()}`);
      const data = await response.json();

      if (data.status.code !== 200 || !data.results.length) {
        return null;
      }

      const result = data.results[0];
      return {
        formatted: result.formatted,
        lat: result.geometry.lat,
        lng: result.geometry.lng,
        components: result.components,
      };
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      return null;
    }
  }

  // Get current location
  async getCurrentLocation(): Promise<{ lat: number; lng: number } | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          resolve(null);
        }
      );
    });
  }
}

export const geocodingService = new GeocodingService();