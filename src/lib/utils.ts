import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNowStrict, isToday, isYesterday, format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatActivity(lastSeen: Date | 'online'): string {
  if (lastSeen === 'online') {
    return 'Online';
  }
  return formatDistanceToNowStrict(lastSeen, { addSuffix: true });
}

export function formatMatchTime(timestamp: Date): string {
  if (isToday(timestamp)) {
    return "today";
  }
  if (isYesterday(timestamp)) {
    return "yesterday";
  }
  return formatDistanceToNowStrict(timestamp, { addSuffix: true });
}

/**
 * Calculates the distance between two geographical points using the Haversine formula.
 * @param lat1 Latitude of the first point
 * @param lon1 Longitude of the first point
 * @param lat2 Latitude of the second point
 * @param lon2 Longitude of the second point
 * @returns The distance in kilometers.
 */
export function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return Math.round(d);
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}
