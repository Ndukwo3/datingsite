import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNowStrict } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatActivity(lastSeen: Date | 'online'): string {
  if (lastSeen === 'online') {
    return 'Online';
  }
  return formatDistanceToNowStrict(lastSeen, { addSuffix: true });
}
