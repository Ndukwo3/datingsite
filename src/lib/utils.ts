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
