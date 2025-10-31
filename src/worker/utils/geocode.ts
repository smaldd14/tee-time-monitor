import type { ZippopotamResponse } from '../types/zippopotamus';

// Helper function to geocode ZIP code to lat/long
export async function geocodeZipCode(zipCode: string): Promise<{ latitude: number; longitude: number }> {
  const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`);

  if (!response.ok) {
    throw new Error('Invalid ZIP code');
  }

  const data = await response.json() as ZippopotamResponse;

  if (!data.places || data.places.length === 0) {
    throw new Error('ZIP code not found');
  }

  return {
    latitude: parseFloat(data.places[0].latitude),
    longitude: parseFloat(data.places[0].longitude),
  };
}